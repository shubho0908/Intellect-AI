import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { User } from "@/models/user.models";
import { Video } from "@/models/videos.models";
import { cookies } from "next/headers";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, model, resolution, video } = await req.json();

    //Check if user id is available
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 404 }
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

    //Generate video
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
      "lucataco/real-esrgan-video:c23768236472c41b7a121ee735c8073e29080c01b32907740cfada61bff75320",
      {
        input: {
          model,
          resolution,
          video_path: video,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadVideo(output[0]);

    const newVideo = new Video({
      userId: id,
      url: result.url,
      miscData: {
        modelName: model,
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
