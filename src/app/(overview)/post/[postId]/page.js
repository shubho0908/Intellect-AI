"use client";

import { Avatar, Button, Divider, Image } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { PiMagicWand } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import { MdOutlineDone } from "react-icons/md";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

function page({ params }) {
  const [postData, setPostData] = useState(null);
  const [myData, setMyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  const router = useRouter();

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${poppins.className} text-sm`,
    });

  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${poppins.className} text-sm`,
    });

  const getPostData = async () => {
    try {
      const response = await fetch(`/api/post?postId=${params?.postId}`);
      const { success, data, error } = await response.json();
      if (success) {
        setPostData(data);
      } else {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  const fetchMyData = async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data } = await response.json();
      if (success) {
        setMyData(data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/userdata?id=${postData?.userId}`);
      const { success, data, error } = await response.json();
      if (success) {
        setUserData(data?.user);
        setUserPosts(data?.userPosts);
      } else {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  useEffect(() => {
    if (postData) {
      fetchUserData();
    }
  }, [postData]);

  const getUserLikeData = useCallback(async () => {
    try {
      if (myData === null) {
        return;
      }
      const response = await fetch(
        `/api/images/check-like?imageId=${postData?._id}`
      );
      const { message } = await response.json();
      if (message === "Image liked") {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [myData, postData?._id]);

  useEffect(() => {
    if (postData) {
      getUserLikeData();
    }
  }, [postData?._id, getUserLikeData]);

  const getCollectionData = useCallback(
    async (imgId) => {
      try {
        if (myData === null) {
          return;
        }
        const response = await fetch("/api/collections");
        const { success, data, error } = await response.json();

        if (success) {
          const imageIDs = data?.collections.flatMap((collection) =>
            collection?.data.map((item) => item?.imageID)
          );

          setIsSaved(imageIDs.includes(imgId));
        } else {
          errorMsg(error);
          setIsSaved(false);
        }
      } catch (error) {
        errorMsg(error.message);
        setIsSaved(false);
      }
    },
    [myData, errorMsg]
  );

  useEffect(() => {
    if (postData) {
      getCollectionData(postData?._id);
    }
  }, [postData?._id, getCollectionData]);

  const getTotalLikes = useCallback(async () => {
    try {
      const response = await fetch(`/api/images/like?id=${postData?._id}`);
      const { success, likes, error } = await response.json();
      if (success) {
        setTotalLikes(likes);
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [postData?._id, isLiked]);

  useEffect(() => {
    if (postData) {
      getTotalLikes();
    }
  }, [postData?._id, isLiked, getTotalLikes]);

  const LikePost = async () => {
    try {
      if (myData === null) {
        errorMsg("Please login to like");
        return router.push("/login");
      }
      const response = await fetch("/api/images/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: postData?._id,
        }),
      });
      const { success, message, error } = await response.json();
      if (success && message === "Image liked") {
        successMsg(message + " successfully!");
        setIsLiked(true);
      } else if (success && message === "Image disliked") {
        setIsLiked(false);
      }
      if (error) {
        setIsLiked(false);
        errorMsg(error);
      }
    } catch (error) {
      setIsLiked(false);
      errorMsg(error.message);
    }
  };

  if (!postData || !userData) {
    return (
      <>
        <div
          className={`${poppins.className} sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4`}
        >
          <div className="postloading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div
        className={`${poppins.className} sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4`}
      >
        <div className="post flex flex-col items-center justify-center h-screen">
          <div className="items-center h-[600px] md:h-auto overflow-auto md:overflow-hidden flex flex-col md:flex-row md:items-start p-5 rounded-xl bg-[#181818]">
            <div className="left hidden md:block">
              {postData && userData && (
                <>
                  <Image
                    src={postData?.url}
                    alt="image"
                    width={800}
                    height={800}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                    className="cursor-pointer z-[1] object-cover h-[800px] w-[800px]"
                  />
                </>
              )}
            </div>
            <div className="right w-full md:w-fit ml-0 mt-0 md:mt-0 md:ml-8">
              <div className="user-data flex items-center">
                <Link
                  href={`/profile/${userData?.username}`}
                  className="flex items-center gap-2"
                >
                  <Avatar
                    color="primary"
                    className="cursor-pointer"
                    src={userData?.profileImg}
                  />
                  <p className="w-max ml-2 text-lg">{userData?.name}</p>
                </Link>
                <div>
                  {!isFollowed ? (
                    <Button
                      onClick={() => {
                        if (!myData) {
                          router.push("/login");
                        }
                      }}
                      color="primary"
                      className="rounded-full ml-4"
                      isDisabled={postData?.userId === myData?._id || !myData}
                      // onPress={FollowUser}
                    >
                      <RiUserFollowLine fontSize={18} className="text-white" />
                      Follow
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      isDisabled={postData?.userId === myData?._id}
                      variant="bordered"
                      className="rounded-full ml-4 border-gray-600 text-white"
                      // onPress={FollowUser}
                    >
                      <RiUserUnfollowLine
                        fontSize={18}
                        className="text-white"
                      />
                      Unfollow
                    </Button>
                  )}
                </div>
              </div>

              <div className="prompt mt-4">
                <div className="head flex items-center">
                  <p>Prompt details</p>
                  <div className="cursor-pointer rounded-lg">
                    <Button
                      isIconOnly
                      variant="bordered"
                      // onClick={handleCopyprompt}
                      className="rounded-lg ml-2 border-none text-white"
                    >
                      {!isCopied ? (
                        <GoCopy fontSize={18} className="text-white" />
                      ) : (
                        <MdOutlineDone fontSize={18} className="text-white" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="content mt-2 w-full md:max-w-[500px] text-sm bg-[#27272A] p-3 rounded-lg">
                  {postData?.prompt?.length > 100
                    ? postData?.prompt?.slice(0, 100) + "..."
                    : postData?.prompt}
                </div>
              </div>
              <div className="more-details py-6">
                <div className="first flex items-center justify-between">
                  <div className="dimension">
                    <p className="text-sm text-gray-500">Resolution</p>
                    <p className="text-sm mt-1">
                      {postData?.miscData?.dimensions} px
                    </p>
                  </div>
                  <div className="created flex flex-col items-end">
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm mt-1">
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(postData?.createdAt))}
                    </p>
                  </div>
                </div>
                <div className="second mt-4 flex items-center justify-between">
                  <div className="model">
                    <p className="text-sm text-gray-500">Model</p>
                    <div className="model-name flex items-center  mt-2">
                      <PiMagicWand fontSize={18} className="text-white mr-2" />
                      <p className="text-sm">Stable Diffusion</p>
                    </div>
                  </div>
                  <div className="category flex flex-col items-end">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-sm mt-2">Image tool</p>
                  </div>
                </div>
                <div className="btn-grp flex items-center justify-between gap-3 mt-6">
                  <Button
                    color="default"
                    variant="ghost"
                    className="rounded-xl w-fit"
                    onClick={LikePost}
                  >
                    {isLiked ? (
                      <>
                        <BiSolidLike fontSize={21} className="text-white" />
                        {totalLikes}
                      </>
                    ) : (
                      <>
                        <BiLike fontSize={21} className="text-white" />
                        {totalLikes}
                      </>
                    )}
                  </Button>
                  <Button
                    color="default"
                    variant="ghost"
                    className="rounded-xl w-fit"
                    // onClick={downloadImage}
                  >
                    <RxDownload fontSize={21} className="text-white" />
                    Download
                  </Button>
                  <Button
                    color="default"
                    variant="ghost"
                    className="rounded-xl w-fit"
                    // onClick={downloadImage}
                  >
                    <FiSend fontSize={21} className="text-white" />
                    Share
                  </Button>
                  <Button
                    color="default"
                    variant="ghost"
                    // isDisabled={!user?.userId && !data?.imgId}
                    className="rounded-xl w-fit"
                    onClick={() => {
                      if (!myData) {
                        router.push("/login");
                      }
                    }}
                  >
                    {isSaved ? (
                      <>
                        <IoBookmark fontSize={21} className="text-white" />
                        Saved
                      </>
                    ) : (
                      <>
                        <IoBookmarkOutline
                          fontSize={21}
                          className="text-white"
                        />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Divider />
              <div className="more-content max-w-[500px] mt-4">
                <p>More from {userData?.name}</p>
                <div className="other-posts flex flex-wrap gap-4 mt-4">
                  {userPosts?.slice(0, 6).map((post, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          post?._id === postData?._id ? "hidden" : ""
                        }`}
                      >
                        <Link
                          href={`/post/${post._id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Image
                            className="cursor-pointer"
                            src={post?.url}
                            alt="image"
                            width={150}
                            height={150}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
