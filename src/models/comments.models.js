import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reply: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { timestamps: true }
);

export const Comments =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
