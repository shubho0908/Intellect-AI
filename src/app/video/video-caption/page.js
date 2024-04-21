"use client";
import {
  Button,
  Chip,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { FiUploadCloud } from "react-icons/fi";
import { HiOutlineUpload } from "react-icons/hi";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});
function page() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="video-caption flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4 mb-20">
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
              onClick={onOpen}
              className={`${litePoppins.className} text-md p-6 mt-6`}
            >
              <FiUploadCloud fontSize={26} className="text-white mr-3" />
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
        <div
          className={`bottom ${litePoppins.className} flex flex-col w-full items-center mt-[10rem]`}
        >
          <p className="text-[2rem]">
            How to use Intellect's AI Video Captioning:
          </p>
          <div className="flex items-center justify-evenly w-full mt-6">
            <div className="demo1 w-[350px] flex flex-col items-center">
              <Image
                src="/caption/upload.png"
                className="shadow-lg mb-6"
                width={300}
                height={300}
                alt="Upload"
              />
              <p className="text-semibold w-2/3 text-center text-lg mt-3">
                Upload your video
              </p>
              <p
                className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
              >
                Upload your video for instant, accurate AI-generated captions.
              </p>
            </div>
            <div className="demo2 w-[350px] flex flex-col items-center">
              <Image
                src="/caption/style.png"
                className="shadow-lg"
                width={350}
                height={350}
                alt="Style"
              />
              <p className="text-semibold w-2/3 text-center text-lg mt-3">
                Change subtitle styles, personalize, and more
              </p>
              <p
                className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
              >
                Customize subtitle styles, personalize settings, and explore
                additional features.
              </p>
            </div>
            <div className="demo3 w-[350px] flex flex-col items-center">
              <Image
                src="/caption/download.png"
                className="shadow-lg"
                width={320}
                height={320}
                alt="download"
              />
              <p className="text-semibold w-2/3 text-center text-lg mt-3">
                Download your video
              </p>
              <p
                className={`${litePoppins2.className}  text-gray-300 mt-2 text-center`}
              >
                Download your video or export the subtitle file separately.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal  */}
      <Modal
        placement="center"
        backdrop="blur"
        size="2xl"
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody
                className={`${litePoppins.className} max-h-[600px] overflow-scroll scrollbar-hide`}
              >
                <div className="upload-video py-6">
                  <div
                    className={`${litePoppins2.className} flex w-full items-center flex-col justify-center`}
                  >
                    <p className={`${litePoppins.className} text-xl`}>
                      Upload a video
                    </p>
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col mt-6 items-center justify-center w-full h-64 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-none"
                    >
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        className="flex flex-col items-center justify-center pt-5 pb-6"
                      >
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="video/mp4"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Button
                    color="primary"
                    className={`${litePoppins.className} w-full mt-6`}
                  >
                    Upload
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
