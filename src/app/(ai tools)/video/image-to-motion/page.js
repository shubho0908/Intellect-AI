"use client";
import {
  Button,
  Skeleton,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Progress,
  Image,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { useEffect, useState } from "react";
import { MdBookmarkAdd, MdDone } from "react-icons/md";
import { HiOutlineDownload, HiOutlineUpload } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileData, setFileData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploadedIMG, setUploadedIMG] = useState(null);
  const [motionVideo, setMotionVideo] = useState(null);

  //Toast
  const fileSizeError = (data) =>
    toast.error(data, {
      className: litePoppins.className,
    });

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

  useEffect(() => {
    const createVideo = async () => {
      try {
        const response = await fetch("/api/videos/image-to-video", {
          method: "POST",
          body: JSON.stringify({ image: uploadedIMG }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { success, data, error } = await response.json();
        if (success) {
          setMotionVideo(data);
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (uploadedIMG) {
      createVideo();
    }
  }, [uploadedIMG]);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const size = file.size / 1024 / 1024;
    if (size > 10) {
      fileSizeError("File size should be less than 10MB");
    } else {
      setIsFileSelected(true);
      setFileData(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const size = file.size / 1024 / 1024;
    if (size > 10) {
      fileSizeError("File size should be less than 10MB");
    } else {
      setIsFileSelected(true);
      setFileData(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      if (!file) {
        return null;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const newFile = reader.result;

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: JSON.stringify({
                file: newFile,
                upload_preset: "intellect",
                api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                public_id: `videos/Img2Motion/${Date.now()}`,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          setUploadedIMG(data.secure_url);
        } catch (error) {
          console.log("Error uploading image:", error.message);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.log("Error converting file to base64:", error.message);
    }
  };

  const handleOpen = async () => {
    await uploadImage(fileData);
    onOpen();
  };

  const download = async (data) => {
    const downloadUrl = data;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "download";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error("Error downloading content:", error);
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: litePoppins.className,
        }}
      />
      <div className="image-motion flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top w-[90%] flex flex-row-reverse justify-between items-center mt-6">
          <div className="left">
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit">
              <Image
                src="/img2vid/inp/1.jpg"
                className="rounded-lg z-[1] shadow-lg"
                width={350}
                height={350}
              />
              <div className="arrow relative bottom-8 left-[21rem] z-10">
                <Image
                  src="/img2vid/arrow.png"
                  className="absolute z-[2]"
                  width={80}
                  height={80}
                />
              </div>
              <div className="img-border mt-4 animate-[fade_1.2s_ease-in-out] p-1 bg-gradient-to-r from-blue-500 via-pink-300 to-purple-700 rounded-xl w-fit h-fit">
                <Image
                  src="/img2vid/out/1.gif"
                  className=" rounded-lg z-[1] shadow-lg"
                  width={400}
                  height={400}
                />
              </div>
            </Skeleton>
          </div>
          <div className="right w-1/2">
            <Chip
              color="warning"
              variant="dot"
              className={`${litePoppins2.className} py-4 mt-2 mb-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
            >
              IMAGE TO MOTION
            </Chip>
            <p className={`${litePoppins.className} text-[3rem]`}>
              Transform your images into motion with{" "}
              <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
                Intellect.AI
              </span>
            </p>
            <p
              className={`${litePoppins2.className} text-lg w-3/4 mt-4 text-gray-300`}
            >
              Unlock creativity: Transform static images into dynamic motion
              with Intellect.AI's cutting-edge artificial intelligence
              technology.
            </p>
            <div
              className={`${litePoppins2.className} flex items-center w-3/4 flex-col justify-center mt-10`}
            >
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-none"
              >
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  {!isFileSelected ? (
                    <>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x500px)
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="fadein flex flex-col items-center">
                        <div className="tick p-2 w-fit rounded-full border-2 border-green-500">
                          <MdDone fontSize={30} className="text-green-500" />
                        </div>
                        <p className="mt-3 text-center">
                          File selected:{" "}
                          {fileData?.name.length > 12
                            ? `${fileData?.name.slice(0, 12)}...`
                            : fileData?.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  onChange={handleFileChange}
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {isFileSelected && (
                <div className="flex items-center fadein w-full mt-6 ">
                  <Button
                    color="primary"
                    isDisabled={!isFileSelected}
                    onPress={handleOpen}
                    className={`${litePoppins.className} w-full`}
                  >
                    <HiOutlineUpload fontSize={22} className="text-white" />
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bottom flex flex-col justify-center items-center mt-20">
          <p className={`${litePoppins.className} text-3xl`}>Best Examples</p>
          <div className="new-line w-full flex items-center justify-center">
            <div className="line w-[250px] h-[0.1rem] mt-3 bg-gradient-to-r from-[#eab1ff] to-[#0369b2cb]"></div>
          </div>
          <div className="mockup-compare flex gap-6 mt-2 justify-center flex-wrap items-center">
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/img2vid/inp/2.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/img2vid/out/2.gif"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/img2vid/inp/3.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/img2vid/out/3.gif"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/img2vid/inp/4.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/img2vid/out/4.gif"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
          </div>
        </div>
      </div>
      <Modal
        className="max-w-fit"
        placement="center"
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setUploadedIMG(null);
          setIsFileSelected(false);
          setFileData(null);
          setMotionVideo(null);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className={`${litePoppins.className} mt-8 mb-8`}>
                <div className="upscale-body">
                  {!uploadedIMG && (
                    <>
                      <div className="upload-img fadein flex flex-col items-center w-full p-5">
                        <p className={`${litePoppins.className} text-xl`}>
                          Uploading your image
                        </p>
                        <p
                          className={`${litePoppins2.className} mt-2 text-gray-400`}
                        >
                          Please wait... this process may take a while.
                        </p>
                        <Progress
                          size="sm"
                          isIndeterminate
                          aria-label="Loading..."
                          className="max-w-md py-5"
                        />
                      </div>
                    </>
                  )}
                  <div className="upscale-data flex flex-col items-center">
                    {!motionVideo && uploadedIMG && (
                      <>
                        <div className="flex flex-col items-center">
                          <p className={`${litePoppins.className}`}>
                            Please wait while we transform your image..
                          </p>
                          <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className="max-w-md py-5"
                          />
                        </div>
                      </>
                    )}
                    {motionVideo && (
                      <>
                        <div className="my-avatar w-full flex flex-col items-center p-3">
                          <p className={`${litePoppins.className} text-xl`}>
                            Your video is ready!
                          </p>
                          <div className="compare flex items-start gap-5">
                            <div className="left text-center mt-6">
                              <p>ORIGINAL</p>
                              <div className="flex flex-row-reverse mt-2">
                                <Image
                                  className="rounded-xl aspect-square object-cover z-[1]"
                                  src={uploadedIMG}
                                  width={400}
                                  height={400}
                                />
                                <div className="icon-btns flex mr-2 flex-col absolute mt-3 z-[3] items-center gap-2">
                                  <Tooltip
                                    showArrow={true}
                                    placement="right"
                                    className={litePoppins2.className}
                                    color="primary"
                                    content="Download"
                                  >
                                    <Button
                                      isIconOnly
                                      onClick={() => download(uploadedIMG)}
                                      className="rounded-lg bg-[#1e1b1a75] backdrop-blur-sm"
                                    >
                                      <HiOutlineDownload
                                        fontSize={22}
                                        className="text-white"
                                      />
                                    </Button>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                            <div className="right text-center mt-6">
                              <p>VIDEO</p>

                              <div className="img-tools flex items-start mt-2">
                                <video
                                  width="500"
                                  height="400"
                                  autoPlay
                                  loop
                                  preload="none"
                                  className="rounded-xl object-cover"
                                >
                                  <source src={motionVideo} type="video/mp4" />
                                </video>
                                <div className="icon-btns flex flex-col absolute right-[3.7rem] mt-3 z-[3] items-center gap-2">
                                  <Tooltip
                                    showArrow={true}
                                    placement="right"
                                    className={litePoppins2.className}
                                    color="primary"
                                    content="Download"
                                  >
                                    <Button
                                      isIconOnly
                                      onClick={() => download(motionVideo)}
                                      className="rounded-lg bg-[#1e1b1a75] backdrop-blur-sm"
                                    >
                                      <HiOutlineDownload
                                        fontSize={22}
                                        className="text-white"
                                      />
                                    </Button>
                                  </Tooltip>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
