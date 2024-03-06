import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export const POST = async (req) => {
  try {
    const { imageId } = await req.json();

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

    const image = await Image.findById(imageId);

    if (id !== image?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    if (image.visibility === true) {
      return NextResponse.json(
        { success: false, error: "Image already published" },
        { status: 404 }
      );
    }

    image.visibility = true;
    await image.save();

    return NextResponse.json(
      { success: true, message: "Image published" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
