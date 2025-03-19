import { ObjectId, Types } from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";

class CommentService {
  // Создание комментария или ответа на комментарий
  async createComment(
    userId: string,
    postId: string,
    text: string,
    parentCommentId?: string
  ) {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Пост не найден");

    const newComment = await Comment.create({
      author: userId,
      text,
      post: postId,
      parentComment: parentCommentId || null,
    });

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new Error("Родительский комментарий не найден");

      parentComment.replies.push(newComment._id);
      await parentComment.save();
    } else {
      post.comments.push(newComment._id);
      await post.save();
    }

    return newComment;
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const comment = await Comment.findById(commentId);
    if (!comment) return false;

    // Проверка прав доступа: только автор комментария может его удалить
    if (comment.author.toString() !== userId) return false;

    // Удаляем комментарий и все его вложенные комментарии (рекурсивно)
    await this.deleteCommentAndReplies(commentId);
    return true;
  }

  private async deleteCommentAndReplies(commentId: string): Promise<void> {
    const comment = await Comment.findById(commentId);
    if (!comment) return;

    // Рекурсивно удаляем все вложенные комментарии
    for (const replyId of comment.replies) {
      await this.deleteCommentAndReplies(replyId.toString());
    }

    // Удаляем сам комментарий
    await Comment.findByIdAndDelete(commentId);

    // Удаляем ссылку на комментарий из поста (если нужно)
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });
  }

  async updateComment(commentId: string, userId: string, text: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) return null;
    // Редактировать может только автор комментария
    if (comment.author.toString() !== userId) return null;
    comment.text = text;
    await comment.save();
    return comment;
  }

  async toggleLike(commentId: string, userId: string): Promise<boolean> {
    const comment = await Comment.findById(commentId);
    if (!comment) return false;

    const likedIndex = comment.likes.findIndex(
      (id) => id.toString() === userId
    );
    if (likedIndex > -1) {
      comment.likes.splice(likedIndex, 1);
    } else {
      comment.likes.push(new Types.ObjectId(userId));
    }

    await comment.save();
    return true;
  }
}

export default new CommentService();
