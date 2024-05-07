import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await ConnectDB();

    // Fetch all visible images
    const visibleImages = await Image.find({ visibility: true }).populate({
      path: "userId",
      select: "_id name email profileImg username followers following",
    });

    if (!visibleImages) {
      return NextResponse.json(
        { success: false, error: "No images found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visibleImages,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
