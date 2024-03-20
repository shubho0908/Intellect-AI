"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Image,
  Checkbox,
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Progress,
  Textarea,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { MdOutlineDone, MdDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
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

export default function Modaal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [nextStep, setNextStep] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [uploadedIMG, setUploadedIMG] = useState(null);
  // const [avatarIMG, setAvatarIMG] = useState(null);
  // const [startUpload, setStartUpload] = useState(false);

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

  const goodImages = [
    {
      url: "/avatar-demo/selfie.jpg",
      alt: "Selfie",
      title: "Selfie",
    },
    {
      url: "/avatar-demo/clean.jpeg",
      alt: "Clean",
      title: "Clean Background",
    },
    {
      url: "/avatar-demo/angles.jpeg",
      alt: "Different Angles",
      title: "Different Angles",
    },
  ];

  const badImages = [
    {
      url: "/avatar-demo/covered.jpg",
      alt: "covered",
      title: "Covered Face",
    },
    {
      url: "/avatar-demo/side.jpg",
      alt: "Side",
      title: "Side Look",
    },
    {
      url: "/avatar-demo/group.jpeg",
      alt: "Group",
      title: "Group Selfie",
    },
  ];

  const styles = [
    {
      url: "/avatar/gym.jpg",
      alt: "Fitness",
      title: "Fitness",
      description: "Energetic, health-conscious, and stylish.",
    },
    {
      url: "/avatar/corporate.jpg",
      alt: "Professional",
      title: "Professional",
      description: "Polished, sophisticated, and elegant.",
    },
    {
      url: "/avatar/magic.jpg",
      alt: "Fictional",
      title: "Fictional",
      description: "Imaginative, creative, and whimsical.",
    },
    {
      url: "/avatar/cyberpunk.jpg",
      alt: "Gaming",
      title: "Cyberpunk",
      description: "Futuristic, edgy, and tech-savvy.",
    },
    {
      url: "/avatar/tradition.jpg",
      alt: "Traditional",
      title: "Traditional",
      description: "Classic, and sophisticated attire.",
    },
  ];

  const uploadImage = async (file) => {
    try {
      if (!file) {
        return null;
      }

      const fileReference = ref(storage, `avatar/${file.name}`);
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

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        className={`${litePoppins.className} p-8 rounded-xl text-lg mt-8`}
      >
        Create AI Avatars
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isClicked ? "2xl" : "5xl"}
        isDismissable={false}
        backdrop="blur"
        placement="center"
        onClose={() => {
          onClose();
          setIsFileSelected(false);
          setFileData(null);
          setTimeout(() => {
            setIsClicked(false);
          }, 1000);
          setIsAgreed(false);
        }}
        className="border-2 border-gray-800"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {!isClicked && (
                  <div className="requirement flex flex-col items-center py-6 px-3">
                    <div className="top flex flex-col items-center">
                      <p className={`${litePoppins.className} text-xl`}>
                        Upload photo requirement
                      </p>
                      <p
                        className={`${litePoppins2.className} w-2/3 text-center mt-2 text-gray-400`}
                      >
                        It's the original image you upload that directly affects
                        your output, so please upload a proper image for better
                        results.
                      </p>
                    </div>
                    <div className="mid mt-6 flex items-start gap-6 justify-between">
                      <div className="left shadow-lg bg-[#4c42425b] p-4 rounded-xl">
                        <div
                          className={`${litePoppins.className} head flex items-center`}
                        >
                          <MdOutlineDone
                            fontSize={20}
                            className="text-green-500 mr-3"
                          />
                          <p>Good Photo Example</p>
                        </div>
                        <div className="images flex gap-4 items-start">
                          {goodImages.map((image, index) => (
                            <div
                              className="image mt-4 flex flex-col items-center"
                              key={index}
                            >
                              <div className="img">
                                <Image
                                  src={image.url}
                                  alt={image.alt}
                                  width={150}
                                  height={150}
                                  className="object-cover aspect-square z-[2]"
                                />
                                <Image
                                  src="/avatar-demo/tick.png"
                                  alt="true"
                                  width={25}
                                  height={25}
                                  className="object-cover absolute bottom-2 left-2 rounded-full aspect-square z-[3]"
                                />
                              </div>
                              <p
                                className={`${litePoppins2.className} mt-2 text-sm text-center`}
                              >
                                {image.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="right shadow-lg bg-[#4c42425b] p-4 rounded-xl">
                        <div
                          className={`${litePoppins.className} head flex items-center`}
                        >
                          <RxCross2
                            fontSize={20}
                            className="text-red-500 mr-3"
                          />
                          <p>Bad Photo Example</p>
                        </div>
                        <div className="images flex gap-4 items-center">
                          {badImages.map((image, index) => (
                            <div
                              className="image mt-4 flex flex-col items-center"
                              key={index}
                            >
                              <div className="img">
                                <Image
                                  src={image.url}
                                  alt={image.alt}
                                  width={150}
                                  height={150}
                                  className="object-cover aspect-square z-[2]"
                                />
                                <Image
                                  src="/avatar-demo/wrong.png"
                                  alt="true"
                                  width={25}
                                  height={25}
                                  className="object-cover absolute bottom-2 left-2 rounded-full aspect-square z-[3]"
                                />
                              </div>
                              <p
                                className={`${litePoppins2.className} text-sm mt-2 text-center`}
                              >
                                {image.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bottom mt-6 flex items-center justify-between w-full">
                      <Checkbox
                        isSelected={isAgreed}
                        onValueChange={setIsAgreed}
                        className={`${litePoppins2.className}`}
                      >
                        I agree that I'm my image with my own consent to use it
                        for my avatar creation.
                      </Checkbox>

                      <Button
                        color="primary"
                        isDisabled={!isAgreed}
                        onClick={() => setIsClicked(true)}
                        className={`${litePoppins.className} p-6 rounded-lg`}
                      >
                        Ok, I understand!
                      </Button>
                    </div>
                  </div>
                )}

                {isClicked && !nextStep && (
                  <div className="avatar-generate py-6 flex flex-col items-center justify-center">
                    <div className="left flex flex-col items-center w-full px-6">
                      <div className="flex items-center mb-6">
                        <p className={`${litePoppins.className} text-xl`}>
                          STEP 1/2:{" "}
                        </p>
                        <p className={`${litePoppins.className} text-xl ml-3`}>
                          Upload an image
                        </p>
                      </div>
                      <div
                        className={`${litePoppins2.className} flex w-full items-center flex-col justify-center`}
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
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
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
                                    <MdDone
                                      fontSize={30}
                                      className="text-green-500"
                                    />
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
                      </div>
                      <Button
                        color="primary"
                        isDisabled={!isFileSelected}
                        onClick={() => setNextStep(true)}
                        className={`${litePoppins.className} w-full mt-6`}
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {nextStep && (
                  <>
                    <div className="right flex flex-col items-center py-6">
                      <div className="flex items-center">
                        <p className={`${litePoppins.className} text-xl`}>
                          STEP 2/2:{" "}
                        </p>
                        <p className={`${litePoppins.className} text-xl ml-3`}>
                          Select Your Favorite Style{" "}
                        </p>
                      </div>
                      <div className="styles flex flex-col items-center w-full">
                        <div className="all-styles flex items-center justify-center w-full">
                          <div className="styles mt-6 flex gap-6 justify-center flex-wrap items-center">
                            {styles &&
                              styles.map((img, index) => {
                                return (
                                  <>
                                    <Card
                                      shadow="sm"
                                      className={`bg-[#4c42425b] transition-all cursor-pointer w-fit ${
                                        selectedAvatar === img.title
                                          ? "border-2 border-blue-500"
                                          : ""
                                      }`}
                                      key={index}
                                    >
                                      <CardBody
                                        onClick={() =>
                                          setSelectedAvatar(img.title)
                                        }
                                        className="overflow-visible p-0"
                                      >
                                        <Image
                                          radius="md"
                                          width={150}
                                          height={150}
                                          alt={img.alt}
                                          className="w-full object-cover aspect-square"
                                          src={img.url}
                                        />
                                      </CardBody>
                                      <CardFooter className="text-small justify-between">
                                        <Checkbox
                                          className={litePoppins2.className}
                                          isSelected={
                                            selectedAvatar === img.title
                                          }
                                          onValueChange={() =>
                                            setSelectedAvatar(img.title)
                                          }
                                        >
                                          {img.title}
                                        </Checkbox>
                                      </CardFooter>
                                    </Card>
                                  </>
                                );
                              })}
                          </div>
                        </div>
                        <Button
                          color="primary"
                          isDisabled={!selectedAvatar}
                          className={`${litePoppins.className} mt-10 w-1/2`}
                        >
                          Create your avatar!
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
