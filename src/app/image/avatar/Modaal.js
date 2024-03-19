import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { MdOutlineDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

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
        size="5xl"
        isDismissable={false}
        backdrop="blur"
        placement="center"
        className="border-2 border-gray-800"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
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
                        <RxCross2 fontSize={20} className="text-red-500 mr-3" />
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
                  <div className="bottom mt-6 flex items-center justify-center w-full">
                    <Button
                      color="primary"
                      className={`${litePoppins.className} p-6 rounded-lg`}
                    >
                      Ok, I understand!
                    </Button>
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
