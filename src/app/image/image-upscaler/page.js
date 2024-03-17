"use client";
import {
  Button,
  Skeleton,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Progress,
  Image,
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

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

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
            console.log(downloadURL);
            // Handle successful upload
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
    const downloadURL = await uploadImage(fileData);
    if (downloadURL !== undefined || downloadURL !== null) {
      setUploadedIMG(downloadURL);
    }
    onOpen();
  };

  return (
    <>
      <div className="image-upscaler flex flex-col items-center fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4">
        <div className="top flex flex-col w-3/4 justify-center items-center mt-14">
          <div className="tag"></div>
          <p className={`${litePoppins.className} text-center text-[4rem]`}>
            Upscale and Restore your images with{" "}
            <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
              Intellect.AI
            </span>
          </p>
          <p
            className={`${litePoppins2.className} text-lg w-2/3 mt-4 text-center text-gray-300`}
          >
            Elevate your images effortlessly with advanced AI technology for
            upscaling and restoring photos with precision and ease.
          </p>
          <div
            className={`${litePoppins2.className} flex items-center flex-col justify-center w-[40%] mt-10`}
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
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
                      <p className="mt-3">File selected: {fileData.name}</p>
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

            <Button
              color="primary"
              isDisabled={!isFileSelected}
              onPress={handleOpen}
              className={`${litePoppins.className} mt-6 w-full`}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="bottom flex flex-col justify-center items-center mt-20">
          <p className={`${litePoppins.className} text-3xl`}>Examples</p>
          <div className="mockup-compare flex gap-6 mt-2 justify-center flex-wrap items-center">
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/upscale/inp.jpeg"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
                <img
                  slot="second"
                  src="/upscale/output.png"
                  className="w-[450px] h-[450px] object-cover rounded-xl shadow-xl"
                />
              </ImgComparisonSlider>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="rounded-lg w-fit mt-8">
              <ImgComparisonSlider>
                <img
                  slot="first"
                  src="/upscale/inp2.jpeg"
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
                  src="/upscale/inp3.jpeg"
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
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Progress
                  aria-label="Downloading..."
                  size="md"
                  value={uploadProgress}
                  color="success"
                  showValueLabel={true}
                  className="max-w-md"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
