"use client";

import React, { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
function Playground() {
  const [ratio, setRatio] = useState("1:1");

  return (
    <>
      <div className="playground">
        <div className="prompt">
          <p className="text-lg">Prompt</p>
          <Textarea
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your prompt here"
            className="w-full mt-4"
          />
          <Button
            color="primary"
            className="w-full mt-3 text-md"
            variant="shadow"
          >
            Write with AI ✨
          </Button>
        </div>
        <div className="ratio mt-10">
          <p className="text-lg">Image Ratio</p>
          <div className="all-ratios mt-5 bg-[#1D1E20] justify-between rounded-lg p-4 flex items-end">
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
          <p className="text-xl">Number of image</p>
          <div className="quantity flex items-center mt-3">
            <p className="one cursor-pointer py-2 px-6 bg-[#1D1E20] rounded-lg w-fit">
              1
            </p>
            <p className="two cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit">
              2
            </p>
            <p className="three cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit">
              3
            </p>
            <p className="four cursor-pointer py-2 ml-4 px-6 bg-[#1D1E20] rounded-lg w-fit border-2 border-blue-500">
              4
            </p>
          </div>
        </div>
        <Button color="primary" variant="solid" className="w-full mt-10 mb-5">
          Generate Image
        </Button>
      </div>
    </>
  );
}

export default Playground;
