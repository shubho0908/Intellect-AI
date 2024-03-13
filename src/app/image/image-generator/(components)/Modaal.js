"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { IoAdd } from "react-icons/io5";

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Modaal({ data, title }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  const backdrops = "blur";

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          color="primary"
          onPress={() => handleOpen(backdrops)}
          className={`${litePoppins.className} flex xl2:hidden mb-6`}
        >
          <IoAdd fontSize={22} className="text-white" /> New Prompt
        </Button>
      </div>
      <Modal
        backdrop={backdrop}
        isOpen={isOpen}
        onClose={onClose}
        className={litePoppins.className}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b-2 border-gray-800">{title}</ModalHeader>
              <ModalBody className="mt-4">{data}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Modaal;
