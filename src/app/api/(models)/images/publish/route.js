import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export const POST = async (req) => {
  try {
    const { imageId } = await req.json();

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
