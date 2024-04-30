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

    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    //Check if the image is already like by this user
    const isLiked = image?.likes.includes(userId);
    //If not liked then add the like
    if (!isLiked) {
      image?.likes.push(userId);
      await image.save();
      return NextResponse.json(
        { success: true, message: "Image liked" },
        { status: 200 }
      );
    } else {
      //If already liked then dislike it
      const newLikes = image?.likes.filter(
        (userid) => userid.toString() !== userId.toString()
      );
      console.log(newLikes);
      image.likes = newLikes;

      await image.save();

      return NextResponse.json(
        { success: true, message: "Image disliked" },
        { status: 200 }
      );
    }
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
