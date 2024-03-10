"use client";

import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Avatar,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useState } from "react";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});
const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function RelatedImages() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");
  const [context, setContext] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const backdrops = "blur";
  const Images = [
    "https://replicate.delivery/pbxt/MkUfpm9XsUXmTSWf4r37w4rpTmXHWlaMKBoO5ElqN9XWbRbSA/out-0.png",
    "https://replicate.delivery/pbxt/R08KPL023tIKO59jt3UnbVYfBIWio8A5b6fz60OL4qLkXRbSA/out-0.png",
    "https://replicate.delivery/pbxt/mgsk9Y7uzU4hCpoLn8kmeIdHVmdfz9b3DBR276mRd8ie4i2kA/out-0.png",
  ];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
  };

  return (
    <>
      <div className="related-images">
        <p className={`${poppins.className} text-2xl`}>Related Images</p>
        <div className="images flex items-center justify-start flex-wrap mt-8 gap-4">
          <div className="flex flex-wrap gap-3">
            {Images?.map((image) => (
              <Image
                isZoomed
                src={image}
                alt="image"
                width={350}
                height={350}
                onClick={() => {
                  handleOpen(backdrops);
                  setContext(image);
                }}
                className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
              />
            ))}
          </div>
          <Modal
            backdrop={backdrop}
            isOpen={isOpen}
            size="3xl"
            onClose={onClose}
            className={litePoppins.className}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
                  <ModalBody className="mb-5">
                    <div className="modal-body flex items-start">
                      <div className="left">
                        {context && (
                          //   <Image
                          //     isBlurred
                          //     src={context}
                          //     alt="image"
                          //     width={500}
                          //     height={500}
                          //     className="cursor-pointer z-[1]"
                          //   />
                          <img
                            src={context}
                            alt="image"
                            className="w-[400px] rounded-xl cursor-pointer z-[1]"
                          />
                        )}
                      </div>
                      <div className="right ml-8">
                        <div className="user-data flex items-center">
                          <Avatar
                            color="primary"
                            className="cursor-pointer"
                            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                          />
                          <p className="w-max ml-2">Shubhojeet Bera</p>
                          {!isFollowed ? (
                            <Button
                              color="primary"
                              className="rounded-full ml-4"
                              onPress={() => setIsFollowed(true)}
                            >
                              Follow
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              variant="bordered"
                              className="rounded-full ml-4 border-gray-600 text-white"
                              onPress={() => setIsFollowed(false)}
                            >
                              Unfollow
                            </Button>
                          )}
                        </div>
                        <div className="prompt"></div>
                        <div className="more-details"></div>
                      </div>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default RelatedImages;
