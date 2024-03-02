import { ConnectDB } from "@/database";
import { generateTokens } from "@/lib/token";
import { Collections } from "@/models/collections.models";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json("Missing fields", { status: 400 });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return NextResponse.json("User already exists", { status: 400 });
    }

    const HashedPassword = await bcrypt.hash(password, 11);

    const { refreshToken, accessToken } = generateTokens({ email }, "1h");
    cookies().set("accessToken", accessToken);
    cookies().set("refreshToken", refreshToken);

    const username = email?.split("@")[0];

    const user = new User({
      name,
      email,
      username,
      password: HashedPassword,
      refreshToken,
    });
    await user.save();

    const library = new Library({ userId: user._id });
    const collections = new Collections({ userId: user._id });
    user.library = library._id;
    await user.save();
    await library.save();
    await collections.save();

    return NextResponse.json("User registered successfully", { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
};
