"use client";
import { Poppins } from "next/font/google";
import {
  Button,
  Chip,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import { useRef, useState } from "react";
import { PiFileImage } from "react-icons/pi";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});

function page() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadedIMG, setUploadedIMG] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ratio, setRatio] = useState(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      console.log(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="generative-fill fadein flex flex-col items-center sm:ml-[120px] md:ml-[330px] mr-0 sm:mr-4 p-4"
      >
        <div className="head mt-8 flex flex-col items-center">
          <Chip
            color="warning"
            variant="dot"
            className={`${litePoppins2.className} py-4 text-md px-2 bg-[#120f0f9a] shadow-xl`}
          >
            AI GENERATIVE FILL
          </Chip>
          <p
            className={`${litePoppins.className} mt-3 text-center text-[3.5rem]`}
          >
            <span className="bg-gradient-to-r from-blue-600 to-gray-300 text-transparent bg-clip-text font-bold">
              Intellect.AI's
            </span>{" "}
            Generative Fill for Images
          </p>
          <p
            className={`${litePoppins2.className} mt-3 text-lg w-3/4 text-center text-gray-300`}
          >
            Revolutionize your images with our app! Easily fill sections of your
            photos with stunning generative designs, ensuring seamless
            transformations for captivating visual content.
          </p>
        </div>
        <div className="bottom mt-14 w-[90%] flex items-center justify-between">
          <div className="left shadow-xl bg-gradient-to-r  from-blue-200 to-white w-[450px] leading-10 flex flex-col items-center rounded-2xl text-black">
            <div
              className={`${litePoppins.className} top p-10 border-b-2 border-dashed border-[#a9a9b2] w-full flex flex-col items-center`}
            >
              {!file ? (
                <Button
                  onClick={handleClick}
                  color="primary"
                  className={`${litePoppins.className} text-lg p-7 w-full shadow-lg shadow-[#0000002f]`}
                >
                  Choose Image
                </Button>
              ) : (
                <>
                  <div className="w-full flex flex-col items-center">
                    <div className="selected-file text-center mb-4 flex items-center">
                      <PiFileImage
                        fontSize={22}
                        className="text-green-800 mr-3"
                      />
                      <p className={`${litePoppins.className} text-green-800`}>
                        File selected:{" "}
                        {file.name.length > 12
                          ? `${file.name.slice(0, 12)}...${file.type.replace(
                              "image/",
                              ""
                            )}`
                          : `${file.name}.${file.type.replace("image/", "")}`}
                      </p>
                    </div>
                    <Button
                      onPress={() => {
                        onOpen();
                        setTimeout(() => {
                          setUploadedIMG("/generative/img1.jpg");
                        }, 4000);
                      }}
                      color="primary"
                      className={`${litePoppins.className} text-lg p-7 w-full shadow-lg shadow-[#0000002f]`}
                    >
                      Upload Image
                    </Button>
                  </div>
                </>
              )}
              <p className="relative top-3">or drag and drop an image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="bottom flex flex-col items-center p-5">
              <p className={`${litePoppins.className}`}>
                No image? try one of these:
              </p>
              <div className="all-imgs py-4 flex items-center gap-4">
                <Image
                  src="/generative/img1.jpg"
                  alt="img1"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
                <Image
                  src="/generative/img2.jpg"
                  alt="img2"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
                <Image
                  src="/generative/img3.jpg"
                  alt="img3"
                  width={80}
                  height={80}
                  className="aspect-square object-cover cursor-pointer shadow-lg shadow-[#0000003e]"
                />
              </div>
            </div>
          </div>
          <div className="right">
            <Image
              src="/generative/demo.png"
              alt="demo"
              width={550}
              height={550}
              className="aspect-square object-cover shadow-xl shadow-[#0000003e]"
            />
          </div>
        </div>
      </div>

      {/* Modal  */}

      <Modal
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        size={uploadedIMG ? "3xl" : "xl"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {!uploadedIMG && (
                  <>
                    <div className="upload-img fadein flex flex-col items-center w-full p-5">
                      <p className={`${litePoppins.className} text-xl`}>
                        Uploading your image
                      </p>
                      <p
                        className={`${litePoppins2.className} mt-2 text-gray-400`}
                      >
                        Please wait... this process may take a while.
                      </p>
                      <Progress
                        size="sm"
                        isIndeterminate
                        aria-label="Loading..."
                        className="max-w-md py-5"
                      />
                    </div>
                  </>
                )}
                {uploadedIMG && (
                  <>
                    <div className="gen-fill py-5 flex items-start justify-center">
                      <div className="left flex flex-col items-center">
                        <p>Original Image</p>
                        <Image
                          src={uploadedIMG}
                          alt="original"
                          className="aspect-square object-cover"
                          width={300}
                          height={300}
                        />
                      </div>
                      <div className="right">
                        <div className="top">
                          <p>Select Ratio</p>
                          <div className="all-ratios mt-5 bg-[#27272A] justify-between rounded-lg p-4 flex items-end">
                            <div
                              onClick={() => setRatio("4:5")}
                              className={`four-by-five cursor-pointer rounded-lg h-[75px] w-[60px] bg-[#120f0f] ${
                                ratio === "4:5"
                                  ? "border-2 border-blue-500"
                                  : null
                              } flex items-center justify-center mr-2`}
                            >
                              <p className="text-sm">4:5</p>
                            </div>
                            <div
                              onClick={() => setRatio("2:3")}
                              className={`two-by-three cursor-pointer rounded-lg h-[90px] w-[60px] bg-[#120f0f] ${
                                ratio === "2:3"
                                  ? "border-2 border-blue-500"
                                  : null
                              } flex items-center justify-center mr-2`}
                            >
                              <p className="text-sm">2:3</p>
                            </div>
                            <div
                              onClick={() => setRatio("1:1")}
                              className={`one-by-one cursor-pointer rounded-lg h-[60px] w-[60px] bg-[#120f0f] flex items-center justify-center ${
                                ratio === "1:1"
                                  ? "border-2 border-blue-500"
                                  : null
                              } mr-2`}
                            >
                              <p className="text-sm">1:1</p>
                            </div>

                            <div
                              onClick={() => setRatio("16:9")}
                              className={`sixteen-by-nine cursor-pointer rounded-lg h-[60px] w-[100px] bg-[#120f0f] ${
                                ratio === "16:9"
                                  ? "border-2 border-blue-500"
                                  : null
                              } flex items-center justify-center`}
                            >
                              <p className="text-sm">16:9</p>
                            </div>
                          </div>
                        </div>
                        <div className="bottom"></div>
                      </div>
                    </div>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
