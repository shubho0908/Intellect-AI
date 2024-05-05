"use client";
import { Button, Card, Image } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

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

  return (
    <>
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
                        <div className="bottom px-4 gap-4 w-full h-full flex flex-col items-center justify-center">
                          <p
                            className={`${litePoppins.className} text-sm text-center text-white`}
                          >
                            Remove from this collection?
                          </p>
                          <Button
                            isIconOnly
                            className={`${litePoppins.className} w-1/2 bg-red-600`}
                          >
                            <MdDelete
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
                        className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.3]"
                        src={data.urls[0]}
                      />
                    </Card>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
