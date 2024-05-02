import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await ConnectDB();
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");
    const userId = searchParams.get("userId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const image = await Image.findById(imageId);
    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    const isLiked = image?.likes.includes(userId);
    if (!isLiked) {
      return NextResponse.json(
        { success: true, message: "Image not liked" },
        { status: 200 }
      );
    }

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
