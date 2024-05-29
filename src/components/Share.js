"use client";

import { Poppins } from "next/font/google";
import { FaSquareXTwitter, FaWhatsapp } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import toast from "react-hot-toast";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Share({ id }) {
  const URL = "http://localhost:3000/post/" + id;
  const [isCopied, setIsCopied] = useState(false);

  //Toasts
  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${poppins.className} text-sm`,
    });

  const copyToClipboard = () => {
    setIsCopied(true);
    successMsg("Copied to clipboard");
    navigator.clipboard.writeText(URL);
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  const handleShare = async () => {
    const shareData = {
      title: "Check out this post",
      text: "Here is an interesting post I found",
      url: URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Web Share API not supported in this browser");
    }
  };

  return (
    <div>
      <div className="socials flex items-center gap-4 justify-between">
        <div
          className="wp cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleShare}
        >
          <FaWhatsapp fontSize={40} className="text-gray-300" />
        </div>
        <div
          className="fb cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleShare}
        >
          <FaFacebookSquare fontSize={40} className="text-gray-300" />
        </div>
        <div
          className="tw cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleShare}
        >
          <FaSquareXTwitter fontSize={40} className="text-gray-300" />
        </div>
        <div
          className="mail cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleShare}
        >
          <IoIosMail fontSize={40} className="text-gray-300" />
        </div>
      </div>
      <div className="link mt-6">
        <p>Page Link</p>
        <Input
          type="text"
          isReadOnly
          className={`mt-3 ${
            isCopied ? "border-2 border-blue-600 rounded-xl" : ""
          } cursor-pointer`}
          value={URL && URL.length > 40 ? URL?.slice(0, 40) + "..." : URL}
          labelPlacement="outside"
          onClick={copyToClipboard}
          endContent={
            isCopied ? (
              <LuCopyCheck
                onClick={copyToClipboard}
                className="text-2xl cursor-pointer text-default-400 flex-shrink-0"
              />
            ) : (
              <LuCopy
                onClick={copyToClipboard}
                className="text-2xl cursor-pointer text-default-400 pointer-events-none flex-shrink-0"
              />
            )
          }
        />
      </div>
    </div>
  );
}

export default Share;
