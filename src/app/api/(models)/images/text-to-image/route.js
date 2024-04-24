import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { UploadImage } from "@/lib/cloudinary";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { prompt, height, width, numberOfOutputs, model } = await req.json();

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

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let allImages;

    //Generate image using SDXL
    if (model === "Sdxl") {
      allImages = await replicate.run(
        "lucataco/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
        {
          input: {
            seed: 2992471961,
            width,
            height,
            prompt,
            scheduler: "K_EULER",
            num_outputs: numberOfOutputs,
            guidance_scale: 0,
            negative_prompt:
              "nude, explicit, NSFW, gore, graphic, low quality, blurry, pixelated, low resolution, not good enough, subpar, unacceptable, disappointing, uninspired, underwhelming, unimpressive, uninteresting, boring, lackluster, overexposed, overlit, grainy, noisy, pixelated, low-res, low-quality, low-resolution, blurry, grainy, overexposed, overlit, pixelated, low-resolution, low-quality, low-resolution, uninspiring, disappointing, mediocre, bad, poor, substandard, unacceptable, unimpressive, uninteresting, boring, lackluster",
            num_inference_steps: 4,
          },
        }
      );
    }

    //Generate image using Dreamshaper
    else if (model === "dreamshaper") {
      allImages = await replicate.run(
        "lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615",
        {
          input: {
            width,
            height,
            prompt,
            scheduler: "K_EULER",
            num_outputs: numberOfOutputs,
            guidance_scale: 2,
            negative_prompt:
              "nude, explicit, NSFW, gore, graphic, low quality, blurry, pixelated, low resolution, not good enough, subpar, unacceptable, disappointing, uninspired, underwhelming, unimpressive, uninteresting, boring, lackluster, overexposed, overlit, grainy, noisy, pixelated, low-res, low-quality, low-resolution, blurry, grainy, overexposed, overlit, pixelated, low-resolution, low-quality, low-resolution, uninspiring, disappointing, mediocre, bad, poor, substandard, unacceptable, unimpressive, uninteresting, boring, lackluster,ugly, deformed, noisy, blurry, low contrast, text, BadDream, 3d, cgi, render, fake, anime, open mouth, big forehead, long neck",
            num_inference_steps: 7,
            apply_watermark: false,
          },
        }
      );
    }

    // Upload the generated images to Cloudinary
    const uploadedImages = await Promise.all(
      allImages.map(async (image) => {
        const uploadResult = await UploadImage(image);
        return uploadResult.url;
      })
    );

    const newImage = new Image({
      userId: id,
      urls: uploadedImages,
      prompt,
      miscData: {
        dimensions: `${width}x${height}`,
        modelName: "Stable Diffusion XL",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId: id });
    if (library) {
      library?.images.push(newImage._id);
      await library.save();
    } else {
      const newLibrary = new Library({
        userId: id,
        images: [newImage._id],
      });
      await newLibrary.save();
    }

    return NextResponse.json(
      { success: true, data: newImage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
