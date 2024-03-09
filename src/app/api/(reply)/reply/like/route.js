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
