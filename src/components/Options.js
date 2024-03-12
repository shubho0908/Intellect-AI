"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import React from "react";
import { IoIosMore } from "react-icons/io";
import { IoDownloadOutline, IoShareSocial } from "react-icons/io5";
import { MdDeleteOutline, MdOutlineBookmarkAdd } from "react-icons/md";
import { Poppins } from "next/font/google";

const litePoppins = Poppins({
    weight: "400",
    subsets: ["latin"],
  });
function Options() {
  return (
    <>
      <Popover placement="top">
        <PopoverTrigger>
          <IoIosMore
            fontSize={35}
            className="absolute z-[2] bg-[#ffffffb1] text-black p-2 rounded-full cursor-pointer m-3"
          />
        </PopoverTrigger>
        <PopoverContent
          className={`${litePoppins.className} relative z-[500000000] top-20 rounded-lg`}
        >
          <div className="btns py-2">
            <div className="download hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
              <IoDownloadOutline
                fontSize={22}
                className="text-white relative bottom-1 mr-2"
              />
              <p className="text-md">Download</p>
            </div>
            <div className="save hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
              <MdOutlineBookmarkAdd fontSize={22} className="text-white mr-2" />
              <p className="text-md">Save to collection</p>
            </div>
            <div className="share hover:bg-[#313132] hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
              <IoShareSocial fontSize={22} className="text-white mr-2" />
              <p className="text-md">Share</p>
            </div>
            <div className="delete hover:bg-red-600 hover:rounded-lg transition-all cursor-pointer flex items-center p-2">
              <MdDeleteOutline fontSize={22} className="text-white mr-2" />
              <p className="text-md">Delete</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default Options;
