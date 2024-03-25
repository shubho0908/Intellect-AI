"use client";
import { Button, Chip, Image } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { FiUploadCloud } from "react-icons/fi";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});
function page() {
  return (
    <>
      <div className="video-caption flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top mt-10 w-[90%] flex items-center justify-between gap-6">
          <div className="left w-1/2">
            <Chip
              color="warning"
              variant="dot"
              className={`${litePoppins2.className} py-4 mt-2 mb-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
            >
              AI VIDEO CAPTION
            </Chip>
            <p className={`${litePoppins.className} text-[3.5rem]`}>
              Transform your videos with accurate AI Captioning.
            </p>
            <p
              className={`${litePoppins2.className} text-lg mt-4 text-gray-300`}
            >
              Elevate videos effortlessly with AI Captioning, ensuring accuracy
              and accessibility for enhanced engagement and comprehension.
            </p>
            <Button
              color="primary"
              className={`${litePoppins.className} text-lg p-6 mt-6`}
            >
              <FiUploadCloud  fontSize={26} className="text-white mr-3" />
              Upload Video
            </Button>
          </div>
          <div className="right">
            <Image
              src="/caption/hero.png"
              className="shadow-lg"
              width={650}
              height={650}
              alt="Hero"
            />
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    </>
  );
}

export default page;
