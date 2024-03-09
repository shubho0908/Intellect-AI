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

    // Check if refresh token is available
    const refreshTokenValue = cookies().get("refreshToken")?.value;
    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    // Check if the refresh token is expired
    try {
      verifyToken(refreshTokenValue);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 404 }
      );
    }

    // Check if access token is available
    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
      try {
        // Try to generate a new access token using the refresh token
        const payload = verifyToken(refreshTokenValue);
        const newToken = generateAccessToken({ id: payload.id }, "1h");
        cookies().set("accessToken", newToken);
        return NextResponse.json(
          {
            success: true,
            message: "New token generated",
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 404 }
        );
      }
    }

    // Verify the access token
    let id;
    try {
      const payload = verifyToken(accessToken);
      id = payload.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

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
