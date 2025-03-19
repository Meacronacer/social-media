import { IComment } from "./comment";
import { Iuser } from "./user";

export interface IPost {
  _id: string;
  author: Iuser;
  text: string;
  comments: IComment[];
  likes: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}
