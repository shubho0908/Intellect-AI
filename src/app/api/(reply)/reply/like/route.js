import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Reply } from "@/models/comments.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Like or dislike a reply
export const POST = async (req) => {
  try {
    const { replyId } = await req.json();

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

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return NextResponse.json(
        { success: false, error: "Reply not found" },
        { status: 404 }
      );
    }

    //Check if the reply is already like by this user
    const isLiked = reply?.likes.includes(id);
    //If not liked then add the like
    if (!isLiked) {
      reply?.likes.push(id);
      await reply.save();
    } else {
      //If already liked then dislike it
      const newLikes = reply?.likes.filter((userid) => userid !== id);
      reply.likes = newLikes;

      await reply.save();

      return NextResponse.json(
        { success: true, message: "Reply liked" },
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
    const replyID = searchParams.get("id");

    const reply = await Reply.findById(replyID);
    if (!reply) {
      return NextResponse.json(
        { success: false, error: "Reply not found" },
        { status: 404 }
      );
    }

    const totalLikes = reply?.likes.length;
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
