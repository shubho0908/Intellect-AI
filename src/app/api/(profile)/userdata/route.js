import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await ConnectDB();

    const userId = req.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing user id" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ _id: userId }).select("-password -refreshToken -tokens");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userPosts = await Image.find({ userId });

    const finalData = {
      user,
      userPosts,
    };

    return NextResponse.json(
      { success: true, data: finalData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
