"use client";
import {
  Avatar,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  Divider,
  useDisclosure,
  Skeleton,
  Image,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { Poppins } from "next/font/google";
import { FiEdit3 } from "react-icons/fi";
import { RiLink, RiUserUnfollowLine } from "react-icons/ri";
import Posts from "./Posts";
import EditAccount from "./EditAccount";
import { FaUserLock } from "react-icons/fa6";
import { RiUserFollowLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Profile({ params }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState(null);
  const [myData, setMyData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  //Toasts
  const successMsg = (msg) =>
    toast.success(msg, {
      className: `${poppins.className} text-sm`,
    });

  const errorMsg = (msg) =>
    toast.error(msg, {
      className: `${poppins.className} text-sm`,
    });

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user?username=${params?.username}`);
      const { success, data, error } = await response.json();
      if (success) {
        setUser(data?.user);
        setUserPosts(data?.userPosts);
      } else {
        errorMsg(error);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchMyData = async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data, error } = await response.json();
      if (success) {
        setMyData(data);
      }
      if (error === "Missing refresh token") {
        setMyData(null);
      }
    } catch (error) {
      errorMsg(error.message);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  useEffect(() => {
    if (myData?.following.includes(user?._id)) {
      setIsFollowed(true);
    }
  }, [myData?.following, user?._id]);

  const FollowUser = async () => {
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user?._id,
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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    successMsg("Link copied to clipboard");
  };

  const professions = {
    Designer: "🎨",
    Developer: "💻",
    Freelancer: "👨🏻‍💻",
    "Content Creator": "🎥",
    Musician: "🎶",
    Photographer: "📷",
    Writer: "📝",
    Others: "🤙🏻",
  };

  if (
    user?.visibility === false &&
    user?._id !== myData?._id &&
    !user?.followers?.includes(myData?._id)
  ) {
    return (
      <>
        <div className="profile py-4 sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4">
          <div className="user-data">
            <div className="banner">
              <div className="bg-gradient-to-br from-pink-300 to-blue-400 h-[220px] w-full rounded-lg"></div>
            </div>
            <div className="user-details flex flex-col items-center relative bottom-[5.5rem]">
              <div className="flex flex-col items-start max-w-[68%] min-w-[35%]">
                <div className="flex items-end justify-between w-full">
                  <div className="dp flex items-end w-full">
                    <Avatar
                      isBordered
                      color="primary"
                      src={user?.profileImg}
                      className="w-[10rem] h-[10rem] text-large"
                    />
                    {myData?._id === user?._id && (
                      <Button
                        isIconOnly
                        onClick={onOpen}
                        color="primary"
                        className={`rounded-full relative right-10 ${
                          !myData?._id && !user?._id ? "hidden" : ""
                        }`}
                        size="sm"
                      >
                        <FiEdit3 color="white" fontSize={15} />
                      </Button>
                    )}
                  </div>
                  <div className="btns flex items-center gap-4">
                    {!isFollowed ? (
                      <Button
                        color="primary"
                        isDisabled={user?._id === myData?._id || !myData}
                        onClick={FollowUser}
                        className={`rounded-full ml-4 ${litePoppins.className}`}
                      >
                        <RiUserFollowLine
                          fontSize={18}
                          className="text-white"
                        />
                        Follow
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        isDisabled={user?._id === myData?._id}
                        onClick={FollowUser}
                        variant="bordered"
                        className={`rounded-full ml-4 border-gray-600 text-white ${litePoppins.className}`}
                      >
                        <RiUserUnfollowLine
                          fontSize={18}
                          className="text-white"
                        />
                        Unfollow
                      </Button>
                    )}

                    <Button
                      isIconOnly
                      color="ghost"
                      onClick={handleCopyUrl}
                      className={`${litePoppins.className}`}
                    >
                      <RiLink fontSize={18} className="text-white" />
                    </Button>
                  </div>
                </div>
                <div className="data mt-6 w-full">
                  <Skeleton
                    isLoaded={user !== null}
                    className={`rounded-lg ${!user ? "w-[200px]" : "w-fit"}`}
                  >
                    <p
                      className={`${poppins.className} text-xl flex items-center gap-2 cursor-pointer font-bold`}
                    >
                      {user?.name}
                      <MdVerified className="text-blue-500" fontSize={22} />
                    </p>
                  </Skeleton>
                  <Skeleton
                    isLoaded={user !== null}
                    className={`rounded-lg ${
                      !user ? "w-[100px] mt-2" : "w-fit"
                    }`}
                  >
                    <p className={`${poppins.className} text-gray-400`}>
                      @{user?.username}
                    </p>
                  </Skeleton>
                  <div
                    className={`${litePoppins.className} tags mt-3 flex items-center gap-3`}
                  >
                    {user?.role ? (
                      <Chip color="default" className="mb-3">
                        {professions[user?.role]} {user?.role}
                      </Chip>
                    ) : null}
                  </div>
                  <Skeleton
                    isLoaded={user !== null}
                    className={`rounded-lg ${!user ? "w-[250px]" : "w-fit"}`}
                  >
                    <div className={`${litePoppins.className} summary`}>
                      <p>
                        {user?.summary ? user?.summary : "No summary available"}
                      </p>
                    </div>
                  </Skeleton>
                  <div
                    className={`${litePoppins.className} stats  flex items-center mt-3 gap-3`}
                  >
                    <div className="followers flex items-center gap-2">
                      <p className="font-bold text-gray-300">
                        {user?.followers?.length}
                      </p>
                      <p className="text-gray-400">Followers</p>
                    </div>
                    <div className="following flex items-center gap-2">
                      <p className="font-bold text-gray-300">
                        {user?.following?.length}
                      </p>
                      <p className="text-gray-400">Following</p>
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="private mt-2 flex flex-col items-center gap-3">
                    <FaUserLock fontSize={200} className="text-gray-700" />
                    <p className={`${poppins.className} text-gray-400`}>
                      This profile is private
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="profile py-4 fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4">
        <div className="user-data">
          <div className="banner">
            <div className="bg-gradient-to-br from-pink-300 to-blue-400 h-[220px] w-full rounded-lg"></div>
          </div>
          <div className="user-details flex flex-col items-center relative bottom-[5.5rem]">
            <div className="flex flex-col items-start max-w-[68%] min-w-[35%]">
              <div className="flex items-end justify-between w-full">
                <div className="dp flex items-end w-full">
                  <Avatar
                    isBordered
                    color="primary"
                    src={user?.profileImg}
                    className="w-[10rem] h-[10rem] text-large"
                  />
                  {myData?._id === user?._id && (
                    <Button
                      isIconOnly
                      onClick={onOpen}
                      color="primary"
                      className={`rounded-full relative right-10 ${
                        !myData?._id && !user?._id ? "hidden" : ""
                      }`}
                      size="sm"
                    >
                      <FiEdit3 color="white" fontSize={15} />
                    </Button>
                  )}
                </div>
                <div className="btns flex items-center gap-4">
                  {!isFollowed ? (
                    <Button
                      color="primary"
                      isDisabled={user?._id === myData?._id || !myData}
                      onClick={FollowUser}
                      className={`rounded-full ml-4 ${litePoppins.className}`}
                    >
                      <RiUserFollowLine fontSize={18} className="text-white" />
                      Follow
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      isDisabled={user?._id === myData?._id}
                      onClick={FollowUser}
                      variant="bordered"
                      className={`rounded-full ml-4 border-gray-600 text-white ${litePoppins.className}`}
                    >
                      <RiUserUnfollowLine
                        fontSize={18}
                        className="text-white"
                      />
                      Unfollow
                    </Button>
                  )}

                  <Button
                    isIconOnly
                    color="ghost"
                    onClick={handleCopyUrl}
                    className={`${litePoppins.className}`}
                  >
                    <RiLink fontSize={18} className="text-white" />
                  </Button>
                </div>
              </div>
              <div className="data mt-6 w-full">
                <Skeleton
                  isLoaded={user !== null}
                  className={`rounded-lg ${!user ? "w-[200px]" : "w-fit"}`}
                >
                  <p
                    className={`${poppins.className} text-xl flex items-center gap-2 cursor-pointer font-bold`}
                  >
                    {user?.name}
                    <MdVerified className="text-blue-500" fontSize={22} />
                  </p>
                </Skeleton>
                <Skeleton
                  isLoaded={user !== null}
                  className={`rounded-lg ${!user ? "w-[100px] mt-2" : "w-fit"}`}
                >
                  <p className={`${poppins.className} text-gray-400`}>
                    @{user?.username}
                  </p>
                </Skeleton>
                <div
                  className={`${litePoppins.className} tags mt-3 flex items-center gap-3`}
                >
                  {user?.role ? (
                    <Chip color="default" className="mb-3">
                      {professions[user?.role]} {user?.role}
                    </Chip>
                  ) : null}
                </div>
                <Skeleton
                  isLoaded={user !== null}
                  className={`rounded-lg ${!user ? "w-[250px]" : "w-fit"}`}
                >
                  <div className={`${litePoppins.className} summary`}>
                    <p>
                      {user?.summary ? user?.summary : "No summary available"}
                    </p>
                  </div>
                </Skeleton>
                <div
                  className={`${litePoppins.className} stats  flex items-center mt-3 gap-3`}
                >
                  <div className="followers flex items-center gap-2">
                    <p className="font-bold text-gray-300">
                      {user?.followers?.length}
                    </p>
                    <p className="text-gray-400">Followers</p>
                  </div>
                  <div className="following flex items-center gap-2">
                    <p className="font-bold text-gray-300">
                      {user?.following?.length}
                    </p>
                    <p className="text-gray-400">Following</p>
                  </div>
                </div>
                <Divider className="my-4" />
                <div
                  className={`user-posts mt-8 flex flex-col ${
                    userPosts?.length > 0 ? "items-start" : "items-center"
                  }`}
                >
                  {userPosts?.length > 0 ? (
                    <Posts
                      myData={myData}
                      userPosts={userPosts}
                      userData={user}
                    />
                  ) : (
                    <>
                      <Skeleton
                        isLoaded={user !== null}
                        className={`rounded-lg ${
                          !user ? "w-full h-[250px]" : "w-fit"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Image
                            src="/nothing.png"
                            width={250}
                            height={250}
                            alt="No post"
                          />
                          <p className={`${poppins.className} text-gray-400`}>
                            User don't have any posts.
                          </p>
                        </div>
                      </Skeleton>
                    </>
                  )}

                  {/* Second check  */}

                  {/* {myData?._id !== user?._id && userPosts?.length > 0(<></>)} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal  */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="blur"
        placement="center"
        size="xl"
      >
        <ModalContent className="modal-body">
          {(onClose) => (
            <>
              <ModalHeader
                className={`${poppins.className} flex flex-col gap-1`}
              >
                Account Details
              </ModalHeader>
              <EditAccount userData={user} close={onClose} />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Profile;
