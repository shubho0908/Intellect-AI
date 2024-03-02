import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    data: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
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

export const Collections =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
