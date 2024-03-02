import mongoose, { Schema } from "mongoose";

const librarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Images",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    audios: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audios",
      },
    ],
  },
  { timestamps: true }
);

export const Library =
  mongoose.models.Library || mongoose.model("Library", librarySchema);
