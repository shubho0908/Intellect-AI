"use client";

import React from "react";
import { Image, Card, Chip } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import Modaal from "./Modaal";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

function page() {
  const styles = [
    {
      url: "/avatar/gym.jpg",
      alt: "Fitness",
      title: "Fitness Freak Style",
      description: "Energetic, health-conscious, and stylish.",
    },
    {
      url: "/avatar/corporate.jpg",
      alt: "Professional",
      title: "Professional Style",
      description: "Polished, sophisticated, and elegant.",
    },
    {
      url: "/avatar/magic.jpg",
      alt: "Fictional",
      title: "Fictional Style",
      description: "Imaginative, creative, and whimsical.",
    },
    {
      url: "/avatar/cyberpunk.jpg",
      alt: "Gaming",
      title: "Cyberpunk Style",
      description: "Futuristic, edgy, and tech-savvy.",
    },
    {
      url: "/avatar/tradition.jpg",
      alt: "Traditional",
      title: "Traditional Style",
      description: "Classic, and sophisticated attire.",
    },
  ];

  return (
    <>
      <div className="avatar fadein flex flex-col items-center sm:ml-[120px] md:ml-[330px] mr-0 sm:mr-4 p-4">
        <div className="top flex items-center justify-between mt-10">
          <div className="left ml-8">
            <Chip
              color="warning"
              variant="dot"
              className={`${litePoppins2.className} py-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
            >
              AI AVATAR GENERATOR
            </Chip>

            <p className={`${litePoppins.className} text-[3.4rem]`}>
              Create your AI Avatars using{" "}
              <span className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold">
                Intellect.AI
              </span>
            </p>
            <p className={`${litePoppins2.className} text-[1.2rem] mt-2 w-2/3`}>
              Unlock the power of artificial intelligence with Intellect.AI,
              your premier platform for creating personalized AI avatars.
            </p>
            <Modaal />
          </div>
          <div className="right">
            <Image
              src="/avatar/demo.png"
              className="z-[2]"
              width={700}
              alt="Demo"
            />
          </div>
        </div>
        <div className="bottom flex flex-col items-center mt-24">
          <p className={`${litePoppins.className} text-[2.5rem] mt-2`}>
            Generate{" "}
            <span className="bg-gradient-to-r font-bold from-gray-300 to-blue-600 text-transparent bg-clip-text">
              AI Avatars
            </span>{" "}
            of different styles
          </p>
          <p
            className={`${litePoppins2.className} text-center text-lg mt-2 w-3/4`}
          >
            Dive into a world of endless possibilities and create avatars that
            truly represent you in style. From realistic to whimsical, our tool
            lets you craft avatars that stand out from the crowd.
          </p>
          <div className="styles mt-14 flex gap-6 justify-center flex-wrap items-center">
            {styles &&
              styles.map((img, index) => {
                return (
                  <>
                    <Card
                      key={index}
                      isFooterBlurred
                      radius="lg"
                      className="border-none"
                    >
                      <Image
                        isZoomed
                        alt={img.alt}
                        src={img.url}
                        className="object-cover cursor-pointer z-[2] aspect-square"
                        width={400}
                        height={400}
                      />
                      <div className="data flex flex-col items-start w-full bg-[#13195951] backdrop-blur-xl absolute bottom-0 z-[3] rounded-t-none rounded-lg p-4">
                        <p
                          className={`${litePoppins.className} text-white text-lg`}
                        >
                          {img.title}
                        </p>
                        <p className={`${litePoppins2.className} text-white`}>
                          {img.description}
                        </p>
                      </div>
                    </Card>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
