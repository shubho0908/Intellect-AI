import { Poppins } from "next/font/google";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

function page() {
  return (
    <>
      <div className="image-generator mt-5 sm:mt-0 sm:ml-[120px] md:ml-[320px] flex flex-col items-center">
        <div className="top">
          <div className="head">
            <p className={`${litePoppins.className} text-[3rem]`}>
              Unleash your creativity with AI Image Generator
            </p>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    </>
  );
}

export default page;
