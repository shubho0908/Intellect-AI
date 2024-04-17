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
  Input,
  Select,
  SelectItem,
  Switch,
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
  const [isSelected, setIsSelected] = useState(false);

  const professions = [
    "Designer",
    "Developer",
    "Freelancer",
    "Content Creator",
    "Musician",
    "Photographer",
    "Writer",
    "Others",
  ];

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
        placement="center"
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className={`${poppins.className} flex flex-col gap-1`}
              >
                Account Details
              </ModalHeader>
              <ModalBody>
                <div className="user-form mb-3">
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
                  <div className="form-body mt-5">
                    <div className="row-1 flex items-center justify-between">
                      <Input
                        key="outside"
                        type="text"
                        label="Username"
                        className={`${poppins.className} w-[250px]`}
                        labelPlacement="outside"
                        placeholder="Enter username"
                      />
                      <Input
                        key="outside"
                        type="email"
                        label="Email"
                        className={`${poppins.className} w-[250px]`}
                        labelPlacement="outside"
                        placeholder="Enter email"
                        isReadOnly
                        defaultValue="shubhobera98@gmail.com"
                      />
                    </div>
                    <div className="row-2 mt-6 flex items-center justify-between">
                      <Input
                        key="outside"
                        type="text"
                        label="First Name"
                        className={`${poppins.className} w-[250px]`}
                        labelPlacement="outside"
                        placeholder="Enter first name"
                      />
                      <Input
                        key="outside"
                        type="text"
                        label="Last Name"
                        className={`${poppins.className} w-[250px]`}
                        labelPlacement="outside"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="row-3 mt-6 flex items-center">
                      <Select
                        labelPlacement="outside"
                        label="Profession"
                        placeholder="Select profession"
                        className={`${poppins.className} w-[250px]`}
                      >
                        {professions?.map((profession) => (
                          <SelectItem
                            className={poppins.className}
                            key={profession}
                            value={profession}
                          >
                            {profession}
                          </SelectItem>
                        ))}
                      </Select>
                      <div
                        className={`${poppins.className} flex flex-col gap-2 ml-[1.8rem]`}
                      >
                        <p className="text-sm">Account type?</p>
                        <div className="flex items-center">
                          <Switch
                            isSelected={isSelected}
                            onValueChange={setIsSelected}
                          ></Switch>
                          <p className="text-small text-default-500">
                            {isSelected ? "Public" : "Private"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className={`${poppins.className} mb-2`}>
                <Button
                  color="default"
                  variant="ghost"
                  radius="full"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button color="primary" radius="full" onPress={onClose}>
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
