import { Schema, model, Document, Types } from "mongoose";

interface IPost extends Document {
  author: Types.ObjectId;
  text: string;
  comments: Types.Array<Types.ObjectId>;
  likes: Types.Array<string>;
  createAT: Date;
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: String, unique: true }],
  createAT: { type: Date, default: Date.now },
});

export default model<IPost>("Post", PostSchema);
