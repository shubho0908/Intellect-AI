"use client";

import {
  Avatar,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { PiMagicWand } from "react-icons/pi";
import { RxDownload } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import { MdOutlineDone } from "react-icons/md";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Image from "next/image";
import Share from "@/components/Share";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${poppins.className} text-sm`,
    });

  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${poppins.className} text-sm`,
    });

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

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

  useEffect(() => {
    if (myData?.following.includes(userData?._id)) {
      setIsFollowed(true);
    }
  }, [myData?.following, userData?._id]);

  const SavePost = async () => {
    try {
      if (myData === null) {
        errorMsg("Please login to save");
        return router.push("/login");
      }
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postData?._id,
          type: "image",
        }),
      });
      const { success, error, message } = await response.json();
      if (success && message === "Data added to collection") {
        setIsSaved(true);
        successMsg(message);
      } else if (success && message === "Data removed from collection") {
        setIsSaved(false);
      }
      if (error) {
        setIsSaved(false);
        errorMsg(error);
      }
    } catch (error) {
      setIsSaved(false);
      errorMsg(error.message);
    }
  };

  const FollowUser = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userData?._id,
        }),
      });

      const { success, message, error } = await response.json();
      if (success && message === "Unfollowed successfully") {
        setIsFollowed(false);
        successMsg(message);
      } else if (success && message === "Followed successfully") {
        setIsFollowed(true);
        successMsg(message);
      }
      if (error) {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  const downloadImage = async () => {
    const imageUrl = postData?.url;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "download.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      errorMsg(error.message);
    }
  };

  const copyToClipboard = () => {
    setIsCopied(true);
    successMsg("Copied to clipboard");
    navigator.clipboard.writeText(postData?.prompt);
  };

  useEffect(() => {
    if (userPosts?.length > 0 && myData?._id !== postData?.userId) {
      const filteredPosts = userPosts.filter(
        (post) => post.visibility === true
      );
      setUserPosts(filteredPosts);
    }
  }, [userPosts, myData?._id, postData?.userId]);

  if (!postData || !userData) {
    return (
      <>
        <div
          className={`${poppins.className} sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4`}
        >
          <div className="flex flex-col items-center justify-center h-screen">
            <Loading />
            <p className="text-lg relative bottom-14 text-gray-300">
              Hang tight while we load your post...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (postData?.visibility === false && postData?.userId !== myData?._id) {
    return (
      <>
        <div className="not-found fadein sm:ml-[120px] md:ml-[170px] mr-0 sm:mr-4 flex flex-col items-center justify-center w-screen h-screen">
          <Image
            src="/unavailable.png"
            width={400}
            height={400}
            alt="Not found"
            className="relative right-6"
          />
          <p
            className={`${poppins.className} text-xl w-2/3 text-center text-gray-300`}
          >
            Oops! The post you're looking for is not available.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div
        className={`${poppins.className} fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4`}
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
                    loading="lazy"
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                    className="cursor-pointer rounded-xl z-[1] object-cover h-[800px] w-[800px]"
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
                      color="primary"
                      className="rounded-full ml-4"
                      isDisabled={postData?.userId === myData?._id || !myData}
                      onClick={FollowUser}
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
                      onClick={FollowUser}
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
                      onClick={copyToClipboard}
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
                    onClick={downloadImage}
                  >
                    <RxDownload fontSize={21} className="text-white" />
                    Download
                  </Button>
                  <Button
                    color="default"
                    variant="ghost"
                    onClick={onOpen}
                    className="rounded-xl w-fit"
                  >
                    <FiSend fontSize={21} className="text-white" />
                    Share
                  </Button>
                  <Button
                    color="default"
                    variant="ghost"
                    // isDisabled={!user?.userId && !data?.imgId}
                    className="rounded-xl w-fit"
                    onClick={SavePost}
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
                            className="cursor-pointer rounded-xl"
                            src={post?.url}
                            alt="image"
                            width={150}
                            height={150}
                          />
                        </Link>
                      </div>
                    );
                  })}
                  {userPosts?.length < 1 && (
                    <>
                      <div className="flex items-center relative top-10 justify-center w-full h-full">
                        <Image
                          className="cursor-pointer rounded-xl"
                          src="/empty.png"
                          alt="image"
                          width={200}
                          height={200}
                        />
                      </div>
                    </>
                  )}
                  {userPosts?.length === 1 && userPosts[0]?._id === postData?._id && (
                    <>
                      <div className="flex items-center relative top-10 justify-center w-full h-full">
                        <Image
                          className="cursor-pointer rounded-xl"
                          src="/empty.png"
                          alt="image"
                          width={200}
                          height={200}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal  */}

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="md"
        onClose={() => {
          onClose();
        }}
        className={`${poppins.className} my-modal modal-body`}
      >
        <ModalContent className="modal-body border-2 border-gray-800">
          {(onClose) => (
            <>
              <ModalHeader className="modal-header">
                <p className="text-md font-normal">Share this post</p>
              </ModalHeader>
              <ModalBody className="mb-5">
                <Share id={postData?._id} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default page;
