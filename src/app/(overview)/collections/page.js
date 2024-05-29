"use client";
import Loading from "@/components/Loading";
import { Button, Card } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsBookmarkXFill } from "react-icons/bs";
import { RiShareForwardBoxLine } from "react-icons/ri";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function page() {
  const [collections, setCollections] = useState(null);
  const router = useRouter();

  //Toasts
  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${litePoppins.className} text-sm`,
    });

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${litePoppins.className} text-sm`,
    });

  const fetchCollectionData = useCallback(async () => {
    try {
      const response = await fetch("/api/collections");
      const { success, data, error } = await response.json();
      if (success) {
        setCollections(data?.images);
      } else {
        console.error("Error fetching user data:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchCollectionData();
  }, []);

  const RemovePost = async (id) => {
    try {
      const response = await fetch(`/api/collections?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, error, message } = await response.json();
      if (success && message === "Post removed from collection!") {
        successMsg(message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      if (error) {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  if (!collections) {
    return (
      <>
        <div
          className={`${litePoppins.className} sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4`}
        >
          <div className="flex flex-col items-center justify-center h-screen">
            <Loading />
            <p className="text-lg relative bottom-14 text-gray-300">
              Hang tight while we load all the posts...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="collections sm:mt-0 sm:ml-[120px] md:ml-[320px] mb-14">
        <div className="collections-data m-4 mt-10">
          <p className={`${poppins.className} text-2xl`}>My Collections</p>
          <div className="mt-8 flex items-start flex-wrap gap-5">
            {collections?.map((data, index) => {
              return (
                <>
                  <div key={index}>
                    <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                      <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                        <Button
                          isIconOnly
                          className="absolute right-0"
                          onClick={() => router.push(`/post/${data?._id}`)}
                          color="primary"
                        >
                          <RiShareForwardBoxLine fontSize={20} color="white" />
                        </Button>
                        <div className="bottom px-4 gap-4 w-full h-full flex flex-col items-center justify-center">
                          <p
                            className={`${litePoppins.className} text-sm text-center text-white`}
                          >
                            Remove from this collection?
                          </p>
                          <Button
                            isIconOnly
                            color="primary"
                            onClick={() => RemovePost(data?._id)}
                            className={`${litePoppins.className} w-1/2`}
                          >
                            <BsBookmarkXFill
                              fontSize={22}
                              className="text-white mr-3"
                            />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <Image
                        removeWrapper
                        alt="Card background"
                        width={300}
                        height={300}
                        className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.3]"
                        src={data.url}
                      />
                    </Card>
                  </div>
                </>
              );
            })}

            {collections && !collections.length > 0 && (
              <>
                <div className="w-full flex flex-col items-center justify-center mt-14">
                  <Image
                    src="/empty.png"
                    width={300}
                    height={300}
                    alt="empty"
                  />
                  <p
                    className={`${poppins.className} mt-4 text-xl w-2/3 text-center`}
                  >
                    Your collection is empty! Go and save some creations.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
