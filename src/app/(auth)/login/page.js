"use client";

import {
  Button,
  Card,
  CardBody,
  Image,
  Divider,
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
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const Login = async () => {
    try {
      console.log(email, password);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const { success, data } = await response.json();
      if (success) {
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
          <p className={`${poppins.className} text-xl`}>Welcome Back</p>
          <p className={`${poppins.className} text-gray-400`}>
            Log in to your account to continue
          </p>
        </div>
        <div className={`${poppins.className} auth mt-6`}>
          <Card className="w-[400px] px-3 py-4">
            <CardBody className="gap-4">
              <Input
                isClearable
                size="md"
                type="email"
                isRequired
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                variant="bordered"
                isRequired
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
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

              <Button onClick={Login} color="primary">
                Log In
              </Button>
              <Divider orientation="horizontal" className="mt-4 mb-1" />
              <div className="extra flex items-center justify-center text-sm">
                <p className="mr-2">Need to create an account?</p>
                <Link href="/signup" className="text-blue-600">
                  Sign Up
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
