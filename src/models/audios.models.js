import mongoose, { Schema } from "mongoose";

const audioSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    url: {
      type: String,
    },
    //If model is subtitle generator
    subtitle: {
      type: String,
    },
    transcript: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Audios =
  mongoose.models.Audio || mongoose.model("Audio", audioSchema);
