"use client";

import React from "react";
import { Button, Image } from "@nextui-org/react";
import { Poppins } from "next/font/google";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

function page() {
  return (
    <>
      <div className="avatar flex items-center justify-between mt-10 sm:ml-[120px] md:ml-[330px] mr-0 sm:mr-4 p-4">
        <div className="left ml-8">
          <p className={`${litePoppins.className} text-[3.4rem]`}>
            Create your AI Avatars using{" "}
            <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
              Intellect.AI
            </span>
          </p>
          <p className={`${litePoppins2.className} text-[1.2rem] mt-2 w-2/3`}>
            Unlock the power of artificial intelligence with Intellect.AI, your
            premier platform for creating personalized AI avatars.
          </p>
          <Button color="primary" className={`${litePoppins.className} p-8 rounded-xl text-lg mt-8`}>Create AI Avatars</Button>
        </div>
        <div className="right">
          <Image src="/avatar/demo.png" width={700} alt="Demo" />
        </div>
      </div>
    </>
  );
}

export default page;
