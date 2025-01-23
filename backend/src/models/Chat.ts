import { Schema, model, Document, Types } from "mongoose";

interface IChat extends Document {
  participants: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.ObjectId>;
  is_active: boolean;
  lastMessage: Types.ObjectId;
}

const ChatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  is_active: { type: Boolean, default: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
});

export default model<IChat>("Chat", ChatSchema);
