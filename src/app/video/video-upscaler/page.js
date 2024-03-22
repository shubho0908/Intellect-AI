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
  Spinner,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedIMG, setUploadedIMG] = useState(null);
  const [upscaledImg, setUpscaledImg] = useState(null);
  const [upscaleLoading, setUpscaleLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

  useEffect(() => {
    if (!uploadedIMG) {
      setUpscaleLoading(true);
    } else {
      setTimeout(() => {
        setUpscaledImg(uploadedIMG);
      }, 5000);
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

      const fileReference = ref(storage, `upscale/${file.name}`);
      const uploadData = uploadBytesResumable(fileReference, file);

      uploadData.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadData.snapshot.ref);
            setUploadedIMG(downloadURL);
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleOpen = async () => {
    await uploadImage(fileData);
    onOpen();
  };

  return (
    <>
      <div className="image-upscaler flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top w-3/4 flex flex-col items-center mt-6">
          <Chip
            color="warning"
            variant="dot"
            className={`${litePoppins2.className} py-4 mt-2 mb-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
          >
            AI VIDEO UPSCALER
          </Chip>
          <p
            className={`${litePoppins.className} w-3/4 text-center text-[3.8rem]`}
          >
            Upscale your low-quality videos with{" "}
            <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
              Intellect.AI
            </span>
          </p>
          <p
            className={`${litePoppins2.className} text-lg w-2/3 text-center mt-4 text-gray-300`}
          >
            Upgrade video quality effortlessly. Transform low-resolution footage
            into high-definition brilliance with advanced AI technology.
          </p>
          <Button
            color="primary"
            variant="shadow"
            className={`${litePoppins.className} p-6 text-lg mt-8 mb-20`}
            onClick={handleOpen}
          >
            Get Started
          </Button>
          <Skeleton isLoaded={isLoading} className="rounded-lg w-fit">
            <div className="video-demo p-2 rounded-xl bg-gradient-to-r from-blue-900 via-pink-200 to-blue-800">
              <video
                width="2560"
                height="1440"
                autoPlay
                loop
                preload="none"
                className="rounded-xl shadow-xl"
                muted
              >
                <source src="/video upscale/demo.mp4" type="video/mp4" />
              </video>
            </div>
          </Skeleton>
        </div>
        <div className="bottom flex flex-col justify-center items-center mt-20"></div>
      </div>
      <Modal
        className="max-w-fit"
        placement="center"
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setUploadProgress(0);
          setUpscaledImg(null);
          setUploadedIMG(false);
          setUpscaleLoading(false);
          setIsFileSelected(false);
          setFileData(null);
          setIsSelected(false);
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
                        <p>Your image is being uploaded...</p>
                        <Progress
                          aria-label="Uploading..."
                          size="md"
                          value={uploadProgress}
                          color="success"
                          showValueLabel={true}
                          className="max-w-md mt-3"
                        />
                      </div>
                    </>
                  )}
                  <div className="upscale-data flex flex-col items-center">
                    {!upscaledImg && uploadedIMG && (
                      <>
                        <div className="flex flex-col items-center">
                          <p>Please wait while we upscale your image..</p>
                          <Spinner
                            label="Loading.."
                            color="primary"
                            className="mt-6"
                            labelColor="primary"
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

                        <Button color="primary">Download Upscaled Image</Button>
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
