import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  author: Types.ObjectId;
  text: string;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Автоматически добавляет createdAt и updatedAt
);

export default model<IPost>("Post", PostSchema);
