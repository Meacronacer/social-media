import { Schema, model, Document, Types } from "mongoose";

interface IComment extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  parentComment?: Types.ObjectId; // Ссылка на родительский комментарий
  post: Types.ObjectId; // Ссылка на пост, к которому относится комментарий
  replies: Types.Array<Types.ObjectId>; // Дочерние комментарии
  likes: Types.ObjectId[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // Может быть null (если это обычный комментарий к посту)
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Список ответов
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Добавлено поле лайков
  createdAt: { type: Date, default: Date.now },
});

export default model<IComment>("Comment", CommentSchema);
