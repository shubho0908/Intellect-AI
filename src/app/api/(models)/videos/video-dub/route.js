import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken, verifyToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { face, audio } = await req.json();

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

    //Generate video
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "cjwbw/video-retalking:db5a650c807b007dc5f9e5abe27c53e1b62880d1f94d218d27ce7fa802711d67",
      {
        input: {
          face,
          input_audio: audio,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadVideo(output);

    const newVideo = new Video({
      userId: id,
      url: result.url,
      miscData: {
        modelName: "Video Retalking",
      },
    });

    await newVideo.save();
    const library = await Library.findOne({ userId: id });

    library.videos.push(newVideo._id);
    await library.save();
    return NextResponse.json(
      { success: true, data: newVideo },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
