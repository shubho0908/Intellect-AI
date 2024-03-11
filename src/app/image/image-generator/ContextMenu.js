import { GoDownload } from "react-icons/go";
import { MdOutlineBookmarkAdd, MdDeleteOutline } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});
const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function ContextMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="context-menu rounded-lg bg-[#18181b] py-3 px-2 leading-10">
        <div className="download cursor-pointer px-2 hover:bg-[#313132] rounded-lg transition-all flex items-center">
          <GoDownload fontSize={20} className="text-white mr-2" />
          <p>Download</p>
        </div>
        <div className="save cursor-pointer rounded-lg px-2 hover:bg-[#313132] transition-all flex items-center">
          <MdOutlineBookmarkAdd fontSize={20} className="text-white mr-2" />
          <p>Save to collection</p>
        </div>
        <div
          onClick={onOpen}
          className="delete cursor-pointer rounded-lg px-2 hover:bg-red-600 transition-all flex items-center"
        >
          <MdDeleteOutline fontSize={20} className="text-white mr-2" />
          <p>Delete</p>
        </div>
        <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader
                  className={`${poppins.className} flex flex-col gap-1`}
                >
                  Delete this image?
                </ModalHeader>
                <ModalBody>
                  <p className={`${litePoppins.className}`}>
                    Remember this action can't be undone. Do you really want to
                    delete this image?
                  </p>
                </ModalBody>
                <ModalFooter className={`${litePoppins.className}`}>
                  <Button
                    color="primary"
                    className="border-none"
                    variant="ghosted"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button color="danger" className="bg-red-600" onPress={onClose}>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default ContextMenu;
