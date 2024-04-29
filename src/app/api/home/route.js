import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await ConnectDB();
    const visibleImages = await Image.find({ visibility: true });
    if (!visibleImages) {
      return NextResponse.json({
        success: false,
        error: "Images not found",
        status: 404,
      });
    }
    const userIds = visibleImages.map((image) => image.userId);

    if (userIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No users found",
        status: 404,
      });
    }

    const users = await User.find({ _id: { $in: userIds } });

    return NextResponse.json({
      success: true,
      data: users,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
