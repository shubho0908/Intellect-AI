import { ConnectDB } from "@/database";
import { Audio } from "@/models/audios.models";
import { Library } from "@/models/library.models";
import { NextResponse } from "next/server";

await ConnectDB();
export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    
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

    //Delete the audio
    await Audio.findByIdAndDelete(postId);

    //Delete the audio from library
    const library = await Library.findOne({ userId: id });
    const filteredAudios = library?.audios?.filter(
      (audioId) => audioId !== postId
    );

    library.audios = filteredAudios;
    await library.save();

    return NextResponse.json(
      { success: true, message: "Audio deleted" },
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
