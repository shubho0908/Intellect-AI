"use client";

import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoCopy, GoDownload } from "react-icons/go";
import { PiMagicWand } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineBookmarkAdd, MdDeleteOutline } from "react-icons/md";
import Link from "next/link";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});
const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function RelatedImages({ Data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [context, setContext] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  useEffect(() => {
    if (Data === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [Data]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/login");
        const { success, data, error } = await response.json();
        if (success) {
          setUserData(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  });

  if (Data && Data?.length < 2) {
    return null;
  }

  const downloadImage = async (img) => {
    const imageUrl = img;

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
      <div className="related-images">
        <Skeleton isLoaded={Data !== null} className="rounded-lg w-fit">
          <p className={`${poppins.className} text-2xl`}>Related Images</p>
        </Skeleton>
        <div className="images flex items-center justify-start flex-wrap mt-8 gap-4">
          <div className="flex flex-wrap gap-3">
            {Data?.map((image, index) => (
              <>
                <Image
                  isZoomed
                  key={index}
                  src={image?.url}
                  alt="image"
                  width={350}
                  height={350}
                  onClick={() => {
                    onOpen()
                    setContext(image);
                  }}
                  className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
                />
              </>
            ))}
          </div>
          <Modal
            backdrop="blur"
            isOpen={isOpen}
            size="4xl"
            onClose={() => {
              onClose();
            }}
            className={`${litePoppins.className} my-modal`}
          >
            <ModalContent className="modal-body">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
                  <ModalBody className="mb-5">
                    <div className="modal-body items-center h-[600px] md:h-auto overflow-auto md:overflow-hidden flex flex-col md:flex-row md:items-start">
                      <div className="left hidden md:block">
                        {context && (
                          <>
                            <Image
                              src={context?.url}
                              alt="image"
                              width={500}
                              height={500}
                              onContextMenu={(e) => {
                                e.preventDefault();
                              }}
                              className="cursor-pointer z-[1]"
                            />
                          </>

                          //   <img
                          //     src={context}
                          //     alt="image"
                          //     className="w-[400px] rounded-xl cursor-pointer z-[1]"
                          //   />
                        )}
                      </div>
                      <div className="right w-full md:w-fit ml-0 mt-0 md:mt-0 md:ml-8">
                        <div className="user-data flex items-center gap-4">
                          <Link
                            href={`/profile/${userData?.username}`}
                            className="flex items-center gap-4"
                          >
                            <Avatar
                              color="primary"
                              className="cursor-pointer"
                              src={userData?.profileImg}
                            />
                            <p className="w-max md:text-md text-md">
                              {userData?.name}
                            </p>
                          </Link>
                          {!isFollowed ? (
                            <Button
                              color="primary"
                              isDisabled
                              className="rounded-full"
                              onPress={() => setIsFollowed(true)}
                            >
                              <RiUserFollowLine
                                fontSize={18}
                                className="text-white"
                              />
                              Follow
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              isDisabled
                              variant="bordered"
                              className="rounded-full border-gray-600 text-white"
                              onPress={() => setIsFollowed(false)}
                            >
                              <RiUserUnfollowLine
                                fontSize={18}
                                className="text-white"
                              />
                              Unfollow
                            </Button>
                          )}
                        </div>
                        {context && (
                          <>
                            <Image
                              src={context?.url}
                              alt="image"
                              width={500}
                              height={500}
                              className="block md:hidden mt-6 z-[1] w-fit cursor-pointer rounded-xl"
                            />

                            <div className=" gap-4 items-center mt-4 flex md:hidden">
                              <Button isIconOnly variant="faded">
                                <GoDownload
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                              <Button isIconOnly variant="faded">
                                <MdOutlineBookmarkAdd
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                              <Button isIconOnly color="danger" variant="faded">
                                <MdDeleteOutline
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                            </div>
                          </>
                        )}
                        <div className="prompt mt-6">
                          <div className="head flex items-center">
                            <p>Prompt details</p>
                            <div className="cursor-pointer rounded-lg">
                              <Button
                                isIconOnly
                                variant="bordered"
                                onClick={() => setIsCopied(true)}
                                className="rounded-lg ml-2 border-none text-white"
                              >
                                {!isCopied ? (
                                  <GoCopy
                                    fontSize={18}
                                    className="text-white"
                                  />
                                ) : (
                                  <MdOutlineDone
                                    fontSize={18}
                                    className="text-white"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="content mt-4 w-full md:max-w-[350px] text-sm bg-[#27272A] p-3 rounded-lg">
                            {context?.prompt?.length >= 90 ? (
                              <p>{context?.prompt?.slice(0, 90)}...</p>
                            ) : (
                              <p>{context?.prompt}</p>
                            )}
                          </div>
                        </div>
                        <div className="more-details py-6 px-2 ">
                          <div className="first flex items-center justify-between">
                            <div className="dimension">
                              <p className="text-sm text-gray-500">
                                Resolution
                              </p>
                              <p className="text-sm mt-1">
                                {context?.miscData?.dimensions}
                              </p>
                            </div>
                            <div className="created flex flex-col items-end">
                              <p className="text-sm text-gray-500">
                                Created At
                              </p>
                              <p className="text-sm mt-1">
                                {new Intl.DateTimeFormat("en-GB", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }).format(new Date(context?.createdAt))}
                              </p>
                            </div>
                          </div>
                          <div className="second mt-4 flex items-center justify-between">
                            <div className="model">
                              <p className="text-sm text-gray-500">Model</p>
                              <div className="model-name flex items-center  mt-2">
                                <PiMagicWand
                                  fontSize={18}
                                  className="text-white mr-2"
                                />
                                <p className="text-sm">
                                  {context?.miscData?.modelName}
                                </p>
                              </div>
                            </div>
                            <div className="category flex flex-col items-end">
                              <p className="text-sm text-gray-500">Category</p>
                              <p className="text-sm mt-2">Image tool</p>
                            </div>
                          </div>
                          <Button
                            color="primary"
                            variant="solid"
                            onClick={() => downloadImage(context?.url)}
                            className="rounded-xl mt-10 w-full"
                          >
                            <RxDownload fontSize={21} className="text-white" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default RelatedImages;
