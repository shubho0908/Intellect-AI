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
