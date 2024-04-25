import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
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
    urls: {
      type: [String],
      required: true,
    },
    prompt: {
      type: String,
    },
    title: {
      type: String,
    },
    visibility: {
      type: Boolean,
    },
    miscData: {
      dimensions: {
        type: String,
      },
      modelName: {
        type: String,
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

export const Image =
  mongoose.models.Image || mongoose.model("Image", imageSchema);
