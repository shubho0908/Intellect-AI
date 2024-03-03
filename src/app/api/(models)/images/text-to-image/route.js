import { ConnectDB } from "@/database";
import { generateAccessToken } from "@/lib/token";
import { Images } from "@/models/images.models";
import { Library } from "@/models/library.models";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";

export const POST = async (req) => {
  try {
    await ConnectDB();
    const { id, prompt, height, width, numberOfOutputs } = await req.json();
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

    //Generate image
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    const output =
      "https://replicate.delivery/pbxt/oWPgBNPqhGp2KhYCeL92Ao2zU40qGxh9TShzPhMe9fob4B5kA/out-0.png";

    // await replicate.run(
    //   "lucataco/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
    //   {
    //     input: {
    //       seed: 2992471961,
    //       width,
    //       height,
    //       prompt,
    //       scheduler: "K_EULER",
    //       num_outputs: numberOfOutputs,
    //       guidance_scale: 0,
    //       negative_prompt:
    //         "nude, explicit, NSFW, gore, graphic, low quality, blurry, pixelated, low resolution, not good enough, subpar, unacceptable, disappointing, uninspired, underwhelming, unimpressive, uninteresting, boring, lackluster, overexposed, overlit, grainy, noisy, pixelated, low-res, low-quality, low-resolution, blurry, grainy, overexposed, overlit, pixelated, low-resolution, low-quality, low-resolution, uninspiring, disappointing, mediocre, bad, poor, substandard, unacceptable, unimpressive, uninteresting, boring, lackluster",
    //       num_inference_steps: 4,
    //     },
    //   }
    // );

    // Save image to Firebase Storage
    const response = await fetch(output);
    const imageData = await response.blob();

    // Save image to Firebase Storage
    const storageRef = ref(storage, `images/${id}_${Date.now()}.jpg`);
    uploadBytes(storageRef, imageData).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });

    // const newImage = new Images({
    //   userId: id,
    //   url: await imageRef.getDownloadURL(),
    //   prompt,
    //   miscData: {
    //     dimensions: `${width}x${height}`,
    //     modelName: "Stable Diffusion XL",
    //   },
    // });

    // await newImage.save();

    // const library = await Library.findOne({ userId: id });
    // library.images.push(newImage._id);
    // await library.save();

    return NextResponse.json({ success: true, data: "Done" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
