import jwt from "jsonwebtoken";

const generateTokens = (payload, expiresIn) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const generateAccessToken = (payload, expiresIn) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return accessToken;
};

export { generateTokens, generateAccessToken };
