"use client";

import { Poppins } from "next/font/google";
import { FaSquareXTwitter, FaWhatsapp } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Share({ id }) {
  const URL = "https://intellect-ai.vercel.app/post/" + id;
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

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

  const handleFBShare = async () => {
    return router.push(
      `https://www.facebook.com/dialog/share?app_id=87741124305&href=${URL}`
    );
  };

  const handleWPShare = async () => {
    return router.push(
      `https://api.whatsapp.com/send?text=Check%20out%20this%20amazing%20post:%20${URL}`
    );
  };

  const handleXShare = async () => {
    return router.push(
      `https://x.com/intent/tweet?text=Check%20out%20this%20amazing%20post:%20${URL}`
    );
  };

  const handleMailShare = async () => {
    return router.push(
      `mailto:?subject=Check%20out%20this%20amazing%20post&body=I%20thought%20you%20might%20find%20this%20post%20interesting:%20${URL}`
    );
  };

  return (
    <div>
      <div className="socials flex items-center gap-4 justify-between">
        <div
          className="wp cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleWPShare}
        >
          <FaWhatsapp fontSize={40} className="text-gray-300" />
        </div>
        <div
          className="fb cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleFBShare}
        >
          <FaFacebookSquare fontSize={40} className="text-gray-300" />
        </div>
        <div
          className="tw cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
          onClick={handleXShare}
        >
          <FaSquareXTwitter fontSize={40} className="text-gray-300" />
        </div>
        <div
          onClick={handleMailShare}
          className="mail cursor-pointer p-4 rounded-full bg-gray-700/30 w-fit"
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
