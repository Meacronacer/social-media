import { IComment } from "./comment";
import { IAuthor } from "./user";

export interface IPost {
  _id: string;
  author: IAuthor;
  text: string;
  comments: IComment[];
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}
