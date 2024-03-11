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
        className={`sidebar border-r-2 z-[5] border-gray-800 fixed overflow-auto bg-[#120f0f] backdrop-blur-sm flex flex-col w-fit ${
          isDown.video && isDown.image && isDown.audio ? "h-full" : "h-[100vh]"
        } p-6 md:px-10 ${poppins.className}`}
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
          <div
            className={`hover:bg-[#0266D9] cursor-pointer ${
              pathname.includes("/video/") && "bg-[#0266D9]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
            onClick={() => {
              setIsDown({ ...isDown, video: !isDown.video });
            }}
          >
            <div className="video-div flex items-center">
              <IoVideocamOutline fontSize={23} className="text-white md:mr-5" />
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
          </div>
          {isDown.video ? (
            <div className="hidden py-2 md:flex video-tools flex-col relative left-10 leading-10">
              <Link
                href="/video/image-to-motion"
                className={`${
                  pathname.includes("/image-to-motion")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Image to Motion
              </Link>
              <Link
                href="/video/video-matting"
                className={`${
                  pathname.includes("/video-matting")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Video Matting
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
              <Link
                href="/video/video-dubbing"
                className={`${
                  pathname.includes("/video-dubbing")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Video Re-talking
              </Link>
            </div>
          ) : null}
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
              <FaAngleUp fontSize={16} className="text-white hidden md:block" />
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
                href="/image/headshots"
                className={`${
                  pathname.includes("/headshots")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                AI Headshots
              </Link>
              <Link
                href="/image/avatar"
                className={`${
                  pathname.includes("/avatar") ? "text-white" : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                AI Avatar
              </Link>
              <Link
                href="/image/generative-fill"
                className={`${
                  pathname.includes("/generative-fill")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Generative Fill
              </Link>
            </div>
          ) : null}
          <div
            className={`hover:bg-[#0266D9] cursor-pointer ${
              pathname.includes("/audio/") && "bg-[#0266D9]"
            } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center justify-between my-1`}
            onClick={() => {
              setIsDown({ ...isDown, audio: !isDown.audio });
            }}
          >
            <div className="audio-div flex items-center">
              <PiWaveform fontSize={23} className="text-white md:mr-5" />
              <p className="hidden cursor-pointer md:block">Audios</p>
            </div>
            {isDown.audio ? (
              <FaAngleUp fontSize={16} className="text-white hidden md:block" />
            ) : (
              <FaAngleDown
                fontSize={16}
                className="text-white hidden md:block"
              />
            )}
          </div>
          {isDown.audio ? (
            <div className="hidden py-2 image-tools md:flex flex-col relative left-10 leading-10">
              <Link
                href="/audio/audio-enhancer"
                className={`${
                  pathname.includes("/audio-enhancer")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Audio Enhancer
              </Link>
              <Link
                href="/audio/audio-subtitle"
                className={`${
                  pathname.includes("/audio-subtitle")
                    ? "text-white"
                    : "text-gray-400"
                }  hover:text-white transition-all`}
              >
                Subtitle generator
              </Link>
            </div>
          ) : null}
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
        </div>
        <div className="profile"></div>
      </div>
    </>
  );
}

export default Sidebar;
