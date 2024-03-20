"use client";
import { Poppins } from "next/font/google";
import { Button, Chip, Image } from "@nextui-org/react";

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
      <div className="generative-fill fadein flex flex-col items-center sm:ml-[120px] md:ml-[330px] mr-0 sm:mr-4 p-4">
        <div className="head mt-8 flex flex-col items-center">
          <Chip
            color="warning"
            variant="dot"
            className={`${litePoppins2.className} py-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
          >
            AI GENERATIVE FILL
          </Chip>
          <p className={`${litePoppins.className} mt-3 text-[3.5rem]`}>
            <span className="bg-gradient-to-r from-blue-600 to-gray-300 text-transparent bg-clip-text font-bold">
              Intellect.AI's
            </span>{" "}
            Generative Fill for Images
          </p>
          <p className={`${litePoppins2.className} mt-3 text-lg w-3/4 text-center text-gray-300`}>
            Revolutionize your images with our app! Easily fill sections of your
            photos with stunning generative designs, ensuring seamless
            transformations for captivating visual content.
          </p>
        </div>
        <div className="bottom mt-24 w-[85%] flex items-center justify-between">
          <div className="left shadow-xl bg-gradient-to-r  from-blue-200 to-white w-[450px] leading-10 flex flex-col items-center rounded-2xl text-black">
            <div
              className={`${litePoppins.className} top p-10 border-b-2 border-dashed border-[#a9a9b2] w-full flex flex-col items-center`}
            >
              <Button
                color="primary"
                className={`${litePoppins.className} text-xl p-7 w-full shadow-lg shadow-[#0000002f]`}
              >
                Upload Image
              </Button>
              <p className="relative top-3">or drag and drop an image</p>
            </div>
            <div className="bottom flex flex-col items-center p-5">
              <p className={`${litePoppins.className}`}>
                No image? try one of these:
              </p>
              <div className="all-imgs py-4 flex items-center gap-4">
                <Image
                  src="/generative/img1.jpg"
                  alt="img1"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
                <Image
                  src="/generative/img2.jpg"
                  alt="img2"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
                <Image
                  src="/generative/img3.jpg"
                  alt="img3"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
              </div>
            </div>
          </div>
          <div className="right">
            <Image
              src="/generative/demo.png"
              alt="demo"
              width={550}
              height={550}
              className="aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
