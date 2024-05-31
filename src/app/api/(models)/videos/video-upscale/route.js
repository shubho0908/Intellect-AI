import { ConnectDB } from "@/database";
import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { model, resolution, video } = await req.json();

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

    //Generate video
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "lucataco/real-esrgan-video:c23768236472c41b7a121ee735c8073e29080c01b32907740cfada61bff75320",
      {
        input: {
          model,
          resolution,
          video_path: video,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadVideo(output, "videoUpscaler");

    const newVideo = new Video({
      userId,
      url: result?.secure_url,
      miscData: {
        modelName: model,
      },
    });

    await newVideo.save();
    const library = await Library.findOne({ userId });
    library.videos.push(newVideo._id);
    await library.save();

     // Nodemailer configuration
     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const videoUrl = result?.secure_url;
    const user = await User.findOne({ _id: userId });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Your Video is upscaled successfully 🤘🏻`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <h2 style="color: #333;">Hello ${user?.name}!</h2>
        <p style="color: #555;">Your Video is upscaled successfully! You can use it to create your own content with the power of AI.</p>
        <p style="margin: 20px 0;">
          <a href="${videoUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Access your video</a>
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
      { success: true, data: newVideo?.url },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
