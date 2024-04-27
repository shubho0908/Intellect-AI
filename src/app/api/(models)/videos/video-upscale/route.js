import { ConnectDB } from "@/database";
import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

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
      url: result.url,
      miscData: {
        modelName: model,
      },
    });

    await newVideo.save();
    const library = await Library.findOne({ userId });
    library.videos.push(newVideo._id);
    await library.save();
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
