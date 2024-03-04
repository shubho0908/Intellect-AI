import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    data: [
      {
        postId: {
          type: Schema.Types.ObjectId,
          ref: "Images" || "Videos",
        },
        Type: {
          type: String,
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
