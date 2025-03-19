import { Iuser } from "./user";

export interface IComment {
  _id: string;
  author: IAuthor;
  createdAt: string;
  parentComment: null;
  post: string;
  likes: string[];
  replies: [];
  text: string;
}
