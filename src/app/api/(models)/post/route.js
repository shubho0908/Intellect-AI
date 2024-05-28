import { Image } from "@/models/images.models";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const postId = req.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 400 }
      );
    }

    const post = await Image.findOne({ _id: postId });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
