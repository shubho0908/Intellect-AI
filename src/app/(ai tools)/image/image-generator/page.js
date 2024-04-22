"use client";

import { Poppins } from "next/font/google";
import Generation from "./(components)/Generation";
import { Button, Image, Input, Skeleton } from "@nextui-org/react";
import { PiMagicWand } from "react-icons/pi";
import { useEffect, useState } from "react";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

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

function page() {
  const [prompt, setPrompt] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

  // const createImage = async () => {
  //   try {
  //     const response = await fetch("/api/images/text-to-image", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     const 
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  if (isClicked) {
    return (
      <>
        <Generation />
      </>
    );
  }

  return (
    <>
      <div className="image-generator fadein mb-[12rem] sm:mb-[8rem] sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4 p-4 flex flex-col items-center">
        <div className="top mt-10">
          <div className="head flex flex-col items-center">
            <p
              className={`${litePoppins.className} w-fit text-center text-[1.7rem] xsm:text-[2.4rem] lg:text-[3rem] xl:text-[4.2rem]`}
            >
              Create beautiful AI Art <br />
            </p>
            <p
              className={`${litePoppins.className} bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text font-bold text-[1.7rem] xsm:text-[2.4rem] lg:text-[3rem] xl:text-[4.2rem]`}
            >
              with Intellect.AI
            </p>
          </div>
          <div className="input mx-6 lg:mx-20 xl:mx-40 relative top-10 flex flex-col xsm:flex-row items-center">
            <textarea
              id="message"
              rows="4"
              cols="50"
              className={` ${litePoppins.className} my-inp shadow-xl hidden lg:block scrollbar-hide resize-none p-4 h-[60px] w-full text-md text-gray-700 bg-gray-100 rounded-xl border border-gray-300  dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-600  dark:text-gray-700`}
              placeholder="Write your prompt"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            ></textarea>
            <Input
              variant="bordered"
              placeholder="Write your prompt"
              size="lg"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className={`${litePoppins.className} rounded-lg block lg:hidden`}
            />
            {prompt === "" ? (
              <Button
                color="primary"
                isDisabled
                className={`${litePoppins.className} rounded-xl xsm:rounded-lg mt-4 xsm:mt-0 xsm:ml-3 w-full xsm:w-fit lg:ml-0 lg:absolute lg:right-4`}
              >
                <PiMagicWand
                  fontSize={22}
                  className="text-white block xsm:hidden lg:block"
                />
                Generate
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => setIsClicked(true)}
                className={`${litePoppins.className} rounded-xl xsm:rounded-lg mt-4 xsm:mt-0 xsm:ml-3 w-full xsm:w-fit lg:ml-0 lg:absolute lg:right-4`}
              >
                <PiMagicWand
                  fontSize={22}
                  className="text-white block xsm:hidden lg:block"
                />
                Generate
              </Button>
            )}
          </div>
          <div
            className={`${litePoppins2.className} font-light prompt-recommend mx-10 xl:mx-20 relative top-20 hidden xsm:flex flex-wrap justify-center items-center gap-6`}
          >
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Painting showcases galaxies, Jesus Christ, evoking awe and wonder."
                )
              }
              className="text-md hidden xl:block rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Painting showcases galaxies, Jesus Christ, evoking awe and wonder.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Painting showcases galaxies, Jesus Christ, evoking awe and wonder."
                )
              }
              className="text-md block xl:hidden lg:text-md text-sm rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Painting showcases ga...
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Create a warm and friendly illustration of an endearing dog."
                )
              }
              className="text-md hidden xl:block rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Create a warm and friendly illustration of an endearing dog.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Create a warm and friendly illustration of an endearing dog."
                )
              }
              className="text-md block xl:hidden lg:text-md text-sm rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Create a warm and...
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "8K ultra-realistic photo of tramezzini course, extreme detailing."
                )
              }
              className="text-md hidden xl:block rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              8K ultra-realistic photo of tramezzini course, extreme detailing.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "8K ultra-realistic photo of tramezzini course, extreme detailing."
                )
              }
              className="text-md block xl:hidden lg:text-md text-sm rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              8K ultra-realistic photo...
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Glass robot with copper details, surrounded by futuristic aura and raindrops."
                )
              }
              className="text-md hidden xl:block rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Glass robot with copper details, surrounded by futuristic aura and
              raindrops.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() =>
                setPrompt(
                  "Glass robot with copper details, surrounded by futuristic aura and raindrops."
                )
              }
              className="text-md block xl:hidden lg:text-md text-sm rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Glass robot with copper de...
            </Button>
          </div>
        </div>
        <div className="bottom flex flex-col items-center mt-[6rem] xsm:mt-[9rem] xl:mt-[12.4rem] w-[80%]">
          <p className={`${litePoppins2.className} text-lg xsm:text-2xl`}>
            Our Best Examples
          </p>
          <div className="new-line w-full flex items-center justify-center">
            <div className="line w-[250px] h-[0.1rem] mt-3 bg-gradient-to-r from-[#eab1ff] to-[#0369b294]"></div>
          </div>
          <div
            x-data="{}"
            x-init="$nextTick(() => {
        let ul = $refs.logos;
        ul.insertAdjacentHTML('afterend', ul.outerHTML);
        ul.nextSibling.setAttribute('aria-hidden', 'true');
    })"
            className="w-full mt-14 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
          >
            <ul
              x-ref="logos"
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
            >
              {allImages?.map((image, index) => {
                return (
                  <>
                    <li key={index}>
                      <Skeleton
                        isLoaded={isLoading}
                        className="rounded-lg w-fit"
                      >
                        <Image
                          className="rounded-xl pointer-events-none w-[180px] xsm:w-[220px] xl:w-[300px]"
                          src={image}
                          width={300}
                          height={300}
                        />
                      </Skeleton>
                    </li>
                  </>
                );
              })}
            </ul>
            <ul
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
              aria-hidden="true"
            >
              {allImages?.map((image, index) => {
                return (
                  <>
                    <li key={index}>
                      <Skeleton
                        isLoaded={isLoading}
                        className="rounded-lg w-fit"
                      >
                        <Image
                          className="rounded-xl pointer-events-none w-[180px] xsm:w-[220px] xl:w-[300px]"
                          src={image}
                          width={300}
                          height={300}
                        />
                      </Skeleton>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
