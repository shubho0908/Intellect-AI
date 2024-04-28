import { ConnectDB } from "@/database";
import { User } from "@/models/user.models";
import { Image } from "@/models/images.models";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await ConnectDB();

    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Missing user name" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userPosts = await Image.find({ userId: user?._id });

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
