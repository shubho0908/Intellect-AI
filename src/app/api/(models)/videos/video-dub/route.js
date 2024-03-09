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
