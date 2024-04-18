"use client";

import {
  Input,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";

import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Navbar() {
  return (
    <>
      <div
        className={`navbar flex z-[4] items-center justify-between p-3 sm:p-6 ${poppins.className}`}
      >
        <div className="left relative left-0 sm:left-[120px] md:left-[320px]">
          <div className="sm:flex hidden flex-wrap md:flex-nowrap gap-4">
            <Input
              type="text"
              placeholder="Search for any model."
              className="xl2:w-[30rem] w-[15rem]"
            />
          </div>
          <Image
            src="/logo2.png"
            alt="logo"
            className="sm:hidden block"
            width={50}
            height={50}
          />
        </div>
        <div className="right pr-6 flex items-center">
          <p> Hi, Shubho!</p>
          <div className="flex items-center gap-4">
            <Dropdown placement="bottom-end" backdrop="opaque">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform relative left-6 cursor-pointer"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className={poppins.className}
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">shubhobera98@gmail.com</p>
                </DropdownItem>
                <DropdownItem key="profile">Profile</DropdownItem>
                <DropdownItem key="collections">My Collections</DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-white hover:bg-red-600 transition-all"
                  color="error"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
