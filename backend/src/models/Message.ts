import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
});

export default model<IMessage>("Message", MessageSchema);
