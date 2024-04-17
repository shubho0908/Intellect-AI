"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { FiEdit3 } from "react-icons/fi";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function CreateProfile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, isUser] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        onOpen();
      }
    }, 1000);
  }, [user]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="blur"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Account Details
              </ModalHeader>
              <ModalBody>
                <div className="user-form">
                  <div className="profile flex items-center gap-8">
                    <div className="dp flex items-end">
                      <Avatar
                        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                        className="w-20 h-20 text-large"
                      />
                      <Button
                        isIconOnly
                        color="primary"
                        className="rounded-full absolute left-[5.35rem]"
                        size="sm"
                      >
                        <FiEdit3 color="white" fontSize={15} />
                      </Button>
                    </div>
                    <div>
                      <p
                        className={`${poppins.className} text-lg font-semibold`}
                      >
                        Shubhojeet Bera
                      </p>
                      <p className={`${poppins.className} text-gray-400`}>
                        @shubhobera
                      </p>
                    </div>
                  </div>
                  <p className={`${poppins.className} text-gray-400 my-4`}>
                    The photo will be used for your profile, and will be visible
                    to other users of the platform.
                  </p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
