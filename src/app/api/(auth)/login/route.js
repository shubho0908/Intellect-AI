import { ConnectDB } from "@/database";
import { generateTokens } from "@/lib/token";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json("Missing fields", { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json("Invalid credentials", { status: 401 });
    }

    const { refreshToken, accessToken } = generateTokens(
      { id: user._id },
      "1h"
    );

    cookies().set("accessToken", accessToken);
    cookies().set("refreshToken", refreshToken);

    user.refreshToken = refreshToken;
    await user.save();

    return NextResponse.json("Login successful", { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
};
