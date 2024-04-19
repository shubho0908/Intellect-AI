"use client";
import {
  Avatar,
  Button,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import { Poppins } from "next/font/google";
import { FiEdit3 } from "react-icons/fi";
import CreateProfile from "@/components/CreateProfile";
import Posts from "./Posts";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Profile({ params }) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      {isEdit && <CreateProfile />}
      <div className="profile fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4">
        <div className="user-data">
          <div className="banner">
            <Button
              variant="flat"
              className={`${poppins.className} text-white mt-2 absolute right-6`}
              radius="full"
            >
              Edit cover
            </Button>
            <div class="bg-gradient-to-br from-pink-300 to-blue-400 h-[220px] w-full rounded-lg"></div>
          </div>
          <div className="user-details flex flex-col items-start w-full xl:w-[60%] relative left-4 xl:left-[14rem] bottom-[5.5rem]">
            <div className="dp flex items-end">
              <Avatar
                isBordered
                color="primary"
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                className="w-[10rem] h-[10rem] text-large"
              />
              <Button
                isIconOnly
                onClick={() => setIsEdit(true)}
                color="primary"
                className="rounded-full relative right-10"
                size="sm"
              >
                <FiEdit3 color="white" fontSize={15} />
              </Button>
            </div>
            <div className="data mt-6">
              <p
                className={`${poppins.className} text-xl flex items-center gap-2 cursor-pointer font-bold`}
              >
                Shubhojeet Bera
                <MdVerified className="text-blue-500" fontSize={22} />
              </p>
              <p className={`${poppins.className} text-gray-400`}>
                @{params?.username}
              </p>
              <div
                className={`${litePoppins.className} tags mt-3 flex items-center gap-3`}
              >
                <Chip color="default">💻 Software Developer</Chip>
              </div>
              <div className={`${litePoppins.className} summary mt-3`}>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                  non iure ipsa delectus minus facere molestiae cum quisquam,
                  dolor nemo.
                </p>
              </div>
              <div
                className={`${litePoppins.className} stats  flex items-center mt-3 gap-3`}
              >
                <div className="followers flex items-center gap-2">
                  <p className="font-bold text-gray-300">500</p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div className="following flex items-center gap-2">
                  <p className="font-bold text-gray-300">12</p>
                  <p className="text-gray-400">Following</p>
                </div>
              </div>
              <div className="user-posts mt-8">
                <Posts/>
              </div>
            </div>
          </div>
        </div>
        <div className="content"></div>
      </div>
    </>
  );
}

export default Profile;
