import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id, data, type, name, description, visibility } = await req.json();
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        {
          status: 400,
        }
      );
    }

    

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
