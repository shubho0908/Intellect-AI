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
  Switch,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";

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
  const [upscaledImg, setUpscaledImg] = useState(null);
  const [isEnhance, setIsEnhance] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

  useEffect(() => {
    const upscaleImage = async () => {
      try {
        const response = await fetch("/api/images/upscale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: uploadedIMG,
            enhance: isEnhance,
          }),
        });

        const { success, data, error } = await response.json();
        if (success) {
          setUpscaledImg(data);
        }
        if (error?.includes("CUDA")) {
          alert("GPU is too busy, please try again later.");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (uploadedIMG) {
      console.log(uploadedIMG);
      upscaleImage();
    }
  }, [uploadedIMG]);

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setIsFileSelected(true);
      setFileData(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
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
                public_id: `images/ImageUpscaler/${Date.now()}`,
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

  const downloadImage = async () => {
    const imageUrl = upscaledImg;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "download.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="image-upscaler flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top flex justify-between items-start mt-6">
          <div className="left">
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit">
              <Image
                src="/upscale/upscale.png"
                className="z-[3]"
                alt="poster"
                width={600}
              />
            </Skeleton>
          </div>
          <div className="right w-1/2">
            <Chip
              color="warning"
              variant="dot"
              className={`${litePoppins2.className} py-4 mt-2 mb-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
            >
              AI IMAGE UPSCALER
            </Chip>
            <p className={`${litePoppins.className} text-[3rem]`}>
              Upscale and Restore your images with{" "}
              <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
                Intellect.AI
              </span>
            </p>
            <p
              className={`${litePoppins2.className} text-lg w-3/4 mt-4 text-gray-300`}
            >
              Elevate your images effortlessly with advanced AI technology for
              upscaling and restoring photos with precision and ease.
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
                          File selected: {fileData.name}
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
                <div className="flex items-center fadein w-full justify-between mt-6 ">
                  <Switch isSelected={isEnhance} onValueChange={setIsEnhance}>
                    Face Enhance
                  </Switch>
                  <Button
                    color="primary"
                    isDisabled={!isFileSelected}
                    onPress={handleOpen}
                    className={`${litePoppins.className} w-[100px]`}
                  >
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
                  src="/upscale/inp1.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/upscale/output1.png"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/upscale/inp2.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/upscale/output2.png"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/upscale/inp3.jpg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/upscale/output3.png"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
          </div>
        </div>
      </div>
      <Modal
        placement="center"
        size={`${upscaledImg ? "4xl" : "xl"}`}
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setTimeout(() => {
            setUpscaledImg(null);
          }, 1000);
          setUploadedIMG(false);
          setIsFileSelected(false);
          setFileData(null);
          setIsEnhance(false);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className={`${litePoppins.className} mt-8 mb-8`}>
                <div className="upscale-body">
                  {!uploadedIMG && (
                    <>
                      <div className="flex flex-col items-center">
                        <p className={`${litePoppins.className} text-xl`}>
                          Uploading your image
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
                    {!upscaledImg && uploadedIMG && (
                      <>
                        <div className="flex flex-col items-center">
                          <p>Please wait while we upscale your image..</p>
                          <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className="max-w-md py-5"
                          />
                        </div>
                      </>
                    )}
                    {upscaledImg && (
                      <>
                        <p>Your image is upscaled successfully!</p>
                        <div className="img-compare flex items-center overflow-scroll scrollbar-hide gap-4 my-5">
                          <div className="before flex flex-col items-center">
                            <p
                              className={`${litePoppins.className} text-center`}
                            >
                              ORIGINAL
                            </p>
                            <Image
                              src={uploadedIMG}
                              alt="Uploaded Image"
                              width={400}
                            />
                          </div>
                          <div className="after flex flex-col items-center">
                            <p
                              className={`${litePoppins.className} text-center`}
                            >
                              UPSCALED
                            </p>
                            <Image
                              src={upscaledImg}
                              alt="Upscaled Image"
                              width={400}
                            />
                          </div>
                        </div>

                        <Button onClick={downloadImage} color="primary">
                          Download Upscaled Image
                        </Button>
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
