import { Poppins } from "next/font/google";
import React from "react";
import { IoDownloadOutline, IoShareSocial } from "react-icons/io5";
import { GoCopy } from "react-icons/go";
import {
  Button,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { IoIosMore, IoIosRepeat } from "react-icons/io";
import { MdOutlineBookmarkAdd, MdDeleteOutline } from "react-icons/md";
import Playground from "@/components/Playground";
import Modaal from "@/app/image/image-generator/Modaal";

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
        <div className="left p-6 relative mt-5 ml-0 sm:mt-0 sm:ml-[120px] md:ml-[320px] border-r-0 xl2:border-r-2 xl2:border-gray-800">
          <div className="top ">
            <Modaal title="Generate Image" data={<Playground />} />

            <h1 className={`${poppins.className} text-2xl`}>Generate Image</h1>
            <div className="generated-image flex-wrap newXL:flex-nowrap py-6 flex items-start">
              <div className="left border-2 border-gray-800 p-4 rounded-lg">
                <Popover placement="right">
                  <PopoverTrigger>
                    <IoIosMore
                      fontSize={35}
                      className="absolute z-[2] bg-[#ffffffb1] text-black p-2 rounded-full cursor-pointer m-3"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className={`${litePoppins.className} relative  top-20 rounded-lg`}
                  >
                    <div className="btns py-2">
                      <div className="download hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
                        <IoDownloadOutline
                          fontSize={22}
                          className="text-white relative bottom-1 mr-2"
                        />
                        <p className="text-md">Download</p>
                      </div>
                      <div className="save hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
                        <MdOutlineBookmarkAdd
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p className="text-md">Save to collection</p>
                      </div>
                      <div className="share hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
                        <IoShareSocial
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p className="text-md">Share</p>
                      </div>
                      <div className="delete hover:bg-red-600 hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
                        <MdDeleteOutline
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p className="text-md">Delete</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Image
                  isZoomed
                  src="https://replicate.delivery/pbxt/JipAbQ9UAnZaAR1dlnf4aYDoOONnCgBtUATVoLUZtsecaRbSA/out-0.png"
                  alt="image"
                  width={500}
                  height={500}
                  className="cursor-pointer z-[1]"
                />
              </div>
              <div
                className={`${litePoppins.className} right  py-4 w-[100%] newXL:w-3/4 newXL:px-8 newXL:py-0`}
              >
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
                    <GoCopy
                      fontSize={20}
                      className="text-white xsm:block hidden"
                    />
                    Copy Prompt
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    className="rounded-lg"
                  >
                    <IoIosRepeat
                      fontSize={24}
                      className="text-white xsm:block hidden"
                    />
                    Regenerate
                  </Button>
                </div>
                <div className="more-details border-t-2 border-gray-800 pt-4 ">
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
          <div className="bottom mt-4">
            <div className="related-images">
              <p className={`${poppins.className} text-2xl`}>Related Images</p>
              <div className="images flex items-center justify-start flex-wrap newXL:flex-nowrap mt-8 gap-4">
                <Image
                  isZoomed
                  src="https://replicate.delivery/pbxt/MkUfpm9XsUXmTSWf4r37w4rpTmXHWlaMKBoO5ElqN9XWbRbSA/out-0.png"
                  alt="image"
                  width={350}
                  height={350}
                  className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
                />
                <Image
                  isZoomed
                  src="https://replicate.delivery/pbxt/MkUfpm9XsUXmTSWf4r37w4rpTmXHWlaMKBoO5ElqN9XWbRbSA/out-0.png"
                  alt="image"
                  width={350}
                  height={350}
                  className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
                />
                <Image
                  isZoomed
                  src="https://replicate.delivery/pbxt/MkUfpm9XsUXmTSWf4r37w4rpTmXHWlaMKBoO5ElqN9XWbRbSA/out-0.png"
                  alt="image"
                  width={350}
                  height={350}
                  className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${litePoppins.className}  hidden xl2:block right h-[100vh] p-6 w-[450px]`}
        >
          <Playground />
        </div>
      </div>
    </>
  );
}

export default page;
