import { UploadImage } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { file } = await req.json();
    console.log(file);
    if (!file) {
      return NextResponse.json(
        { success: false, error: "Missing file" },
        { status: 400 }
      );
    }

    const result = await UploadImage(file);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
