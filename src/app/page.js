"use client";
import { Poppins } from "next/font/google";
import { Avatar, Card, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const litePoppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins2 = Poppins({
  weight: "300",
  subsets: ["latin"],
});
function Home() {
  const router = useRouter();
  const models = [
    {
      name: "Image Generator",
      desc: "Generate an image from text",
      url: "/image/image-generator",
    },
    {
      name: "Image Upscaler",
      desc: "Upscale an image",
      url: "/image/image-upscaler",
    },
    {
      name: "Ai Avatar",
      desc: "Generate an avatar",
      url: "/image/avatar",
    },
    {
      name: "Magic Expand",
      desc: "Expand an image",
      url: "/image/magic-expand",
    },
    {
      name: "Image2Motion",
      desc: "Transform an image to motion",
      url: "/video/image-to-motion",
    },
    {
      name: "Ai Captions",
      desc: "Generate captions for videos",
      url: "/video/video-caption",
    },
    {
      name: "Video Upscaler",
      desc: "Upscale a video",
      url: "/video/video-upscaler",
    },
  ];

  return (
    <>
      <div className="home sm:mt-0 sm:ml-[120px] md:ml-[320px]">
        <div className="main-home m-4">
          <div className="top">
            <p className={`${litePoppins.className} text-2xl`}>Home</p>
            <div className="models-section mt-8 flex gap-4 overflow-x-scroll scrollbar-hide [mask-image:_linear-gradient(to_right,transparent_0,_black_0px,_black_calc(100%-128px),transparent_100%)]">
              {models?.map((data, index) => (
                <div
                  key={index}
                  onClick={() => {
                    router.push(data?.url);
                    console.log(data?.url);
                  }}
                  className="cursor-pointer"
                >
                  <Card className="col-span-12 sm:col-span-4 h-[220px] w-[370px] flex justify-center items-center">
                    <CardHeader
                      className={`${litePoppins.className} absolute z-10 flex-col items-center`}
                    >
                      <h4 className="text-white font-medium text-large">
                        {data?.name}
                      </h4>
                      <p className="text-white/60 ">{data?.desc}</p>
                    </CardHeader>
                    <Image
                      removeWrapper
                      alt="Card background"
                      className="z-0 w-full h-full object-cover brightness-[.4]"
                      src="/upscale/output2.png"
                    />
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom mt-20">
            <p className={`${litePoppins.className} text-2xl`}>
              Recent Creations
            </p>
            <div className="all-posts mt-5">
              <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[400px] w-[400px] relative group">
                <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    <p
                      className={`${litePoppins.className} text-white font-medium text-large`}
                    >
                      Stream the Acme event
                    </p>
                  </div>
                </div>
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.2]"
                  src="/upscale/output2.png"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
