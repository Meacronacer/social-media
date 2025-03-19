export interface IMessage {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}
