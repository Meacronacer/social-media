import { IAuthor } from "./user";

export interface Ichat {
  _id: string;
  is_active?: boolean;
  lastMessage?: {
    sender: string;
    recipient: string;
    _id: string;
    text: string;
    timestamp: Date;
    status: string;
  } | null;
  participants?: IAuthor;
  unreadMessages?: { [key: string]: number };
}
