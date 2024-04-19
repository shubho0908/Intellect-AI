"use client";
import { Poppins } from "next/font/google";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IoBookmarkOutline } from "react-icons/io5";
import CreateProfile from "@/components/CreateProfile";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef, useState } from "react";
import Modal2 from "./image/image-generator/(components)/Modal2";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});
function Home() {
  const router = useRouter();
  const scrollableContentRef = useRef(null);
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const models = [
    {
      name: "Image Generator",
      desc: "Generate an image from text",
      url: "/image/image-generator",
    },
    {
      name: "Image Upscaler",
      desc: "Upscale an image",
      url: "/image/image-upscaler",
    },
    {
      name: "Ai Avatar",
      desc: "Generate an avatar",
      url: "/image/avatar",
    },
    {
      name: "Magic Expand",
      desc: "Expand an image",
      url: "/image/magic-expand",
    },
    {
      name: "Image2Motion",
      desc: "Transform an image to motion",
      url: "/video/image-to-motion",
    },
    {
      name: "Ai Captions",
      desc: "Generate captions for videos",
      url: "/video/video-caption",
    },
    {
      name: "Video Upscaler",
      desc: "Upscale a video",
      url: "/video/video-upscaler",
    },
  ];

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

  const newData = {
    img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    user: "Shubhojeet Bera",
    prompt:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum blanditiis odio corporis nulla debitis, harum, sint, voluptate culpa autem qui veritatis eius.",
  };

  return (
    <>
      <CreateProfile />
      <div className="home sm:mt-0 sm:ml-[120px] md:ml-[320px]">
        <div className="main-home m-4">
          <div className="top">
            <p className={`${litePoppins.className} text-2xl`}>Home</p>
            <div
              ref={scrollableContentRef}
              className="models-section scroll-smooth mt-6 flex items-center gap-4 flex-wrap scrollbar-hide"
            >
              {models?.map((data, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (user) {
                      router.push(data?.url);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Card className="col-span-12 sm:col-span-4 h-[150px] w-[300px] flex justify-center items-center">
                    <CardHeader
                      className={`${litePoppins.className} absolute z-10 flex-col items-center`}
                    >
                      <h4 className="text-white font-medium text-large">
                        {data?.name}
                      </h4>
                      <p className="text-white/60 text-sm">{data?.desc}</p>
                    </CardHeader>
                    <Image
                      removeWrapper
                      alt="Card background"
                      className="z-0 w-full h-full object-cover brightness-[.4]"
                      src="/upscale/output2.png"
                    />
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom mt-20">
            <p className={`${litePoppins.className} text-2xl`}>
              Recent Creations
            </p>
            <p className={`${litePoppins2.className} mt-2`}>
              See what others are making, discover prompts, and share your own
              creatives.
            </p>
            <div className="all-posts relative z-0 flex items-center gap-6 flex-wrap mt-5">
              {posts?.map((data, index) => {
                return (
                  <>
                    <div key={index} onClick={onOpen}>
                      <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[350px] w-[350px] relative group">
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
                            <p className={litePoppins.className}>
                              {data?.title}
                            </p>
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
