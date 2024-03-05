import { ConnectDB } from "@/database";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Collection } from "@/models/collections.models";
import { Reply } from "@/models/comments.models";
import { Image } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

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

    //Delete the image
    // await Image.findByIdAndDelete(postId);

    // //Delete the image from library
    // const library = await Library.findOne({ userId: id });
    // const filteredImages = library?.images?.filter(
    //   (imageId) => imageId !== postId
    // );

    // library.images = filteredImages;
    // await library.save();

    // //Delete the image from collection
    // const collections = await Collection.find({ "data.postId": postId });
    // if (collections.length > 1) {
    //   await Collection.deleteMany({ "data.postId": postId });
    // }
    // const filteredData = collections?.data?.filter(
    //   (image) => image.postId !== postId
    // );
    // collections.data = filteredData;
    // await collections.save();

    // //Delete the image's comments
    // await Comment.deleteMany({ postId });
    // await Reply.deleteMany({ postId });

    return NextResponse.json(
      { success: true, message: "Image deleted", id },
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
