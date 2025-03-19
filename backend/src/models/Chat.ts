// Обновленная схема чата для хранения количества непрочитанных сообщений
import { Schema, model, Document, Types } from "mongoose";

export interface IChat extends Document {
  participants: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.ObjectId>;
  is_active: boolean;
  lastMessage: Types.ObjectId;
  unreadMessages: Map<string, number>;
}

const ChatSchema = new Schema<IChat>({
  _id: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  is_active: { type: Boolean, default: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  unreadMessages: {
    type: Map,
    of: Number,
    default: {}, // Начальное значение пустое
  },
});

export default model<IChat>("Chat", ChatSchema);
