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
    const { prompt, height, width, numberOfOutputs } = await req.json();

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

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let allImages;

    //Generate image using SDXL
    allImages = await replicate.run(
      "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
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

    // Upload the generated images to Cloudinary
    const uploadedImages = await Promise.all(
      allImages.map(async (image) => {
        const uploadResult = await UploadImage(image, "Text2Image");
        return uploadResult.secure_url;
      })
    );

    const newImageIds = [];

    const newImages = await Promise.all(
      uploadedImages.map(async (image) => {
        const newImage = new Image({
          userId,
          url: image,
          prompt,
          miscData: {
            dimensions: `${width}x${height}`,
            modelName: "Stable Diffusion XL",
          },
        });
        await newImage.save();

        newImageIds.push(newImage._id);

        return newImage;
      })
    );

    const library = new Library({
      userId,
      images: newImageIds,
    });
    await library.save();

    return NextResponse.json(
      { success: true, data: newImages },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
