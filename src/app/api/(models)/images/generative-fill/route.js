import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UploadImage } from "@/lib/cloudinary";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { image, ratio } = await req.json();

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

    //Upscale Image using Cloudinary
    const extract = image.split("upload/");
    const removedImg =
      extract[0] + `upload/c_pad,ar_${ratio},g_center,b_gen_fill/` + extract[1];

    const newImage = new Image({
      userId: id,
      urls: [removedImg],
      miscData: {
        dimensions: ratio,
        modelName: "Generative Fill",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId: id });
    library.images.push(newImage._id);
    await library.save();

    return NextResponse.json(
      { success: true, data: newImage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
