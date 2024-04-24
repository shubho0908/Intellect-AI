"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { IoIosMore } from "react-icons/io";

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Menu() {
  return (
    <>
      <div className="menu relative z-[2]">
        <Dropdown
          placement="right"
          className={`${litePoppins.className} relative top-20`}
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              color="primary"
              className="absolute bg-gray-300 m-3 rounded-full"
            >
              <IoIosMore fontSize={22} className="text-black" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" className="flex items-center">
              Download
            </DropdownItem>
            <DropdownItem key="copy">Save to collection</DropdownItem>
            <DropdownItem key="edit">Share</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}

export default Menu;
