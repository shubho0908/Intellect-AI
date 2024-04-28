import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { User } from "@/models/user.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export async function PUT(req) {
  try {
    const { name, username, profileImg, visibility, summary, profession } =
      await req.json();

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

    //Check if user is available
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (userId !== user?._id?.toString()) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Check if the new username is unique or not
    if (username !== user?.username) {
      const isUsernameExists = await User.findOne({ username });
      if (isUsernameExists) {
        return NextResponse.json(
          { success: false, error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    //Update user
    user.name = name;
    user.username = username;
    user.summary = summary;
    user.profileImg = profileImg;
    user.visibility = visibility;
    user.role = profession;

    await user.save();

    return NextResponse.json({ sucess: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
