import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  second_name: string;
  img_url?: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string;
  roles: Types.Array<Types.ObjectId>;
  posts: Types.Array<Types.ObjectId>;
  chats: Types.Array<Types.ObjectId>;
}

const UserSchema = new Schema<IUser>({
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  img_url: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  chats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const User = model<IUser>("User", UserSchema);

export default User;
