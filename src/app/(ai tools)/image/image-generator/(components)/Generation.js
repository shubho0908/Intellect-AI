"use client";

import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Textarea,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import Playground from "@/components/Playground";
import Modaal from "./Modaal";
import RelatedImages from "./RelatedImages";
import { RxUpload } from "react-icons/rx";
import { PiMagicWand } from "react-icons/pi";
import { prompts } from "@/others/Prompts";
import Menu from "./Menu";

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
  const [value, setValue] = useState(new Set([]));

  useEffect(() => {
    if (ModelData !== null) {
      setModelData(ModelData);
    }
  }, [ModelData]);

  const formattedDate = modelData
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(modelData?.createdAt))
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
      setModelData(null);
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
          model: value === "Sdxl-lightning" ? "Sdxl" : "dreamshaper",
        }),
      });

      const { success, data, error } = await response.json();
      if (success) {
        setModelData(data);
        setIsBtnLoading(false);
      } else {
        console.error(error);
        setIsBtnLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setIsBtnLoading(false);
    }
  };

  const models = [
    {
      value: "Dreamshaper-xl-turbo",
      label: "Dreamshaper-xl-turbo",
    },
    {
      value: "Sdxl-lightning",
      label: "Sdxl-lightning",
    },
  ];

  return (
    <>
      <div className="image-gen flex items-start justify-between">
        <div className="left p-6 relative mt-0 ml-0 sm:ml-[120px] md:ml-[320px]">
          <div className="top ">
            <Modaal title="Generate Image" data={<Playground />} />

            <Skeleton
              isLoaded={modelData !== null}
              className="rounded-lg w-fit"
            >
              <h1 className={`${poppins.className} w-fit text-2xl`}>
                Generate Image
              </h1>
            </Skeleton>
            <div className="generated-image flex-wrap newXL:flex-nowrap py-6 flex items-start">
              <div className="left border-2 border-gray-800 p-4 rounded-lg">
                <Menu />
                <Skeleton isLoaded={modelData !== null} className="rounded-lg">
                  <Image
                    isZoomed
                    src={modelData?.urls[0]}
                    alt="image"
                    width={500}
                    height={500}
                    className="cursor-pointer z-[1]"
                  />
                </Skeleton>
              </div>
              <div
                className={`${litePoppins.className} right  py-4 w-[100%] newXL:w-3/4 newXL:px-8 newXL:py-0`}
              >
                <Skeleton isLoaded={modelData !== null} className="rounded-lg">
                  <div className="prompt">
                    <p className="text-gray-400">Prompt</p>
                    <p className="mt-2">
                      {modelData?.prompt.length >= 90
                        ? modelData?.prompt.slice(0, 90) + "..."
                        : modelData?.prompt}
                    </p>
                  </div>
                </Skeleton>
                <div className="buttons flex flex-wrap gap-4 items-end py-6">
                  <Skeleton
                    isLoaded={modelData !== null}
                    className="rounded-lg mt-2 mb-2 w-fit"
                  >
                    <Button
                      color="primary"
                      variant="solid"
                      className="rounded-lg"
                    >
                      <RxUpload
                        fontSize={21}
                        className="text-white xsm:block hidden"
                      />
                      Publish
                    </Button>
                  </Skeleton>
                  <Skeleton
                    isLoaded={modelData !== null}
                    className="rounded-lg mt-2 mb-2 w-fit"
                  >
                    <Button
                      color="danger"
                      variant="solid"
                      className="rounded-lg bg-red-600"
                    >
                      <MdDeleteOutline fontSize={22} className="text-white" />
                      Delete
                    </Button>
                  </Skeleton>
                </div>

                <div className="more-details">
                  <Skeleton
                    isLoaded={modelData !== null}
                    className="rounded-lg mt-2 mb-2"
                  >
                    <div className="model">
                      <p className="text-gray-400">Model</p>
                      <div className="model-name flex items-center">
                        <PiMagicWand
                          fontSize={22}
                          className="text-white mr-2"
                        />
                        <p>{modelData?.miscData?.modelName}</p>
                      </div>
                    </div>
                  </Skeleton>
                  <Skeleton
                    isLoaded={modelData !== null}
                    className="rounded-lg mt-2 mb-2"
                  >
                    <div className="dimension mt-4">
                      <p className="text-gray-400">Resolution</p>
                      <p>{modelData?.miscData?.dimensions}</p>
                    </div>
                  </Skeleton>
                  <Skeleton
                    isLoaded={modelData !== null}
                    className="rounded-lg mt-2 mb-2"
                  >
                    <div className="created mt-4">
                      <p className="text-gray-400">Created At</p>
                      <p>{formattedDate}</p>
                    </div>
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom mt-4">
            <RelatedImages Data={modelData} />
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
            <div className="choose-model mt-10">
              <Select
                items={models}
                label="Select Model"
                defaultSelectedKeys={["Sdxl-lightning"]}
                selectedKeys={value}
                onSelectionChange={setValue}
              >
                {(model) => (
                  <SelectItem
                    className={litePoppins.className}
                    key={model.value}
                    value={model.value}
                  >
                    {model.label}
                  </SelectItem>
                )}
              </Select>
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
    </>
  );
}

export default page;
