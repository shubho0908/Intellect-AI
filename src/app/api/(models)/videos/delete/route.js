import { ConnectDB } from "@/database";
import { generateAccessToken } from "@/lib/token";
import { Collection } from "@/models/collections.models";
import { Comment, Reply } from "@/models/comments.models";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await ConnectDB();
export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    //Safety check
    const isUserExists = await User.findById(id);
    if (!isUserExists) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
      );
    }

    //Check if access token is available
    const accessToken = cookies().get("accessToken");
    if (!accessToken) {
      const { accessToken } = generateAccessToken({ id }, "1h");
      cookies().set("accessToken", accessToken);
    }

    //Delete the video
    await Video.findByIdAndDelete(postId);

    //Delete the video from library
    const library = await Library.findOne({ userId: id });
    const filteredVideos = library?.videos?.filter(
      (videoId) => videoId !== postId
    );

    library.videos = filteredVideos;
    await library.save();

    //Delete the video from collection
    const collections = await Collection.find({ "data.postId": postId });
    if (collections.length > 1) {
      await Collection.deleteMany({ "data.postId": postId });
    }

    const filteredData = collections?.data?.filter(
      (video) => video.postId !== postId
    );
    collections.data = filteredData;
    await collections.save();

    //Delete the video's comments
    await Comment.deleteMany({ postId });
    await Reply.deleteMany({ postId });

    return NextResponse.json(
      { success: true, message: "Video deleted" },
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
