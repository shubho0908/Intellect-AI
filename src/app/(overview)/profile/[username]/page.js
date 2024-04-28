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
  Image,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { Poppins } from "next/font/google";
import { FiEdit3 } from "react-icons/fi";
import Posts from "./Posts";
import EditAccount from "./EditAccount";

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

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`/api/user?username=${params?.username}`);
      const { success, data, error } = await response.json();
      if (success) {
        setUser(data?.user);
        setUserPosts(data?.userPosts);
      } else {
        console.error("Error fetching user data:", error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const fetchMyData = useCallback(async () => {
    try {
      const response = await fetch("/api/login");
      const { success, data, error } = await response.json();
      if (success) {
        setMyData(data);
      } else {
        console.error("Error fetching my data:", error);
      }
    } catch (error) {
      console.error("Error fetching my data:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchMyData();
  }, [fetchMyData]);

  return (
    <>
      <div className="profile fadein sm:ml-[120px] md:ml-[320px] mr-0 sm:mr-4">
        <div className="user-data">
          <div className="banner">
            <div class="bg-gradient-to-br from-pink-300 to-blue-400 h-[220px] w-full rounded-lg"></div>
          </div>
          <div className="user-details flex flex-col items-center relative bottom-[5.5rem]">
            <div className="flex flex-col items-start">
              <div className="dp flex items-end">
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
                    className="rounded-full relative right-10"
                    size="sm"
                  >
                    <FiEdit3 color="white" fontSize={15} />
                  </Button>
                )}
              </div>
              <div className="data mt-6">
                <p
                  className={`${poppins.className} text-xl flex items-center gap-2 cursor-pointer font-bold`}
                >
                  {user?.name}
                  <MdVerified className="text-blue-500" fontSize={22} />
                </p>
                <p className={`${poppins.className} text-gray-400`}>
                  @{user?.username}
                </p>
                <div
                  className={`${litePoppins.className} tags mt-3 flex items-center gap-3`}
                >
                  {user?.role ? (
                    <Chip color="default" className="mb-3">
                      💻 {user?.role}
                    </Chip>
                  ) : null}
                </div>
                <div className={`${litePoppins.className} summary`}>
                  <p>
                    {user?.summary ? user?.summary : "**No summary available**"}
                  </p>
                </div>
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
                <div className="user-posts mt-8">
                  {userPosts?.length > 0 ? (
                    <Posts userPosts={userPosts} userData={user} />
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        <Image src="/nothing.png" width={250} height={250} />
                        <p className={`${poppins.className} text-gray-400`}>
                          You don't have any posts.
                        </p>
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
