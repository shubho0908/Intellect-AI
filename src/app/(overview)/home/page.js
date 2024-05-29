"use client";
import { Poppins } from "next/font/google";
import {
  Avatar,
  Card,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Modal2 from "@/app/(ai tools)/image/image-generator/(components)/Modal2";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});
function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [homeData, setHomeData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const getHomeData = async () => {
    try {
      const response = await fetch("/api/home", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const { success, data, error } = await response.json();
      if (success) {
        setHomeData(data);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  const handleCardClick = (data) => {
    let formattedDate;
    if (data) {
      const date = new Date(data?.createdAt);

      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      formattedDate = new Intl.DateTimeFormat("en-GB", options)?.format(date);
    }

    const newData = {
      img: data?.url,
      imgId: data?._id,
      userId: data?.userId?._id,
      name: data?.userId?.name,
      prompt: data?.prompt,
      dimensions: data?.miscData?.dimensions,
      created: formattedDate,
      model: data?.miscData?.modelName,
      profile: data?.userId?.profileImg,
      username: data?.userId?.username,
      followers: data?.userId?.followers,
      following: data?.userId?.following,
    };

    setSelectedData(newData);
    onOpen();
  };

  function getTimeSince(timestamp) {
    const now = new Date();
    const createdDate = new Date(timestamp);

    const seconds = Math.floor((now - createdDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return "just now";
    } else if (minutes < 60) {
      return `${minutes} min${minutes === 1 ? "" : "s"}`;
    } else if (hours < 24) {
      return `${hours} h`;
    } else if (days < 7) {
      return `${days} d`;
    } else if (weeks < 4) {
      return `${weeks} w`;
    } else if (months < 12) {
      return `${months} m`;
    } else {
      return `${years} y`;
    }
  }

  return (
    <>
      <Toaster />
      <div className="home fadein sm:mt-0 sm:ml-[120px] md:ml-[320px] mb-14">
        <div className="main-home m-4">
          <div className="mt-10">
            <p className={`${litePoppins.className} text-2xl`}>
              Recent Creations
            </p>
            <p className={`${litePoppins2.className} mt-2`}>
              See what others are making, discover prompts, and share your own
              creatives.
            </p>
            <div className="all-posts relative z-0 flex items-start flex-wrap gap-5 mt-8">
              {homeData?.reverse()?.map((data, index) => {
                const formattedDate = getTimeSince(data?.createdAt);
                return (
                  <>
                    <div
                      key={index}
                      onClick={() => {
                        handleCardClick(data);
                      }}
                    >
                      <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[270px] w-[270px] relative group">
                        <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                          <div className="flex top items-center justify-between w-full px-4">
                            <div className="flex items-center gap-4">
                              <Avatar
                                size="md"
                                src={data?.userId?.profileImg}
                                className="z-0"
                              />
                              <p
                                className={`${litePoppins.className} text-white font-medium`}
                              >
                                {data?.userId?.username?.length > 10
                                  ? `${data?.userId?.username.slice(0, 10)}...`
                                  : data?.userId?.username}
                              </p>
                            </div>
                            {/* <Button
                              isIconOnly
                              variant="ghost"
                              className="border-none"
                            >
                              <IoBookmarkOutline
                                className="text-white"
                                fontSize={26}
                              />
                            </Button> */}
                            <p
                              className={`${litePoppins2.className} text-sm text-white`}
                            >
                              {formattedDate}
                            </p>
                          </div>
                          <div className="bottom px-4 absolute bottom-3">
                            <p
                              className={`${litePoppins2.className} text-sm mt-2`}
                            >
                              "
                              {data?.prompt.length > 50
                                ? data?.prompt?.slice(0, 50) + "..."
                                : data?.prompt}
                              "
                            </p>
                          </div>
                        </div>
                        <Image
                          removeWrapper
                          alt="Card background"
                          width={350}
                          height={350}
                          className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.2]"
                          src={data?.url}
                        />
                      </Card>
                    </div>
                  </>
                );
              })}

              {homeData && !homeData.length > 0 && (
                <>
                  <div className="w-full flex flex-col items-center justify-center mt-14">
                    <Image
                      src="/empty-home.png"
                      width={350}
                      height={350}
                      alt="empty"
                    />
                    <p
                      className={`${litePoppins.className} mt-2 text-xl w-2/3 text-center`}
                    >
                      No creations yet!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal  */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
        className={`${litePoppins.className} my-modal`}
      >
        <ModalContent className="modal-body">
          {(onClose) => (
            <>
              <ModalBody className="mb-5">
                <Modal2 data={selectedData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;
