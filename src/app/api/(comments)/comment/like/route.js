import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Comment } from "@/models/comments.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Like a comment
export const POST = async (req) => {
  try {
    const { commentID } = await req.json();

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

    const comment = await Comment.findById(commentID);

    //Check if the comment is already like by this user
    const isCommentLiked = comment?.likes.includes(id);

    if (isCommentLiked) {
      const updatedLikes = comment?.likes.filter((userid) => userid !== id);
      comment.likes = updatedLikes;

      await comment.save();
    } else {
      comment?.likes.push(id);
      await comment.save();

      return NextResponse.json(
        { success: true, message: "Comment liked" },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, comment }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get total comment's likes
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const commentID = searchParams.get("id");

    const comment = await Comment.findById(commentID);
    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const totalCommentLikes = comment?.likes.length;
    return NextResponse.json(
      { success: true, data: totalCommentLikes },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
