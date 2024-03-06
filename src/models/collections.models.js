import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    data: [
      {
        imageID: {
          type: Schema.Types.ObjectId,
          ref: "Images",
        },
        videoID: {
          type: Schema.Types.ObjectId,
          ref: "Videos",
        },
      },
    ],
    collectionName: {
      type: String,
    },
    description: {
      type: String,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Collection =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
