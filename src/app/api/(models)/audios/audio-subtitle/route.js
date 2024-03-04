import { ConnectDB } from "@/database";
import { generateAccessToken } from "@/lib/token";
import { Audios } from "@/models/audios.models";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, audio, task } = await req.json();
    //Check if user id is available
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Safety check
    const isUserExists = await User.findById(id);
    if (!isUserExists) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Check if access token is available
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      const { accessToken } = generateAccessToken({ id }, "1h");
      cookies().set("accessToken", accessToken);
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
    const newAudio = new Audios({
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
