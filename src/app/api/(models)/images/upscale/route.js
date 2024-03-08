import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UploadImage } from "@/lib/cloudinary";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { image } = await req.json();

    // Check if access token and refresh token are available
    const refreshToken = cookies().get("refreshToken");
    if (!refreshToken || !refreshToken.value) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Check if the refreshToken is expired or not
    try {
      verifyToken(refreshToken.value);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 404 }
      );
    }

    let token = cookies().get("accessToken");
    let id;
    if (!token || !token.value) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    } else {
      try {
        const payload = verifyToken(token?.value);
        id = payload.id;
      } catch (error) {
        const payload = verifyToken(refreshToken.value);
        token = generateAccessToken({ id: payload.id }, "20s");
        console.log("New token");
      }
    }

    // // Upscale the image
    // const replicate = new Replicate({
    //   auth: process.env.REPLICATE_API_TOKEN,
    // });

    // const output = await replicate.run(
    //   "lucataco/gfpgan:66a607f2c8ee93966fb2759b0bb93f48a707f46d2f75df5d66db73d3b5d8337d",
    //   {
    //     input: {
    //       img: image,
    //       scale: 2,
    //       version: "v1.4",
    //     },
    //   }
    // );

    // // Save image to Cloudinary
    // const result = await UploadImage(output);

    // const newImage = new Image({
    //   userId: id,
    //   url: result.url,
    //   prompt,
    //   miscData: {
    //     dimensions: `${width}x${height}`,
    //     modelName: "Stable Diffusion XL",
    //   },
    // });

    // await newImage.save();

    // const library = await Library.findOne({ userId: id });
    // library.images.push(newImage._id);
    // await library.save();

    return NextResponse.json({ success: true, data: id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
