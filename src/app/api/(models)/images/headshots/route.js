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
    const { image, prompt, height, width, numberOfOutputs } =
      await req.json();
    
      //Check if access token is available
    const token = cookies().get("accessToken");
    const refreshToken = cookies().get("refreshToken");
    if (!refreshToken || !refreshToken.value) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }
    if (!token || !token.value) {
      const payload = verifyToken(refreshToken);
      generateAccessToken({ id: payload.id }, "1h");
    }

    const payload = verifyToken(token.value);
    const { id } = payload;

    //Generate image
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "aaronbesson/profilepics:17df12b193ef8b6698e35a62508867134c2857c3696009fd245f4e05babf4fb6",
      {
        input: {
          image,
          width,
          height,
          prompt,
          num_images: numberOfOutputs,
          guidance_scale: 2.5,
          negative_prompt:
            "older, eyes, crowfoot, crows feet, crows foot, old, wrinkles, (lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured (lowres, low quality, worst quality:1.2), (text:1.2), watermark, painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured, bad hands",
          ip_adapter_scale: 0.8,
          num_inference_steps: 50,
          controlnet_conditioning_scale: 0.6,
        },
      }
    );

    // Save image to Cloudinary
    let allImages = await Promise.all(
      output.map(async (element) => {
        const result = await UploadImage(element);
        console.log(result);
        return result?.url;
      })
    );

    const newImage = new Image({
      userId: id,
      url: JSON.stringify(allImages),
      prompt,
      miscData: {
        dimensions: `${width}x${height}`,
        modelName: "Profilepics",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId: id });
    library.images.push(newImage._id);
    await library.save();

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
