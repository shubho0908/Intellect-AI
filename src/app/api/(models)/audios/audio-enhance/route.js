import { ConnectDB } from "@/database";
import { UploadAudio } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Audios } from "@/models/audios.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { audio } = await req.json();

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
      "grandlineai/resemble-enhance:f0e3f284d0b4d696bc8f93ba6c2e51f6272191aeddf10e224ea8b2b026e211ed",
      {
        input: {
          solver: "Midpoint",
          input_file: audio,
          denoise_flag: false,
          prior_temperature: 0.5,
          number_function_evaluations: 64,
        },
      }
    );

    //Model will generate two audio files: denoised [0] and enhanced [1]

    // Save audio to Cloudinary
    let allAudios = await Promise.all(
      output.map(async (element) => {
        const result = await UploadAudio(element);
        console.log(result);
        return result?.url;
      })
    );

    //Save all audios to database
    const newAudio = new Audios({
      userId: id,
      url: JSON.stringify(allAudios),
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
