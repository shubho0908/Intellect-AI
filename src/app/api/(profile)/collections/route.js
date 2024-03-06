import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Collection } from "@/models/collections.models";
import { User } from "@/models/user.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Create a collection
export const POST = async (req) => {
  try {
    const { postId, type, name, description, visibility } = await req.json();

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

    const collection = new Collection({
      userId: id,
      data: [
        {
          postId,
          Type: type,
        },
      ],
      collectionName: name,
      description,
      visibility,
    });

    await collection.save();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    user.collections.push(collection._id);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Collection created!", data: collection },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Add data to collection
export const PUT = async (req) => {
  try {
    const { postId, type, collectionId } = await req.json();

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

    const userCollection = await Collection.findById(collectionId);
    if (!userCollection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    if (id !== userCollection.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    const Data = {
      postId,
      Type: type,
    };

    userCollection.data.push(Data);
    await userCollection.save();
    return NextResponse.json(
      {
        success: true,
        message: "Data added to collection",
        data: userCollection,
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

//Delete a collection

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("id");

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

    const userCollection = await Collection.findById(collectionId);
    if (!userCollection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    if (id !== userCollection.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    await Collection.findByIdAndDelete(collectionId);

    return NextResponse.json(
      { success: true, message: "Collection deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

//Get collection data
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    const collections = await Collection.find({ userId, visibility: true });
    if (!collections) {
      return NextResponse.json(
        { success: false, error: "Collections not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: collections },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
