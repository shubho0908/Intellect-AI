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
import { IoBookmark, IoBookmarkOutline, IoHeartOutline } from "react-icons/io5";
import { BiLike, BiSolidLike } from "react-icons/bi";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Modal2({ data }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [collectionData, setCollectionData] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);

  //Toasts
  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${litePoppins2.className} text-sm`,
    });

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${litePoppins2.className} text-sm`,
    });

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
  }, [data?.userId, data?.imgId]);

  const getTotalLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/images/like?id=${data?.imgId}`);
      const { success, likes, error } = await response.json();
      if (success) {
        setTotalLikes(likes);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  useEffect(() => {
    getTotalLikes();
  }, [data?.imgId, isLiked]);

  const getCollectionData = useCallback(async (imgId) => {
    try {
      const response = await fetch("/api/collections");
      const { success, data, error } = await response.json();

      if (success) {
        const imageIDs = data?.collections.flatMap((collection) =>
          collection?.data.map((item) => item?.imageID)
        );

        setIsSaved(imageIDs.includes(imgId));
        setCollectionData(data?.collections);
      } else {
        errorMsg(error);
        setIsSaved(false);
      }
    } catch (error) {
      errorMsg(error.message);
      setIsSaved(false);
    }
  }, []);

  useEffect(() => {
    getCollectionData(data?.imgId);
  }, [data?.imgId]);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data, error } = await response.json();
      if (success) {
        setUser(data);
      } else {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

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
      errorMsg(error.message);
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
        successMsg(message + " successfully!");
        setIsLiked(true);
      } else if (success && message === "Image disliked") {
        setIsLiked(false);
      }
      if (error) {
        setIsLiked(false);
        errorMsg(error);
      }
    } catch (error) {
      setIsLiked(false);
      errorMsg(error.message);
    }
  };

  const SavePost = async (Data) => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: Data?.imgId,
          type: "image",
        }),
      });
      const { success, data, error, message } = await response.json();
      if (success && message === "Data added to collection") {
        setIsSaved(true);
        successMsg(message);
      } else if (success && message === "Data removed from collection") {
        setIsSaved(false);
      }
      if (error) {
        setIsSaved(false);
        errorMsg(error);
      }
    } catch (error) {
      setIsSaved(false);
      errorMsg(error.message);
    }
  };

  const handleCopyprompt = () => {
    navigator.clipboard.writeText(data?.prompt);
    setIsCopied(true);
    successMsg("Copied to clipboard!");
  };

  return (
    <>
      <div className="items-center h-[600px] md:h-auto overflow-auto md:overflow-hidden flex flex-col md:flex-row md:items-start mt-4">
        <div className="left hidden md:block">
          {data && (
            <>
              <div className="rounded-xl p-2 bg-pink-700/80 shadow-lg flex items-center w-fit absolute z-[5] m-3 backdrop:blur-md">
                <IoHeartOutline fontSize={26} className="text-white mr-2" />
                {totalLikes}
              </div>
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
            <div>
              {!isFollowed ? (
                <Button
                  color="primary"
                  className="rounded-full ml-4"
                  isDisabled={data?.userId === user?._id}
                  onPress={() => setIsFollowed(true)}
                >
                  <RiUserFollowLine fontSize={18} className="text-white" />
                  Follow
                </Button>
              ) : (
                <Button
                  color="primary"
                  isDisabled={data?.userId === user?._id}
                  variant="bordered"
                  className="rounded-full ml-4 border-gray-600 text-white"
                  onPress={() => setIsFollowed(false)}
                >
                  <RiUserUnfollowLine fontSize={18} className="text-white" />
                  Unfollow
                </Button>
              )}
            </div>
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
                  onClick={handleCopyprompt}
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
            <div className="content mt-4 w-full md:max-w-[400px] text-sm bg-[#27272A] p-3 rounded-lg">
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
                isDisabled={!user?.userId && !data?.imgId}
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
                isDisabled={!user?.userId && !data?.imgId}
                className="rounded-xl w-fit"
                onClick={() => SavePost(data)}
              >
                {isSaved ? (
                  <>
                    <IoBookmark fontSize={21} className="text-white" />
                    Saved
                  </>
                ) : (
                  <>
                    <IoBookmarkOutline fontSize={21} className="text-white" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal2;
