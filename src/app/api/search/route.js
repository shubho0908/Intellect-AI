import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await ConnectDB();
    const Query = req.nextUrl.searchParams.get("q");
    if (!Query || Query === "") {
      return NextResponse.json(
        { success: false, error: "Missing query" },
        { status: 400 }
      );
    }

    const user = await User.find({
      $or: [
        { username: { $regex: Query, $options: "i" } },
        { name: { $regex: Query, $options: "i" } },
      ],
    }).select("-password -refreshToken -tokens");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const posts = await Image.find({
      $and: [
        { prompt: { $regex: Query, $options: "i" } },
        { visibility: true },
      ],
    });

    return NextResponse.json(
      { success: true, data: { user, posts } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
};
