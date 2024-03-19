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
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { MdOutlineDone, MdDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

export default function Modaal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileData, setFileData] = useState(null);

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
        className="border-2 border-gray-800"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {!isClicked ? (
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
                ) : (
                  <>
                    <div className="avatar-generate flex items-start justify-between">
                      <div className="left">
                        <div
                          className={`${litePoppins2.className} flex items-center flex-col justify-center`}
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
                      </div>
                      <div className="right">
                        <div className="styles">
                          <p>Pick up any of your style</p>
                          <div className="all-styles">
                            
                          </div>
                        </div>
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
