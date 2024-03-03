import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    url: {
      type: String,
      required: true,
    },
    miscData: {
      dimensions: {
        type: String,
      },
      modelName: {
        type: String,
        required: true,
      },
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { timestamps: true }
);

export const Videos =
  mongoose.models.Video || mongoose.model("Video", videoSchema);
