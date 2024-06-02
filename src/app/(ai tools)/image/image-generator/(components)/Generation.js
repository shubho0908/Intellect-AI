"use client";

import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import {
  Button,
  Textarea,
  Modal,
  ModalContent,
  ModalBody,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import Playground from "@/components/Playground";
import Modaal from "./Modaal";
import RelatedImages from "./RelatedImages";
import { RxUpload } from "react-icons/rx";
import { PiMagicWand } from "react-icons/pi";
import { prompts } from "@/others/Prompts";
import toast, { Toaster } from "react-hot-toast";
import { GoDownload } from "react-icons/go";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import Image from "next/image";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function page({ ModelData }) {
  const [modelData, setModelData] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [useAi, setUseAi] = useState(false);
  const [ratio, setRatio] = useState("1:1");
  const [totalImages, setTotalImages] = useState(4);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (ModelData !== null) {
      setModelData(ModelData);
    }
  }, [ModelData]);

  const successToast = (data) =>
    toast.success(data, {
      className: litePoppins.className,
    });

  const errorToast = (err) =>
    toast.error(`${err}`, {
      className: litePoppins.className,
    });

  const formattedDate = modelData
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(modelData && modelData[0]?.createdAt))
    : null;

  const generateHeightWidth = () => {
    const ratios = {
      "1:1": { height: 1024, width: 1024 },
      "4:5": { height: 1280, width: 1024 },
      "16:9": { height: 576, width: 1024 },
      "2:3": { height: 1536, width: 1024 },
    };
    return ratios[ratio];
  };

  const SelectPrompt = () => {
    const index = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[index].description);
  };

  const generateImage = async () => {
    try {
      onOpen();
      setIsBtnLoading(true);
      const { height, width } = generateHeightWidth();
      const response = await fetch("/api/images/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          height,
          width,
          numberOfOutputs: totalImages,
        }),
      });

      const { success, data, error } = await response.json();
      if (success) {
        setModelData(data);
        setIsBtnLoading(false);
        onClose();
      } else {
        errorToast(error);
        setIsBtnLoading(false);
        onClose();
      }
    } catch (error) {
      errorToast("An error occurred:", error.message);
      setIsBtnLoading(false);
      onClose();
    }
  };

  const publishImage = async () => {
    try {
      const response = await fetch("/api/images/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: modelData[0]?._id,
        }),
      });

      const { success, message, error } = await response.json();
      if (success && message === "Image published!") {
        successToast(message);
        setIsPublished(true);
      }
      if (error) {
        errorToast(error);
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  const downloadImage = async (img) => {
    const imageUrl = img;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "download.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      errorMsg(error.message);
    }
  };

  const allImages = [
    "https://replicate.delivery/pbxt/koQLfGV4o8yWGi4reeIvJQwCxmxrD3S7iQFGre8IfISrpnCTC/out-0.png",
    "https://replicate.delivery/pbxt/CHnlYaFyiezoOyC5RS6qHiK6rKpG3KME2e65dpzDFHtJBVYSA/out-0.png",
    "https://replicate.delivery/pbxt/mdSJbcSteRwevUIWG1nl5HIPg3DKTtieJxoLAf7JD5eXDpCTC/out-0.png",
    "https://replicate.delivery/pbxt/mgsk9Y7uzU4hCpoLn8kmeIdHVmdfz9b3DBR276mRd8ie4i2kA/out-0.png",
    "https://replicate.delivery/pbxt/zN4lsQv0j85WL9ix5WIFJ8ed8tIgdkg9jAVmUI1ie3L109DSA/out-0.png",
    "https://replicate.delivery/pbxt/JozcWrqHFpIAHdcswjPfWzU3arftr0HmWUWRT1DMJrxn89DSA/out-0.png",
    "https://replicate.delivery/pbxt/VHFfxS2zJYVMVy4Itjzw4ChNdQtEah9wkcUvyPDcPud72eDSA/out-0.png",
    "https://replicate.delivery/pbxt/C3TyPTuH1ALBBZ2IcgAcq7H8c2Ednsep2J14EmXyW3WhDnnIA/out-0.png",
  ];

  return (
    <>
      <Toaster />
      <div className="image-gen fadein flex items-start justify-between">
        <div className="left p-6 relative mt-0 ml-0 sm:ml-[120px] md:ml-[320px]">
          <div className="top ">
            <Modaal title="Generate Image" data={<Playground />} />

            <h1 className={`${poppins.className} w-fit text-2xl`}>
              Generate Image
            </h1>
            <div className="generated-image flex-wrap newXL:flex-nowrap py-6 flex items-start">
              <div className="left border-2 border-gray-800 p-4 rounded-lg">
                <Image
                  src={modelData !== null && modelData[0]?.url}
                  alt="image"
                  width={500}
                  height={500}
                  className="cursor-pointer z-[1]"
                />
              </div>
              <div
                className={`${litePoppins.className} right  py-4 w-[100%] newXL:w-3/4 newXL:px-8 newXL:py-0`}
              >
                <div className="prompt">
                  <p className="text-gray-400">Prompt</p>
                  <p className="mt-2">
                    {modelData && modelData[0]?.prompt.length >= 90
                      ? modelData && modelData[0]?.prompt.slice(0, 90) + "..."
                      : modelData && modelData[0]?.prompt}
                  </p>
                </div>
                <div className="buttons flex flex-wrap gap-4 items-end py-6">
                  <Button
                    color="primary"
                    variant="solid"
                    className="rounded-lg"
                    isDisabled={isPublished}
                    onClick={publishImage}
                  >
                    {!isPublished ? (
                      <>
                        <RxUpload
                          fontSize={21}
                          className="text-white xsm:block hidden"
                        />
                        Publish
                      </>
                    ) : (
                      <>
                        <MdOutlineFileDownloadDone
                          fontSize={21}
                          className="text-white xsm:block hidden"
                        />
                        Published
                      </>
                    )}
                  </Button>

                  <Button
                    color="primary"
                    variant="solid"
                    className="rounded-lg"
                    onClick={() =>
                      downloadImage(modelData && modelData[0]?.url)
                    }
                  >
                    <GoDownload
                      fontSize={21}
                      className="text-white xsm:block hidden"
                    />
                    Download
                  </Button>
                </div>

                <div className="more-details flex items-start gap-[3.8rem]">
                  <div className="left flex flex-col">
                    <div className="model">
                      <p className="text-gray-400">Model</p>
                      <div className="model-name flex items-center">
                        <PiMagicWand
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p>{modelData && modelData[0]?.miscData?.modelName}</p>
                      </div>
                    </div>

                    <div className="dimension mt-4">
                      <p className="text-gray-400">Resolution</p>
                      <p>{modelData && modelData[0]?.miscData?.dimensions}</p>
                    </div>

                    <div className="created mt-4">
                      <p className="text-gray-400">Created At</p>
                      <p>{formattedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom mt-4">
            <RelatedImages Data={modelData?.slice(1)} />
          </div>
        </div>
        <div
          className={`${litePoppins.className}  hidden xl2:block right h-[100vh] p-6 w-[450px]`}
        >
          <div className="playground fixed right-10 top-0 pt-[20px] pl-10 h-[100vh] border-l-2 border-gray-800">
            <div className="prompt">
              <p className="text-md sm:text-lg">Prompt</p>
              <Textarea
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your prompt here"
                className="ai-textarea w-full mt-4 scrollbar-hide"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {!useAi ? (
                <Button
                  color="primary"
                  className="w-full mt-3 text-md"
                  variant="shadow"
                  isDisabled={modelData === null}
                  onClick={() => {
                    setUseAi(true);
                    setTimeout(() => {
                      SelectPrompt();
                      setUseAi(false);
                    }, 3000);
                  }}
                >
                  Write with AI ✨
                </Button>
              ) : (
                <Button
                  color="primary"
                  isLoading
                  isDisabled={modelData === null}
                  className="w-full mt-3 text-md"
                >
                  Thinking...
                </Button>
              )}
            </div>
            <div className="ratio mt-10">
              <p className="text-md sm:text-lg">Image Ratio</p>
              <div className="all-ratios mt-5 bg-[#27272A] justify-between rounded-lg p-4 flex items-end">
                <div
                  onClick={() => setRatio("4:5")}
                  className={`four-by-five cursor-pointer rounded-lg h-[75px] w-[60px] bg-[#120f0f] ${
                    ratio === "4:5" ? "border-2 border-blue-500" : null
                  } flex items-center justify-center mr-2`}
                >
                  <p className="text-sm">4:5</p>
                </div>
                <div
                  onClick={() => setRatio("2:3")}
                  className={`two-by-three cursor-pointer rounded-lg h-[90px] w-[60px] bg-[#120f0f] ${
                    ratio === "2:3" ? "border-2 border-blue-500" : null
                  } flex items-center justify-center mr-2`}
                >
                  <p className="text-sm">2:3</p>
                </div>
                <div
                  onClick={() => setRatio("1:1")}
                  className={`one-by-one cursor-pointer rounded-lg h-[60px] w-[60px] bg-[#120f0f] flex items-center justify-center ${
                    ratio === "1:1" ? "border-2 border-blue-500" : null
                  } mr-2`}
                >
                  <p className="text-sm">1:1</p>
                </div>

                <div
                  onClick={() => setRatio("16:9")}
                  className={`sixteen-by-nine cursor-pointer rounded-lg h-[60px] w-[100px] bg-[#120f0f] ${
                    ratio === "16:9" ? "border-2 border-blue-500" : null
                  } flex items-center justify-center`}
                >
                  <p className="text-sm">16:9</p>
                </div>
              </div>
            </div>
            <div className="total-images mt-10">
              <p className="text-md sm:text-xl">Number of image</p>
              <div className="quantity flex items-center mt-3">
                <p
                  onClick={() => setTotalImages(1)}
                  className={`one ${
                    totalImages === 1 ? "border-2 border-blue-500" : null
                  } cursor-pointer py-2 px-6 bg-[#1D1E20] rounded-lg w-fit`}
                >
                  1
                </p>
                <p
                  onClick={() => setTotalImages(2)}
                  className={`two ${
                    totalImages === 2 ? "border-2 border-blue-500" : null
                  } cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit`}
                >
                  2
                </p>
                <p
                  onClick={() => setTotalImages(3)}
                  className={`three ${
                    totalImages === 3 ? "border-2 border-blue-500" : null
                  } cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit`}
                >
                  3
                </p>
                <p
                  onClick={() => setTotalImages(4)}
                  className={`four ${
                    totalImages === 4 ? "border-2 border-blue-500" : null
                  } cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit`}
                >
                  4
                </p>
              </div>
            </div>

            <Button
              onClick={generateImage}
              color="primary"
              isLoading={isBtnLoading}
              isDisabled={modelData === null}
              variant="solid"
              className="w-full mt-10 mb-5"
            >
              Generate Image
            </Button>
          </div>
        </div>
      </div>

      {/* Modal  */}
      <Modal
        backdrop="blur"
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        isDismissable={false}
        size="2xl"
        onClose={() => {
          onClose();
          setIsPublished(false);
        }}
        className={`${litePoppins.className} my-modal`}
      >
        <ModalContent className="modal-body">
          {(onClose) => (
            <>
              <ModalBody className="mb-5">
                <div className="creating-avatar fadein flex flex-col items-center w-full p-5">
                  <p className={`${litePoppins.className} text-xl`}>
                    Generating your image
                  </p>
                  <p className={`${litePoppins.className} mt-2 text-gray-400`}>
                    Please wait... this process may take a while.
                  </p>
                  <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md py-5"
                  />
                  <div
                    x-data="{}"
                    x-init="$nextTick(() => {
        let ul = $refs.logos;
        ul.insertAdjacentHTML('afterend', ul.outerHTML);
        ul.nextSibling.setAttribute('aria-hidden', 'true');
    })"
                    className="sm:w-[80%] w-full mt-6 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
                  >
                    <ul
                      x-ref="logos"
                      className="flex items-center justify-center md:justify-start [&_li]:mx-3 [&_img]:max-w-none animate-infinite-scroll"
                    >
                      {allImages?.map((image, index) => {
                        return (
                          <>
                            <li key={index}>
                              <Image
                                className="rounded-xl aspect-square object-cover pointer-events-none xsm:w-[100px] xl:w-[150px]"
                                src={image}
                                width={150}
                                height={150}
                              />
                            </li>
                          </>
                        );
                      })}
                    </ul>
                    <ul
                      className="flex items-center justify-center md:justify-start [&_li]:mx-3 [&_img]:max-w-none animate-infinite-scroll"
                      aria-hidden="true"
                    >
                      {allImages?.map((image, index) => {
                        return (
                          <>
                            <li key={index}>
                              <Image
                                className="rounded-xl aspect-square object-cover pointer-events-none xsm:w-[100px] xl:w-[150px]"
                                src={image}
                                width={150}
                                height={150}
                              />
                            </li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
