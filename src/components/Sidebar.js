"use client";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useState } from "react";
import { GoHome, GoFileDirectory } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoVideocamOutline, IoImageOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "@nextui-org/react";
import { MdOutlineLogin } from "react-icons/md";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Sidebar() {
  const [isDown, setIsDown] = useState({
    image: false,
    video: false,
  });
  const pathname = usePathname();

  return (
    <>
      <div className="sidebar-wrapper h-[100vh] shadow-xl bg-[#120f0f70] border-gray-800 border-r-2 backdrop-blur-xl z-[21] fixed overflow-auto scrollbar-hide">
        <div
          className={`sidebar z-[21] flex flex-col w-fit p-6 md:px-10 ${poppins.className}`}
        >
          <div className="logo-section hidden md:block">
            <Link href="/">
              <Image src="/logo1.png" width={220} height={220} alt="Logo" />
            </Link>
          </div>
          <div className="logo-section block md:hidden">
            <Link href="/">
              <Image src="/logo2.png" width={50} height={50} alt="Logo" />
            </Link>
          </div>
          <Link href="/profile/shubho0908">
            <div className="flex mt-6 cursor-pointer bg-gray-700/40 hover:bg-gray-700/80 transition-all px-6 py-3 rounded-xl items-center justify-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  as="button"
                  className="transition-transform relative cursor-pointer"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </div>
              <div className="data">
                <p>Shubhojeet...</p>
                <p className="text-sm text-gray-400">@shubho0908</p>
              </div>
            </div>
          </Link>

          <div className="middle-section my-20 md:my-6 flex flex-col">
            <p className="mt-3 text-sm font-semibold text-gray-400">OVERVIEW</p>
            <Link
              href="/"
              className={`hover:bg-[#0266D9] ${
                pathname === "/" && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
            >
              <GoHome fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Home</p>
            </Link>
            <Link
              href="/"
              className={`hover:bg-[#0266D9] ${
                pathname === "/dashboard" && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
            >
              <LuLayoutDashboard fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Dashboard</p>
            </Link>
            <Link
              href="/collections"
              className={`hover:bg-[#0266D9] cursor-pointer ${
                pathname.includes("/collections") && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all my-1`}
            >
              <div className="collection-div flex items-center">
                <GoFileDirectory fontSize={23} className="text-white md:mr-5" />
                <p className="hidden md:block"> My Collections</p>
              </div>
            </Link>
            <p className="mt-6 text-sm font-semibold text-gray-400">AI TOOLS</p>
            <div
              className={`hover:bg-[#0266D9] cursor-pointer ${
                pathname.includes("/image/") && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
              onClick={() => {
                setIsDown({ ...isDown, image: !isDown.image });
              }}
            >
              <div className="image-div flex items-center">
                <IoImageOutline fontSize={23} className="text-white md:mr-5" />
                <p className="hidden cursor-pointer md:block">Images</p>
              </div>
              {isDown.image ? (
                <FaAngleUp
                  fontSize={16}
                  className="text-white hidden md:block"
                />
              ) : (
                <FaAngleDown
                  fontSize={16}
                  className="text-white hidden md:block"
                />
              )}
            </div>
            {isDown.image ? (
              <div className="hidden py-2 image-tools md:flex flex-col relative left-10 leading-10">
                <Link
                  href="/image/image-generator"
                  className={`${
                    pathname.includes("/image-generator")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  Image Generator
                </Link>
                <Link
                  href="/image/image-upscaler"
                  className={`${
                    pathname.includes("/image-upscaler")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  Image Upscaler
                </Link>

                <Link
                  href="/image/avatar"
                  className={`${
                    pathname.includes("/avatar")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  AI Avatar Creator
                </Link>
                <Link
                  href="/image/magic-expand"
                  className={`${
                    pathname.includes("/magic-expand")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  AI Magic Expand
                </Link>
              </div>
            ) : null}

            <div
              className={`hover:bg-[#0266D9] cursor-pointer ${
                pathname.includes("/video/") && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
              onClick={() => {
                setIsDown({ ...isDown, video: !isDown.video });
              }}
            >
              <div className="video-div flex items-center">
                <IoVideocamOutline
                  fontSize={23}
                  className="text-white md:mr-5"
                />
                <p className="hidden md:block">Videos</p>
              </div>
              {isDown.video ? (
                <FaAngleUp
                  fontSize={16}
                  className="text-white hidden md:block"
                />
              ) : (
                <FaAngleDown
                  fontSize={16}
                  className="text-white hidden md:block"
                />
              )}
            </div>
            {isDown.video ? (
              <div className="hidden py-2 md:flex video-tools flex-col relative left-10 leading-10">
                <Link
                  href="/video/image-to-motion"
                  className={`${
                    pathname.includes("/image-to-motion")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white flex items-start transition-all`}
                >
                  Image to Motion
                </Link>

                <Link
                  href="/video/video-caption"
                  className={`${
                    pathname.includes("/video-caption")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  Video Caption
                </Link>
                <Link
                  href="/video/video-upscaler"
                  className={`${
                    pathname.includes("/video-upscaler")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  Video Upscaler
                </Link>
              </div>
            ) : null}
          </div>
          <Button variant="solid" className="bg-red-600">
            <MdOutlineLogin fontSize={23} className="text-white" />
            <p>Log out</p>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
