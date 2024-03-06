import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Comment } from "@/models/comments.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//Add a comment
await ConnectDB();
export const POST = async (req) => {
  try {
    const { postID, type, comment } = await req.json();

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

    const newComment = new Comment({
      userID: id,
      imageID: type === "image" ? postID : null,
      videoID: type === "video" ? postID : null,
      comment,
    });

    await newComment.save();
    return NextResponse.json(
      { success: true, data: newComment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Delete a comment
export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const commentID = searchParams.get("id");

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
    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    //Check if the comment is done by the same user
    if (id !== comment.userID) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    await Comment.findByIdAndDelete(commentID);

    return NextResponse.json(
      { success: true, message: "Comment deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get all comments
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const postID = searchParams.get("id");
    const type = searchParams.get("type");

    if (type === "image") {
      const comments = await Comment.find({ imageID: postID });
      if (!comments) {
        return NextResponse.json(
          { success: false, error: "Comments not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: comments },
        { status: 200 }
      );
    } else {
      const comments = await Comment.find({ videoID: postID });
      if (!comments) {
        return NextResponse.json(
          { success: false, error: "Comments not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: comments },
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
