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
    if (id === userID) {
      return NextResponse.json(
        { success: false, error: "You cannot follow yourself" },
        { status: 404 }
      );
    }

    //Check if user exists
    const user = await User.findById(userID);
    const myself = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    //Check if I'm already followed the user
    const isAlreadyFollowed = user?.followers.includes(id);
    if (isAlreadyFollowed) {
      //Unfollow the user
      const removeMyself = user?.followers.filter((myId) => myId !== id);
      user.followers = removeMyself;

      //Remove the user from my following
      const myFollowing = myself?.following.filter(
        (userid) => userid !== userID
      );
      myself.following = myFollowing;
    } else {
      //Follow the user
      user.followers.push(id);

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
