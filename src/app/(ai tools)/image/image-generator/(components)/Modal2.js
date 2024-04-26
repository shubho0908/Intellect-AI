"use client";

import { Image, Button, Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
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
import { BiLike } from "react-icons/bi";

function Modal2({ data }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

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
            <Avatar
              color="primary"
              className="cursor-pointer"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            />
            <p className="w-max ml-2 md:text-md text-sm">{data?.user}</p>
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
                <p className="text-sm mt-1">1024 x 1024px</p>
              </div>
              <div className="created flex flex-col items-end">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-sm mt-1">Jan 1, 2022</p>
              </div>
            </div>
            <div className="second mt-4 flex items-center justify-between">
              <div className="model">
                <p className="text-sm text-gray-500">Model</p>
                <div className="model-name flex items-center  mt-2">
                  <PiMagicWand fontSize={18} className="text-white mr-2" />
                  <p className="text-sm">Stable Diffusion</p>
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
              >
                <BiLike fontSize={21} className="text-white" />
                Like
              </Button>
              <Button
                color="default"
                variant="ghost"
                className="rounded-xl w-fit"
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