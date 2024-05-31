"use client";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { GoHome, GoFileDirectory } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  IoVideocamOutline,
  IoImageOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { FiMinusCircle } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Search from "./Search";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Sidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDown, setIsDown] = useState({
    image: false,
    video: false,
  });
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const router = useRouter();

  //Toasts
  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${poppins.className} text-sm`,
    });

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${poppins.className} text-sm`,
    });

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data, error } = await response.json();
      if (success) {
        setUser(data);
      }
      if (error === "Missing refresh token") {
        setUser("invalid");
      }
    } catch (error) {
      errorMsg(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const Logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success } = await response.json();
      if (success) {
        successMsg("Logged out successfully");
        router.push("/login");
      } else {
        errorMsg("Something went wrong");
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      <Toaster />
      <div
        className={`sidebar-wrapper h-[100vh] shadow-xl bg-[#120f0f70] border-gray-800 border-r-2 backdrop-blur-xl z-[21] fixed overflow-auto scrollbar-hide`}
      >
        <div
          className={`sidebar z-[21] flex flex-col w-fit p-6 md:px-10 ${poppins.className}`}
        >
          <div className="logo-section hidden md:block">
            <Link href="/home">
              <Image src="/logo1.PNG" width={220} height={220} alt="Logo" />
            </Link>
          </div>
          <div className="logo-section block md:hidden">
            <Link href="/home">
              <Image src="/logo2.PNG" width={50} height={50} alt="Logo" />
            </Link>
          </div>
          <Link
            href={user !== "invalid" ? `/profile/${user?.username}` : "/signup"}
            prefetch={false}
          >
            <div className="flex mt-6 cursor-pointer bg-gray-700/40 hover:bg-gray-700/80 transition-all px-6 py-3 rounded-xl items-center justify-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  as="button"
                  className="transition-transform relative cursor-pointer"
                  src={user?.profileImg}
                />
              </div>
              {user !== "invalid" && (
                <Skeleton isLoaded={user} className="rounded-lg min-w-[100px]">
                  <div className="data">
                    <p>
                      {user?.name?.length > 10
                        ? `${user?.name.slice(0, 10)}...`
                        : user?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      @
                      {user?.username?.length > 10
                        ? `${user?.username.slice(0, 10)}...`
                        : user?.username}
                    </p>
                  </div>
                </Skeleton>
              )}
              {user === "invalid" && <p>Signup</p>}
            </div>
          </Link>

          <div className="middle-section my-20 md:my-6 flex flex-col">
            <p className="mt-3 mb-2 text-sm font-semibold text-gray-400">
              OVERVIEW
            </p>
            <Link
              prefetch={false}
              href="/home"
              className={`hover:bg-[#0266D9] ${
                pathname === "/home" && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
            >
              <GoHome fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Home</p>
            </Link>
            <div
              onClick={onOpen}
              className={`hover:bg-[#0266D9] p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1 cursor-pointer`}
            >
              <IoSearchOutline fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Search</p>
            </div>
            <Link
              href="/dashboard"
              prefetch={false}
              className={`hover:bg-[#0266D9] ${
                pathname === "/dashboard" && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all flex items-center my-1`}
            >
              <LuLayoutDashboard fontSize={23} className="text-white md:mr-5" />
              <p className="hidden md:block">Dashboard</p>
            </Link>
            <Link
              href="/collections"
              prefetch={false}
              className={`hover:bg-[#0266D9] cursor-pointer ${
                pathname.includes("/collections") && "bg-[#0266D9]"
              } p-3 w-fit md:w-full md:py-3 md:px-6 rounded-lg transition-all my-1`}
            >
              <div className="collection-div flex items-center">
                <GoFileDirectory fontSize={23} className="text-white md:mr-5" />
                <p className="hidden md:block"> My Collections</p>
              </div>
            </Link>
            <p className="mt-6 mb-2 text-sm font-semibold text-gray-400">
              AI TOOLS
            </p>
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
                  prefetch={false}
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
                  prefetch={false}
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
                  prefetch={false}
                  className={`${
                    pathname.includes("/avatar")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  AI Avatar Creator
                </Link>
                <Link
                  prefetch={false}
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
                  prefetch={false}
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
                  prefetch={false}
                  className={`${
                    pathname.includes("/video-caption")
                      ? "text-white"
                      : "text-gray-400"
                  }  hover:text-white transition-all`}
                >
                  Video Caption
                </Link>
                <Link
                  prefetch={false}
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
          <Button
            onClick={Logout}
            variant="ghost"
            isDisabled={!user || user === "invalid"}
            className="justify-start text-md p-6 border-none"
          >
            <FiMinusCircle fontSize={23} className="text-white mr-5" />
            <p>Log out</p>
          </Button>
        </div>
      </div>

      {/* Modal  */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        isDismissable={false}
        placement="top"
        size="2xl"
        onOpenChange={onOpenChange}
        className={`${poppins.className} my-modal`}
      >
        <ModalContent className="modal-body">
          {(onClose) => (
            <>
              <ModalBody>
                <Search close={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Sidebar;
