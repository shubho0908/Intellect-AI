import { ConnectDB } from "@/database";
import { UploadImage } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import nodemailer from "nodemailer";
import { User } from "@/models/user.models";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { image, prompt } = await req.json();

    const accessTokenValue = cookies().get("accessToken")?.value;
    const refreshTokenValue = cookies().get("refreshToken")?.value;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: "Missing refresh token" },
        { status: 401 }
      );
    }

    //Check if refresh token is expired
    try {
      verifyToken(refreshTokenValue);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      );
    }

    let userId;

    try {
      const decodedAccess = verifyToken(accessTokenValue);
      userId = decodedAccess?.id;
    } catch (error) {
      const decodedRefresh = verifyToken(refreshTokenValue);
      userId = decodedRefresh?.id;
      if (userId) {
        const newAccessToken = generateAccessToken({ id: userId }, "1h");
        cookies().set("accessToken", newAccessToken);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid tokens" },
        { status: 401 }
      );
    }

    //Generate image
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "tgohblio/instant-id-albedobase-xl:2a2afbff09996b53247b0714577d4ff82d2c9da8e8b00c5499b5b34510bb8b5e",
      {
        input: {
          image,
          width: 640,
          height: 640,
          prompt,
          guidance_scale: 0,
          safety_checker: true,
          negative_prompt:
            "ugly face, uneven face, multiple faces, un-even fingers",
          ip_adapter_scale: 0.2,
          num_inference_steps: 6,
          controlnet_conditioning_scale: 0.8,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadImage(output, "Avatar");

    const newImage = new Image({
      userId,
      url: result?.secure_url,
      prompt,
      miscData: {
        dimensions: `640x640`,
        modelName: "Instant ID",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId });
    library.images.push(newImage._id);
    await library.save();

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const imageUrl = result?.secure_url;
    const user = await User.findOne({ _id: userId });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Your AI Avatar is ready 🤘🏻`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #333;">Hello ${user?.name}!</h2>
        <p style="color: #555;">Your AI Avatar is ready! You can use it to create your own content with the power of AI.</p>
        <p style="margin: 20px 0;">
          <a href="${imageUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Access your AI Avatar</a>
        </p>
        <p style="color: #888;">Best regards,<br/>Shubhojeet Bera</p>
      </div>
          `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return NextResponse.json(
          {
            success: false,
            message: "Error sending email",
          },
          { status: 404 }
        );
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return NextResponse.json(
      { success: true, image: newImage?.url, prompt, data: newImage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
