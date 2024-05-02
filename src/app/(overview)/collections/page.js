"use client";
import { Card, Image } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

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
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
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
