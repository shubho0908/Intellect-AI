import { ConnectDB } from "@/database";
import { Library } from "@/models/library.models";
import { NextResponse } from "next/server";

await ConnectDB();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const library = await Library.findOne({ userId: id });
    if (!library) {
      return NextResponse.json(
        { success: false, message: "Library not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: library }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
