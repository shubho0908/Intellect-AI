import { UploadVideo } from "@/lib/cloudinary";
import { generateAccessToken } from "@/lib/token";
import { Library } from "@/models/library.models";
import { Videos } from "@/models/videos.models";
import { cookies } from "next/headers";
import Replicate from "replicate";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const {
      id,
      video,
      font,
      color,
      position,
      highlightColor,
      stroke,
      isTranslate,
    } = await req.json();

    //Check if user id is available
    if (!id) {
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
      "fictions-ai/autocaption:18a45ff0d95feb4449d192bbdc06b4a6df168fa33def76dfc51b78ae224b599b",
      {
        input: {
          font,
          color,
          kerning: -5,
          opacity: 0,
          MaxChars: 20,
          fontsize: 7,
          translate: isTranslate,
          output_video: true,
          stroke_color: stroke,
          stroke_width: 2.6,
          right_to_left: false,
          subs_position: position,
          highlight_color: highlightColor,
          video_file_input: video,
          output_transcript: true,
        },
      }
    );

    // Save image to Cloudinary
    const result = await UploadVideo(output[0]);

    const newVideo = new Videos({
      userId: id,
      url: result.url,
      miscData: {
        modelName: "Autocaption",
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
