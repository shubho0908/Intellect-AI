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
    const { image } = await req.json();
    
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

    //Upscale Image using Cloudinary
    const extract = image.split("upload/");
    const upscaled = extract[0] + "upload/e_upscale/" + extract[1];

    // Save image to Cloudinary
    const result = await UploadImage(upscaled);

    const newImage = new Image({
      userId: id,
      url: result.url,
      prompt,
      miscData: {
        dimensions: `${width}x${height}`,
        modelName: "Stable Diffusion XL",
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
