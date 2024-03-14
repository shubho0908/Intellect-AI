"use client";
import { Poppins } from "next/font/google";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

function page() {
  return (
    <>
      <div className="image-upscaler fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top flex flex-col items-center mt-20">
          <div className="tag"></div>
          <p className={`${litePoppins.className} text-[3rem]`}>
            Upscale and Enhance your images with Intellect.AI
          </p>
        </div>
        <div className="mid"></div>
        <div className="bottom"></div>
      </div>
    </>
  );
}

export default page;
