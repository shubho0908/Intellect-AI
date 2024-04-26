import { ConnectDB } from "@/database";
import { UploadImage } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

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
      urls: [result?.secure_url],
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

    return NextResponse.json(
      { success: true, data: newImage?.urls[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
