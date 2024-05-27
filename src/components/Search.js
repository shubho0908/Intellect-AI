"use client";

import {
  Card,
  CircularProgress,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import { TbFileSad } from "react-icons/tb";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function Search({ close }) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setQuery(e.target.value);
    setLoading(true);
  };

  //Toasts

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${poppins.className} text-sm`,
    });

  const search = async () => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const { success, data, error } = await response.json();
      if (success) {
        setLoading(false);
        setUser(data?.user);
        setPosts(data?.posts);
      }
      if (error) {
        setLoading(false);
        errorMsg(error);
      }
    } catch (error) {
      setLoading(false);
      errorMsg(error.message);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query !== "") {
        search();
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleUserRoute = (user) => {
    router.push(`/profile/${user?.username}`);
    setTimeout(() => {
      close();
    }, 300);
  };

  return (
    <>
      <Toaster />
      <div className="flex w-full mt-8 mb-4">
        <Input
          type="email"
          isClearable
          variant="bordered"
          placeholder="search for user or posts..."
          onChange={handleChange}
          value={query}
          size="lg"
          className="outline-none"
          onClear={() => setQuery("")}
          startContent={
            <IoSearchOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      {user.length > 0 && !loading && (
        <div className="flex flex-col gap-3">
          <p>Users ({user?.length})</p>
          {user.map((user) => (
            <div
              key={user?._id}
              className="flex items-center gap-3 hover:bg-gray-500/20 p-2 rounded-lg cursor-pointer transition-all"
              onClick={() => handleUserRoute(user)}
            >
              <Image
                src={user?.profileImg}
                alt={user?.name}
                width={50}
                height={50}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <p>{user?.name}</p>
                <p className="text-sm text-gray-400">
                  @{user?.username} {user?.role ? `| ${user?.role}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {posts.length > 0 && user.length > 0 && !loading && <Divider />}
      {posts.length > 0 && !loading && (
        <>
          <div>
            <p>Posts ({posts?.length})</p>
            <div className="flex gap-4 flex-wrap mt-4">
              {posts.map((post) => (
                <Card
                  key={post?._id}
                  className="col-span-12 cursor-pointer sm:col-span-4 h-[300px] w-[300px] relative group"
                >
                  <div className="group-hover:opacity-100 opacity-0 m-2 transition-opacity duration-300 absolute inset-0 z-10 top-1 flex flex-col items-start">
                    <div className="flex top items-center justify-between w-full px-4">
                      {/* <Button
                  isIconOnly
                  variant="ghost"
                  className="border-none"
                >
                  <IoBookmarkOutline
                    className="text-white"
                    fontSize={26}
                  />
                </Button> */}
                      {/* <p className={`${poppins.className} text-sm text-white`}>
                    {formattedDate}
                  </p> */}
                    </div>
                    <div className="bottom px-4 absolute bottom-3">
                      <p className={`${poppins.className} text-sm mt-2`}>
                        "
                        {post?.prompt.length > 50
                          ? post?.prompt?.slice(0, 50) + "..."
                          : post?.prompt}
                        "
                      </p>
                    </div>
                  </div>
                  <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-[.5]"
                    src={post?.urls[0]}
                  />
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="w-full flex justify-center">
        {loading && query?.length > 0 && (
          <CircularProgress
            size="lg"
            className="mb-4"
            aria-label="Loading..."
          />
        )}
      </div>
      {user.length === 0 &&
        posts.length === 0 &&
        !loading &&
        (query?.length > 0) && (
          <div className="flex fadein flex-col items-center justify-center mb-4">
            <TbFileSad fontSize={60} className="text-gray-500 mb-2" />
            <p className="text-gray-400 text-lg">No results found</p>
          </div>
        )}
    </>
  );
}

export default Search;
