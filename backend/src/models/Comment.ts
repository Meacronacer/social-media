import { Schema, model, Document, Types } from "mongoose";

interface IComment extends Document {
  author: Types.ObjectId;
  text: string;
  createAt: Date;
}

const CommentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

export default model<IComment>("Comment", CommentSchema);
