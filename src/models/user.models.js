import mongoose, { Schema } from "mongoose";
import { isEmail } from "validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "Invalid email address!"],
    },
    password: {
      type: String,
    },
    library: {
      type: Schema.Types.ObjectId,
      ref: "Library",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    tokens: {
      type: Number,
      default: 100,
    },
    profileImg: {
      type: String,
      default: "/profile.png",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    visibility: {
      type: Boolean,
      default: true,
    },
    summary: {
      type: String,
    },
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    refreshToken: {
      type: String,
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
