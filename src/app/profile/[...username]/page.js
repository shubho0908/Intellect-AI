"use client";
import { Avatar, Button, Card, Chip, Image } from "@nextui-org/react";
import React from "react";
import { MdVerified } from "react-icons/md";
import { Poppins } from "next/font/google";
import { FiEdit3 } from "react-icons/fi";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Profile({ params }) {
  const posts = [
    {
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      title: "The Future of AI is Here.",
      desc: "Here is the description of the post section, each will have individual description",
    },
    {
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      title: "The Future of AI is Here.",
      desc: "Here is the description of the post section, each will have individual description",
    },
    {
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      title: "The Future of AI is Here.",
      desc: "Here is the description of the post section, each will have individual description",
    },
    {
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      title: "The Future of AI is Here.",
      desc: "Here is the description of the post section, each will have individual description",
    },
    {
      img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      title: "The Future of AI is Here.",
      desc: "Here is the description of the post section, each will have individual description",
    },
  ];

  return (
    <>
      <div className="profile fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4">
        <div className="user-data">
          <div className="banner">
            <Button
              variant="flat"
              className={`${poppins.className} text-white mt-2 absolute right-6`}
              radius="full"
            >
              Edit cover
            </Button>
            <div class="bg-gradient-to-br from-pink-300 to-blue-400 h-[220px] w-full rounded-lg"></div>
          </div>
          <div className="user-details flex flex-col items-start w-full xl:w-[60%] relative left-4 xl:left-[14rem] bottom-[5.5rem]">
            <div className="dp flex items-end">
              <Avatar
                isBordered
                color="primary"
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                className="w-[10rem] h-[10rem] text-large"
              />
              <Button
                isIconOnly
                color="primary"
                className="rounded-full relative right-10"
                size="sm"
              >
                <FiEdit3 color="white" fontSize={15} />
              </Button>
            </div>
            <div className="data mt-6">
              <p
                className={`${poppins.className} text-xl flex items-center gap-2 cursor-pointer font-bold`}
              >
                Shubhojeet Bera
                <MdVerified className="text-blue-500" fontSize={22} />
              </p>
              <p className={`${poppins.className} text-gray-400`}>
                @{params?.username}
              </p>
              <div
                className={`${litePoppins.className} tags mt-3 flex items-center gap-3`}
              >
                <Chip color="default">💻 Software Developer</Chip>
              </div>
              <div className={`${litePoppins.className} summary mt-3`}>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                  non iure ipsa delectus minus facere molestiae cum quisquam,
                  dolor nemo.
                </p>
              </div>
              <div
                className={`${litePoppins.className} stats  flex items-center mt-3 gap-3`}
              >
                <div className="followers flex items-center gap-2">
                  <p className="font-bold text-gray-300">500</p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div className="following flex items-center gap-2">
                  <p className="font-bold text-gray-300">12</p>
                  <p className="text-gray-400">Following</p>
                </div>
              </div>
              <div className="user-posts mt-8">
                <div className="all-posts relative z-0 flex items-center gap-6 flex-wrap">
                  {posts?.map((data, index) => {
                    return (
                      <>
                        <div key={index}>
                          <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                            <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                              <div className="bottom px-4 absolute bottom-3">
                                <p className={litePoppins.className}>
                                  {data?.title}
                                </p>
                                <p
                                  className={`${litePoppins.className} text-sm mt-2`}
                                >
                                  "{data?.desc}"
                                </p>
                              </div>
                            </div>
                            <Image
                              removeWrapper
                              alt="Card background"
                              className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.2]"
                              src={data?.img}
                            />
                          </Card>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content"></div>
      </div>
    </>
  );
}

export default Profile;
