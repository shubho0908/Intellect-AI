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
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/library");
      const { success, data, error } = await response.json();
      if (success) {
        setLibrary(data?.imageUrls);
      } else {
        console.error("Error fetching user data:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    console.log(library);
  }, [fetchUserData]);

  return (
    <>
      <div className="dashboard sm:mt-0 sm:ml-[120px] md:ml-[320px] mb-14">
        <div className="dashboard-data m-4 mt-10">
          <p className={`${poppins.className} text-2xl`}>Dashboard</p>
          <div className="mt-8 flex items-start flex-wrap gap-5">
            {library?.map((data, index) => {
              return (
                <>
                  <div key={index}>
                    <Card className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group">
                      <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={data}
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
