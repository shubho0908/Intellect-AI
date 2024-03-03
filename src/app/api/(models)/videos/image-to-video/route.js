import { ConnectDB } from "@/database";
import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { Videos } from "@/models/videos.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, image, dimensions } = await req.json();

    //Check if user id is available
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Check if access token is available
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      const { accessToken } = generateAccessToken({ id }, "1h");
      cookies().set("accessToken", accessToken);
    }

    //Generate video
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          cond_aug: 0.02,
          decoding_t: 7,
          input_image: image,
          video_length: "25_frames_with_svd_xt",
          sizing_strategy: "maintain_aspect_ratio",
          motion_bucket_id: 127,
          frames_per_second: 8,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadVideo(output);

    const newVideo = new Videos({
      userId: id,
      url: result.url,
      miscData: {
        modelName: "Stable Diffusion",
        dimensions,
      },
    });

    await newVideo.save();
    const library = await Library.findOne({ userId: id });
    library.videos.push(newVideo._id);
    await library.save();
    return NextResponse.json(
      { success: true, data: newVideo },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
