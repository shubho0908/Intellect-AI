import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { User } from "@/models/user.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Follow/Unfollow
export const POST = async (req) => {
  try {
    const { userID } = await req.json();

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

    if (userId === userID) {
      return NextResponse.json(
        { success: false, error: "You cannot follow yourself" },
        { status: 404 }
      );
    }

    //Check if user exists
    const user = await User.findById(userID);
    const myself = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    //Check if I'm already followed the user
    const isAlreadyFollowed = user?.followers.includes(userId);
    if (isAlreadyFollowed) {
      //Unfollow the user
      const removeMyself = user?.followers.filter((myId) => myId.toString() !== userId.toString());
      user.followers = removeMyself;

      //Remove the user from my following
      const myFollowing = myself?.following.filter(
        (userid) => userid.toString() !== userID.toString()
      );
      myself.following = myFollowing;
    } else {
      //Follow the user
      user.followers.push(userId);

      //Add user to my following
      myself.following.push(userID);
    }

    await user.save();
    await myself.save();

    return NextResponse.json(
      {
        success: true,
        data: isAlreadyFollowed
          ? "Unfollowed successfully"
          : "Followed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get followers & following
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const totalFollowers = user?.followers.length;
    const totalFollowing = user?.following.length;

    return NextResponse.json(
      {
        success: true,
        data: {
          totalFollowers,
          totalFollowing,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
