import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Collection } from "@/models/collections.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();

//Create a collection
export const POST = async (req) => {
  try {
    const { postId, type, name, description, visibility } = await req.json();

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
    const dataObj =
      type === "image" ? { imageID: postId } : { videoID: postId };

    const collection = new Collection({
      userId: id,
      data: [dataObj],
      collectionName: name,
      description,
      visibility,
    });

    await collection.save();

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

    const dataObj =
      type === "image" ? { imageID: postId } : { videoID: postId };

    userCollection.data.push(dataObj);
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
    if (collections.length === 0) {
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
