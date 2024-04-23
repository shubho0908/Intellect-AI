"use client";

import React, { useState } from "react";
import { Textarea, Button, Select, SelectItem, Chip } from "@nextui-org/react";
import { prompts } from "@/others/Prompts";
import { Poppins } from "next/font/google";

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Playground() {
  const [ratio, setRatio] = useState("1:1");
  const [totalImages, setTotalImages] = useState(4);
  const [useAi, setUseAi] = useState(false);
  const [prompt, setPrompt] = useState("");

  const SelectPrompt = () => {
    const index = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[index].description);
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
      <div className="playground">
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
            <Button color="primary" isLoading className="w-full mt-3 text-md">
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
            className=""
          >
            {(model) => (
              <SelectItem className={litePoppins.className} key={model.value}>
                {model.label}
              </SelectItem>
            )}
          </Select>
        </div>
        <Button color="primary" variant="solid" className="w-full mt-10 mb-5">
          Generate Image
        </Button>
      </div>
    </>
  );
}

export default Playground;
