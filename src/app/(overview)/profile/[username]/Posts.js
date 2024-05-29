"use client";

import Modal2 from "@/app/(ai tools)/image/image-generator/(components)/Modal2";
import {
  Card,
  Modal,
  ModalBody,
  ModalContent,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Posts({ userPosts, userData, myData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imgData, setImgData] = useState(null);

  let formattedDate;
  if (imgData) {
    const date = new Date(imgData?.createdAt);

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    formattedDate = new Intl.DateTimeFormat("en-GB", options)?.format(date);
  }

  const modalData = {
    imgId: imgData?._id,
    userId: userData?._id,
    img: imgData?.url,
    name: userData?.name,
    prompt: imgData?.prompt,
    dimensions: imgData?.miscData?.dimensions,
    model: imgData?.miscData?.modelName,
    created: formattedDate,
    profile: userData?.profileImg,
  };

  if (
    (myData?._id !== userData?._id &&
      !userData?.follower?.includes(myData?._id) &&
      userPosts?.length > 0) ||
    !myData
  ) {
    const filteredPosts = userPosts?.filter(
      (data) => data?.visibility === true
    );

    if (filteredPosts?.length > 0) {
      return (
        <>
          <div className="all-posts relative z-0 flex items-center gap-6 flex-wrap">
            {filteredPosts?.map((data, index) => {
              return (
                <>
                  {data?.miscData?.modelName === "Instant ID" ||
                  data?.miscData?.modelName === "Stable Diffusion XL" ? (
                    <div
                      key={index}
                      onClick={() => {
                        onOpen();
                        setImgData(data);
                      }}
                    >
                      <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                        <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                          <div className="bottom px-4 absolute bottom-3">
                            <p
                              className={`${litePoppins.className} text-sm mt-2`}
                            >
                              "
                              {data?.prompt?.length > 50
                                ? data?.prompt?.slice(0, 50) + "..."
                                : data?.prompt}
                              "
                            </p>
                          </div>
                        </div>
                        <Image
                          removeWrapper
                          alt="Card background"
                          className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.4]"
                          src={data?.url}
                          width={250}
                          height={250}
                        />
                      </Card>
                    </div>
                  ) : null}
                </>
              );
            })}
          </div>
          <Modal
            backdrop="blur"
            isOpen={isOpen}
            size="4xl"
            onOpenChange={onOpenChange}
            className={`${litePoppins.className}`}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody className="mb-5">
                    <Modal2 data={modalData} />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      );
    }
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full">
          <Skeleton
            isLoaded={userData !== null}
            className={`rounded-lg ${!userData ? "w-full h-[250px]" : "w-fit"}`}
          >
            <div className="flex flex-col items-center">
              <Image
                src="/nothing.png"
                width={250}
                height={250}
                alt="No post"
              />
              <p className={`${litePoppins.className} text-gray-400`}>
                User don't have any posts.
              </p>
            </div>
          </Skeleton>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="all-posts relative z-0 flex items-center gap-6 flex-wrap">
        {userPosts?.map((data, index) => {
          return (
            <>
              {data?.miscData?.modelName === "Instant ID" ||
              data?.miscData?.modelName === "Stable Diffusion XL" ? (
                <div
                  key={index}
                  onClick={() => {
                    onOpen();
                    setImgData(data);
                  }}
                >
                  <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                    <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                      <div className="bottom px-4 absolute bottom-3">
                        <p className={`${litePoppins.className} text-sm mt-2`}>
                          "
                          {data?.prompt?.length > 50
                            ? data?.prompt?.slice(0, 50) + "..."
                            : data?.prompt}
                          "
                        </p>
                      </div>
                    </div>
                    <Image
                      removeWrapper
                      alt="Card background"
                      className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.4]"
                      src={data?.url}
                      width={250}
                      height={250}
                    />
                  </Card>
                </div>
              ) : null}
            </>
          );
        })}
      </div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
        className={`${litePoppins.className}`}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="mb-5">
                <Modal2 data={modalData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Posts;
