import { Schema, model, Document, Types, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId | string;
  first_name: string;
  second_name: string;
  img_url?: string;
  email: string;
  description: string;
  skills: string[];
  password: string;
  isActivated: boolean;
  activationLink?: string;
  roles: Types.ObjectId[];
  posts: Types.ObjectId[];
  chats: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    img_url: { type: String },
    email: { type: String, unique: true, required: true },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    roles: { type: [Schema.Types.ObjectId], ref: "Role" },
    posts: { type: [Schema.Types.ObjectId], ref: "Post" },
    chats: { type: [Schema.Types.ObjectId], ref: "Message" },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
