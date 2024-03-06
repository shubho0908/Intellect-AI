import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Like or dislike an image
export const POST = async (req) => {
  try {
    const { imageId } = await req.json();

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

    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    //Check if the image is already like by this user
    const isLiked = image?.likes.find((userid) => userid === id);
    //If not liked then add the like
    if (!isLiked) {
      image?.likes.push(id);
    } else {
      //If already liked then dislike it
      const newLikes = image?.likes.filter((userid) => userid !== id);
      image.likes = newLikes;
    }

    await image.save();

    return NextResponse.json(
      { success: true, message: "Image liked" },
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
    const imageId = searchParams.get("id");

    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    const totalLikes = image?.likes.length;
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
