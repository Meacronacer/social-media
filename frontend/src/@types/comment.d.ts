export interface IComment {
  _id: string;
  author: IAuthor;
  createdAt: Date;
  updatedAt: Date;
  parentComment: null;
  post: string;
  likes: string[];
  replies: [];
  text: string;
}
