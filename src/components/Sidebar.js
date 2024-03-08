"use client";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useState } from "react";
import { GoHome, GoFileDirectory } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoVideocamOutline, IoImageOutline } from "react-icons/io5";
import { PiWaveform } from "react-icons/pi";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Sidebar() {
  const [isDown, setIsDown] = useState({
    image: false,
    video: false,
    audio: false,
  });
  const pathname = usePathname();

  return (
    <>
      <div
        className={`sidebar fixed overflow-auto bg-[#07060B] flex flex-col w-fit ${
          isDown.video && isDown.image && isDown.audio ? "h-full" : "h-[100vh]"
        } p-6 md:px-12 ${poppins.className}`}
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
        <div className="middle-section my-20 md:my-10 flex flex-col">
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname === "/" && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
          >
            <GoHome fontSize={23} className="text-white md:mr-5" />
            <p className="hidden md:block">Home</p>
          </Link>
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname === "/dashboard" && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
          >
            <LuLayoutDashboard fontSize={23} className="text-white md:mr-5" />
            <p className="hidden md:block">Dashboard</p>
          </Link>
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname.includes("/video/") && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
            onClick={() => {
              setIsDown({ ...isDown, video: !isDown.video });
            }}
          >
            <div className="video-div flex items-center">
              <IoVideocamOutline fontSize={23} className="text-white mr-5" />
              <p className="hidden md:block">Videos</p>
            </div>
            {isDown.video ? (
              <FaAngleUp fontSize={16} className="text-white hidden md:block" />
            ) : (
              <FaAngleDown
                fontSize={16}
                className="text-white hidden md:block"
              />
            )}
          </Link>
          {isDown.video ? (
            <div className="hidden md:flex video-tools flex-col py-5 relative left-10 leading-10">
              <Link
                href="/"
                className={`${
                  pathname.includes("/image-to-motion")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Image to Motion
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Video Matting
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Video Caption
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Video Upscaler
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Video Re-talking
              </Link>
            </div>
          ) : null}
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname.includes("/image/") && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
            onClick={() => {
              setIsDown({ ...isDown, image: !isDown.image });
            }}
          >
            <div className="image-div flex items-center">
              <IoImageOutline fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Images</p>
            </div>
            {isDown.image ? (
              <FaAngleUp fontSize={16} className="text-white hidden md:block" />
            ) : (
              <FaAngleDown
                fontSize={16}
                className="text-white hidden md:block"
              />
            )}
          </Link>
          {isDown.image ? (
            <div className="hidden image-tools md:flex flex-col py-5 relative left-10 leading-10">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Image Generator
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Image Upscaler
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                AI Headshots
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                AI Avatar
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Generative Fill
              </Link>
            </div>
          ) : null}
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname.includes("/audio/") && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
            onClick={() => {
              setIsDown({ ...isDown, audio: !isDown.audio });
            }}
          >
            <div className="audio-div flex items-center">
              <PiWaveform fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Audios</p>
            </div>
            {isDown.audio ? (
              <FaAngleUp fontSize={16} className="text-white hidden md:block" />
            ) : (
              <FaAngleDown
                fontSize={16}
                className="text-white hidden md:block"
              />
            )}
          </Link>
          {isDown.audio ? (
            <div className="hidden image-tools md:flex flex-col py-5 relative left-10 leading-10">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Audio Enhancer
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-all"
              >
                Subtitle generator
              </Link>
            </div>
          ) : null}
          <Link
            href="/"
            className={`hover:bg-[#475FFF] ${
              pathname.includes("/collections") && "bg-[#475FFF]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all my-1`}
          >
            <div className="collection-div flex items-center">
              <GoFileDirectory fontSize={23} className="text-white mr-5" />
              <p className="hidden md:block"> My Collections</p>
            </div>
          </Link>
        </div>
        <div className="profile"></div>
      </div>
    </>
  );
}

export default Sidebar;
