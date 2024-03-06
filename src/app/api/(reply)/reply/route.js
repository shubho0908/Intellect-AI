import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Reply } from "@/models/comments.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Add a reply
export const POST = async (req) => {
  try {
    const { commentID, replyID, commentType, postID, type, reply } =
      await req.json();

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

    const newReply = new Reply({
      userID: id,
      reply,
    });

    //In case of 1st reply
    if (commentType === "comment") {
      newReply.commentID = commentID;
      newReply.imageID = type === "image" ? postID : null;
      newReply.videoID = type === "video" ? postID : null;
    } else {
      //In case of reply to a reply
      newReply.commentID = commentID;
      newReply.replyID = replyID;
    }

    await newReply.save();

    return NextResponse.json(
      { success: true, message: "Reply added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Delete a reply

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const replyID = searchParams.get("id");

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

    const reply = await Reply.findById(replyID);
    if (!reply) {
      return NextResponse.json(
        { success: false, error: "Reply not found" },
        { status: 404 }
      );
    }

    if (id !== reply.userID) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    await Reply.findByIdAndDelete(replyID);

    return NextResponse.json(
      { success: true, message: "Reply deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get all replies
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const commentID = searchParams.get("id");

    const replies = await Reply.find({ commentID });
    if (replies.length === 0) {
      return NextResponse.json(
        { success: false, error: "Replies not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: replies }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
