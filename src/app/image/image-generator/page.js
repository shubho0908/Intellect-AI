import { Poppins } from "next/font/google";
import Generation from "@/app/image/image-generator/Generation";
import { Button } from "@nextui-org/react";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function page() {
  return (
    <>
      <div className="image-generator mt-5 sm:mt-0 sm:ml-[120px] md:ml-[320px] mr-4 p-4 flex flex-col items-center">
        <div className="top mt-10">
          <div className="head flex flex-col items-center">
            <p
              className={`${litePoppins.className} w-fit text-center text-[4.5rem]`}
            >
              Create beautiful AI Art{" "}
              <p className="bg-gradient-to-r from-gray-300 to-blue-600 text-transparent bg-clip-text">
                with Itellect.Ai
              </p>
            </p>
          </div>
          <div className="input mx-40 relative top-10 flex items-center">
            <textarea
              id="message"
              rows="4"
              cols="50"
              className={` ${litePoppins.className} my-inp shadow-xl block scrollbar-hide resize-none p-4 h-[60px] w-full text-md text-gray-700 bg-gray-100 rounded-xl border border-gray-300  dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-600  dark:text-gray-700`}
              placeholder="Write your prompt"
            ></textarea>
            <Button
              color="primary"
              className={`${litePoppins.className} rounded-lg absolute right-4`}
            >
              Generate
            </Button>
          </div>
          <div
            className={`${litePoppins2.className} font-light prompt-recommend mx-20 relative top-20 flex flex-wrap justify-center items-center gap-6`}
          >
            <Button
              color="primary"
              variant="bordered"
              className="text-md rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Painting showcases galaxies, Jesus Christ, evoking awe and wonder.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="text-md rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Create a warm and friendly illustration of an endearing dog.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="text-md rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              8K ultra-realistic photo of tramezzini course, extreme detailing.
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="text-md rounded-lg bg-gray-700 shadow-xl border-none text-white"
            >
              Glass robot with copper details, surrounded by futuristic aura and
              raindrops.
            </Button>
          </div>
        </div>
        <div className="bottom"></div>
      </div>

      {/* <Generation/> */}
    </>
  );
}

export default page;
