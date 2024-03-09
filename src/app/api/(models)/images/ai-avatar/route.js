import { ConnectDB } from "@/database";
import { UploadImage } from "@/lib/cloudinary";
import { generateAccessToken, validateTokens, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { image, prompt, height, width } = await req.json();

    // Check if refresh token is available
    const refreshTokenValue = cookies().get("refreshToken")?.value;
    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    // Check if the refresh token is expired
    try {
      verifyToken(refreshTokenValue);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 404 }
      );
    }

    // Check if access token is available
    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
      try {
        // Try to generate a new access token using the refresh token
        const payload = verifyToken(refreshTokenValue);
        const newToken = generateAccessToken({ id: payload.id }, "1h");
        cookies().set("accessToken", newToken);
        return NextResponse.json(
          {
            success: true,
            message: "New token generated",
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 404 }
        );
      }
    }

    // Verify the access token
    let id;
    try {
      const payload = verifyToken(accessToken);
      id = payload.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Generate image
    // const replicate = new Replicate({
    //   auth: process.env.REPLICATE_API_TOKEN,
    // });
    // const output = await replicate.run(
    //   "tgohblio/instant-id-albedobase-xl:2a2afbff09996b53247b0714577d4ff82d2c9da8e8b00c5499b5b34510bb8b5e",
    //   {
    //     input: {
    //       image,
    //       width,
    //       height,
    //       prompt,
    //       guidance_scale: 0,
    //       safety_checker: true,
    //       negative_prompt: "",
    //       ip_adapter_scale: 0.2,
    //       num_inference_steps: 6,
    //       controlnet_conditioning_scale: 0.8,
    //     },
    //   }
    // );

    // // Save image to Cloudinary
    // const result = await UploadImage(output);

    // const newImage = new Image({
    //   userId: id,
    //   url: result.url,
    //   prompt,
    //   miscData: {
    //     dimensions: `${width}x${height}`,
    //     modelName: "Instant ID",
    //   },
    // });

    // await newImage.save();

    // const library = await Library.findOne({ userId: id });
    // library.images.push(newImage._id);
    // await library.save();

    return NextResponse.json({ success: true, data: id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
