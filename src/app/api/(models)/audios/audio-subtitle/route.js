import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Audio } from "@/models/audios.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { audio, task } = await req.json();

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

    //Generate audio
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
      {
        input: {
          task,
          audio,
          language: "None",
          timestamp: "chunk",
          batch_size: 64,
          diarise_audio: false,
        },
      }
    );

    //Save all audios to database
    const newAudio = new Audio({
      userId: id,
      url: audio,
      transcript: output?.text,
      subtitle: JSON.stringify(output?.chunks),
    });

    await newAudio.save();

    const library = await Library.findOne({ userId: id });
    library.audios.push(newAudio._id);
    await library.save();

    return NextResponse.json(
      { success: true, data: newAudio },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
