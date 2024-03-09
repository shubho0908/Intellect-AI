import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const generateTokens = (payload, expiresIn) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  cookies().set("accessToken", accessToken);
  cookies().set("refreshToken", refreshToken);
  return { accessToken, refreshToken };
};

const generateAccessToken = (payload, expiresIn) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  cookies().set("accessToken", accessToken);
  return accessToken;
};

const verifyToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};



export { generateTokens, generateAccessToken, verifyToken };
