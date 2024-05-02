"use client";

import { Image, Button, Avatar } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoCopy, GoDownload } from "react-icons/go";
import {
  MdDeleteOutline,
  MdOutlineBookmarkAdd,
  MdOutlineDone,
} from "react-icons/md";
import { PiMagicWand } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import { IoBookmarkOutline } from "react-icons/io5";
import { BiLike, BiSolidLike } from "react-icons/bi";
import Link from "next/link";

function Modal2({ data }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  const getUserLikeData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/images/check-like?userId=${data?.userId}&imageId=${data?.imgId}`
      );
      const { message } = await response.json();
      if (message === "Image liked") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  useEffect(() => {
    getUserLikeData();
  }, [getUserLikeData]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data, error } = await response.json();
      if (success) {
        setUser(data);
      } else {
        console.error("Error fetching user data:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const downloadImage = async () => {
    const imageUrl = data?.img;

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

  const LikePost = async () => {
    try {
      const response = await fetch("/api/images/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: data?.imgId,
        }),
      });
      const { success, message, error } = await response.json();
      if (success && message === "Image liked") {
        setIsLiked(true);
      } else if (success && message === "Image disliked") {
        setIsLiked(false);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="items-center h-[600px] md:h-auto overflow-auto md:overflow-hidden flex flex-col md:flex-row md:items-start mt-4">
        <div className="left hidden md:block">
          {data && (
            <>
              <Image
                src={data?.img}
                alt="image"
                width={450}
                height={450}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                className="cursor-pointer z-[1] object-cover h-[450px] w-[450px]"
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
          <div className="user-data flex items-center">
            <Link
              href={`/profile/${data?.username}`}
              className="flex items-center gap-2"
            >
              <Avatar
                color="primary"
                className="cursor-pointer"
                src={data?.profile}
              />
              <p className="w-max ml-2 md:text-md text-sm">{data?.name}</p>
            </Link>
            {data?.userId === user?._id ? null : (
              <div>
                {!isFollowed ? (
                  <Button
                    color="primary"
                    className="rounded-full ml-4"
                    onPress={() => setIsFollowed(true)}
                  >
                    <RiUserFollowLine fontSize={18} className="text-white" />
                    Follow
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="bordered"
                    className="rounded-full ml-4 border-gray-600 text-white"
                    onPress={() => setIsFollowed(false)}
                  >
                    <RiUserUnfollowLine fontSize={18} className="text-white" />
                    Unfollow
                  </Button>
                )}
              </div>
            )}
          </div>
          {data && (
            <>
              <Image
                src={data?.img}
                alt="image"
                width={500}
                height={500}
                className="block md:hidden mt-6 z-[1] w-fit cursor-pointer rounded-xl"
              />

              <div className=" gap-4 items-center mt-4 flex md:hidden">
                <Button isIconOnly variant="faded">
                  <GoDownload fontSize={20} className="text-white" />
                </Button>
                <Button isIconOnly variant="faded">
                  <MdOutlineBookmarkAdd fontSize={20} className="text-white" />
                </Button>
                <Button isIconOnly color="danger" variant="faded">
                  <MdDeleteOutline fontSize={20} className="text-white" />
                </Button>
              </div>
            </>
          )}
          <div className="prompt mt-4">
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
                    <GoCopy fontSize={18} className="text-white" />
                  ) : (
                    <MdOutlineDone fontSize={18} className="text-white" />
                  )}
                </Button>
              </div>
            </div>
            <div className="content mt-4 w-full md:max-w-[350px] text-sm bg-[#27272A] p-3 rounded-lg">
              {data?.prompt}
            </div>
          </div>
          <div className="more-details py-6 px-2 ">
            <div className="first flex items-center justify-between">
              <div className="dimension">
                <p className="text-sm text-gray-500">Resolution</p>
                <p className="text-sm mt-1">{data?.dimensions} px</p>
              </div>
              <div className="created flex flex-col items-end">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-sm mt-1">{data?.created}</p>
              </div>
            </div>
            <div className="second mt-4 flex items-center justify-between">
              <div className="model">
                <p className="text-sm text-gray-500">Model</p>
                <div className="model-name flex items-center  mt-2">
                  <PiMagicWand fontSize={18} className="text-white mr-2" />
                  <p className="text-sm">{data?.model}</p>
                </div>
              </div>
              <div className="category flex flex-col items-end">
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-sm mt-2">Image tool</p>
              </div>
            </div>
            <div className="btn-grp flex items-center justify-between gap-3 mt-6">
              <Button
                color="default"
                variant="ghost"
                className="rounded-xl w-fit"
                onClick={LikePost}
              >
                {isLiked ? (
                  <>
                    <BiSolidLike fontSize={21} className="text-white" />
                    Liked
                  </>
                ) : (
                  <>
                    <BiLike fontSize={21} className="text-white" />
                    Like
                  </>
                )}
              </Button>
              <Button
                color="default"
                variant="ghost"
                className="rounded-xl w-fit"
                onClick={downloadImage}
              >
                <RxDownload fontSize={21} className="text-white" />
                Download
              </Button>
              <Button
                color="default"
                variant="ghost"
                className="rounded-xl w-fit"
              >
                <IoBookmarkOutline fontSize={21} className="text-white" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal2;
