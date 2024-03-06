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
    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    //Check if the video is already like by this user
    const isLiked = video?.likes.find((userid) => userid === id);
    //If not liked then add the like
    if (!isLiked) {
      video?.likes.push(id);
    } else {
      //If already liked then dislike it
      const newLikes = video?.likes.filter((userid) => userid !== id);
      video.likes = newLikes;
    }

    await video.save();

    return NextResponse.json(
      { success: true, message: "Video liked" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get total likes
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    const totalLikes = video?.likes.length;
    return NextResponse.json(
      { success: true, likes: totalLikes },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
