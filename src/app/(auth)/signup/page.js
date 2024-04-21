"use client";

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <>
      <div className="login flex flex-col items-center justify-center h-[100vh] w-full">
        <div className="top flex items-center flex-col">
          <Image
            src="/logo2.png"
            width={80}
            height={80}
            alt="logo"
            className="mb-3"
          />
          <p className={`${poppins.className} text-xl`}>Welcome</p>
          <p className={`${poppins.className} text-gray-400`}>
            Create your account to get started
          </p>
        </div>
        <div className={`${poppins.className} auth mt-6`}>
          <Card className="w-[400px] px-3 py-4">
            <CardBody className="gap-4">
              <Input
                isClearable
                size="md"
                isRequired
                type="text"
                label="Full Name"
                variant="bordered"
                placeholder="Enter your full name"
              />
              <Input
                isClearable
                size="md"
                isRequired
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                isRequired
                variant="bordered"
                placeholder="Enter your password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
              <div className="py-2">
                <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                  <p className="text-sm">
                    I agree with the{" "}
                    <span className="text-blue-600">Terms</span> and{" "}
                    <span className="text-blue-600">Privacy Policy</span>
                  </p>
                </Checkbox>
              </div>

              <Button isDisabled={!isSelected} color="primary">
                Sign Up
              </Button>
              <Divider orientation="horizontal" className="mt-4 mb-1" />
              <div className="extra flex items-center justify-center text-sm">
                <p className="mr-2">Already have an account?</p>
                <Link href="/login" className="text-blue-600">
                  Log In
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Login;
