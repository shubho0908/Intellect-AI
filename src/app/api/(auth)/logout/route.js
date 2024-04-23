import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
