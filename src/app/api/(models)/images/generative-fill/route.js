import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { image, ratio } = await req.json();

    const accessTokenValue = cookies().get("accessToken")?.value;
    const refreshTokenValue = cookies().get("refreshToken")?.value;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: "Missing refresh token" },
        { status: 401 }
      );
    }

    //Check if refresh token is expired
    try {
      verifyToken(refreshTokenValue);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      );
    }

    let userId;

    try {
      const decodedAccess = verifyToken(accessTokenValue);
      userId = decodedAccess?.id;
    } catch (error) {
      const decodedRefresh = verifyToken(refreshTokenValue);
      userId = decodedRefresh?.id;
      if (userId) {
        const newAccessToken = generateAccessToken({ id: userId }, "1h");
        cookies().set("accessToken", newAccessToken);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid tokens" },
        { status: 401 }
      );
    }

    //Upscale Image using Cloudinary
    const extract = image.split("upload/");
    const removedImg =
      extract[0] + `upload/c_pad,ar_${ratio},g_center,b_gen_fill/` + extract[1];

    const newImage = new Image({
      userId,
      url: removedImg,
      miscData: {
        dimensions: ratio,
        modelName: "Generative Fill",
      },
    });

    await newImage.save();

    const library = await Library.findOne({ userId });
    library.images.push(newImage._id);
    await library.save();

    return NextResponse.json(
      { success: true, data: newImage?.urls[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
