"use client";

import Modal2 from "@/app/image/image-generator/(components)/Modal2";
import {
  Card,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Posts() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      <div className="all-posts relative z-0 flex items-center gap-6 flex-wrap">
        {posts?.map((data, index) => {
          return (
            <>
              <div key={index} onClick={onOpen}>
                <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                  <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                    <div className="bottom px-4 absolute bottom-3">
                      <p className={`${litePoppins.className} text-md mt-2`}>
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
                <Modal2 data={newData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Posts;
