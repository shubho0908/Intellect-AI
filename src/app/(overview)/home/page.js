"use client";
import { Poppins } from "next/font/google";
import {
  Avatar,
  Button,
  Card,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { IoBookmarkOutline } from "react-icons/io5";
import { useState } from "react";
import Modal2 from "@/app/(ai tools)/image/image-generator/(components)/Modal2";

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

  return (
    <>
      <div className="home sm:mt-0 sm:ml-[120px] md:ml-[320px] mb-14">
        <div className="main-home m-4">
          <div className="mt-10">
            <p className={`${litePoppins.className} text-2xl`}>
              Recent Creations
            </p>
            <p className={`${litePoppins2.className} mt-2`}>
              See what others are making, discover prompts, and share your own
              creatives.
            </p>
            <div className="all-posts relative z-0 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-4 mt-8">
              {posts?.map((data, index) => {
                return (
                  <>
                    <div key={index} onClick={onOpen}>
                      <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                        <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                          <div className="flex top items-center justify-between w-full px-4">
                            <div className="flex items-center gap-4">
                              <Avatar
                                size="md"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                                className="z-0"
                              />
                              <p
                                className={`${litePoppins.className} text-white font-medium`}
                              >
                                Shubho0908
                              </p>
                            </div>
                            <Button
                              isIconOnly
                              variant="ghost"
                              className="border-none"
                            >
                              <IoBookmarkOutline
                                className="text-white"
                                fontSize={26}
                              />
                            </Button>
                          </div>
                          <div className="bottom px-4 absolute bottom-3">
                            <p
                              className={`${litePoppins2.className} text-sm mt-2`}
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
                <Modal2 data={newData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;
