import { Poppins } from "next/font/google";
import React from "react";
import { IoDownloadOutline, IoShareSocial } from "react-icons/io5";
import { GoCopy } from "react-icons/go";
import { Textarea, Button, Image } from "@nextui-org/react";
import { IoIosMore, IoIosRepeat } from "react-icons/io";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function page() {
  return (
    <>
      <div className="image-gen flex items-start justify-between">
        <div className="left p-6 relative ml-[120px] md:ml-[320px]">
          <div className="top ">
            <h1 className={`${poppins.className} text-2xl`}>Generate Image</h1>
            <div className="generated-image flex-wrap newXL:flex-nowrap py-6 flex items-start">
              <div className="left border-2 border-gray-800 p-4 rounded-lg">
                <Image
                  isZoomed
                  src="https://replicate.delivery/pbxt/JipAbQ9UAnZaAR1dlnf4aYDoOONnCgBtUATVoLUZtsecaRbSA/out-0.png"
                  alt="image"
                  width={500}
                  height={500}
                  className="rounded-lg cursor-pointer z-[1]"
                />
                {/* <div
                  className={`${litePoppins.className} buttons pt-5 flex justify-between items-center`}
                >
                  <div className="left flex items-center">
                    <div className="download flex items-center cursor-pointer">
                      <IoDownloadOutline
                        fontSize={24}
                        className="text-white relative bottom-1 mr-2"
                      />
                      <p>Download</p>
                    </div>
                    <div className="copy flex items-center relative left-8 cursor-pointer">
                      <GoCopy fontSize={22} className="text-white mr-2" />
                      <p>Copy</p>
                    </div>
                  </div>
                  <div className="right flex items-center cursor-pointer">
                    <div className="share flex items-center">
                      <IoShareSocial
                        fontSize={24}
                        className="text-white relative mr-2"
                      />
                      <p>Share</p>
                    </div>

                    <IoIosMore
                      fontSize={24}
                      className="text-white relative ml-3"
                    />
                  </div>
                </div> */}
              </div>
              <div className={`${litePoppins.className} right w-3/4 px-8`}>
                <div className="prompt">
                  <p className="text-gray-400">Prompt</p>
                  <p className="mt-2">
                    A dolphin leaps through the waves, set against a backdrop of
                    bright blues
                  </p>
                </div>
                <div className="buttons flex items-end py-6">
                  <Button
                    color="primary"
                    variant="solid"
                    className="rounded-lg mr-3"
                  >
                    <GoCopy fontSize={20} className="text-white" />
                    Copy Prompt
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    className="rounded-lg"
                  >
                    <IoIosRepeat fontSize={24} className="text-white" />
                    Regenerate
                  </Button>
                </div>
                <div className="more-details border-t-2 border-gray-800 pt-4">
                  <div className="model">
                    <p className="text-gray-400">Model</p>
                    <p>Stable Diffusion XL</p>
                  </div>
                  <div className="dimension mt-4">
                    <p className="text-gray-400">Dimensions</p>
                    <p>1024 x 1024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom"></div>
        </div>
        <div
          className={`${litePoppins.className} right h-[100vh] p-6 w-[450px] border-l-2 border-gray-800`}
        >
          <div className="playground">
            <div className="prompt">
              <p className="text-lg">Prompt</p>
              <Textarea
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your prompt here"
                className="w-full mt-4"
              />
              <Button
                color="primary"
                className="w-full mt-3 text-md"
                variant="shadow"
              >
                Write with AI ✨
              </Button>
            </div>
            <div className="ratio mt-10">
              <p className="text-lg">Image Ratio</p>
              <div className="all-ratios mt-5 bg-[#1D1E20] justify-between rounded-lg p-4 flex items-end">
                <div className="four-by-five cursor-pointer rounded-lg h-[75px] w-[60px] bg-[#120f0f] flex items-center justify-center mr-2">
                  <p className="text-sm">4:5</p>
                </div>
                <div className="two-by-three cursor-pointer rounded-lg h-[90px] w-[60px] bg-[#120f0f] flex items-center justify-center mr-2">
                  <p className="text-sm">2:3</p>
                </div>
                <div className="one-by-one cursor-pointer rounded-lg h-[60px] w-[60px] bg-[#120f0f] flex items-center justify-center border-2 border-blue-500 mr-2">
                  <p className="text-sm">1:1</p>
                </div>

                <div className="sixteen-by-nine cursor-pointer rounded-lg h-[60px] w-[100px] bg-[#120f0f] flex items-center justify-center">
                  <p className="text-sm">16:9</p>
                </div>
              </div>
            </div>
            <div className="total-images mt-10">
              <p className="text-xl">Number of image</p>
              <div className="quantity flex items-center mt-3">
                <p className="one cursor-pointer py-2 px-6 bg-[#1D1E20] rounded-lg w-fit">
                  1
                </p>
                <p className="two cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit">
                  2
                </p>
                <p className="three cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit">
                  3
                </p>
                <p className="four cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit border-2 border-blue-500">
                  4
                </p>
              </div>
            </div>
            <Button
              color="primary"
              variant="solid"
              className="w-full relative top-10"
            >
              Generate Image
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
