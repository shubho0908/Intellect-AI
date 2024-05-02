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
          ref: "Image",
        },
        videoID: {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
      },
    ],
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Collection =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
