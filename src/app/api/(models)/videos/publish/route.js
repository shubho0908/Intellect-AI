import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export const POST = async (req) => {
  try {
    const { videoId } = await req.json();

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

    const video = await Video.findById(videoId);

    if (id !== video?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    if (video.visibility === true) {
      return NextResponse.json(
        { success: false, error: "Video already published" },
        { status: 404 }
      );
    }

    video.visibility = true;
    await video.save();

    return NextResponse.json(
      { success: true, message: "Video published" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
