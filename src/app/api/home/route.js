import { ConnectDB } from "@/database";
import { Image } from "@/models/images.models";
import { User } from "@/models/user.models";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await ConnectDB();
<<<<<<< HEAD

    // Fetch all visible images
    const visibleImages = await Image.find({ visibility: true });

    if (!visibleImages || visibleImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No visible images found",
=======
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
>>>>>>> aee049db4372314be3471efd91f52a89deb3dc2c
        status: 404,
      });
    }

<<<<<<< HEAD
    // Extract unique user IDs from the images
    const userIds = [...new Set(visibleImages.map((image) => image.userId))];

    // Fetch user information based on the user IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map of userId to user data
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user._id.toString(), user);
    });

    // Attach user information to the corresponding image
    const imagesWithUserData = visibleImages.map((image) => {
      const user = userMap.get(image.userId.toString());
      return {
        ...image.toObject(), // Convert Mongoose document to plain JS object
        user, // Attach the user object to the image
      };
    });

    return NextResponse.json({
      success: true,
      data: imagesWithUserData,
=======
    const users = await User.find({ _id: { $in: userIds } });

    return NextResponse.json({
      success: true,
      data: users,
>>>>>>> aee049db4372314be3471efd91f52a89deb3dc2c
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
