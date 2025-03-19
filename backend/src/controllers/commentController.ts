import { NextFunction, Request, Response } from "express";
import CommentService from "../services/comment.Service";
import { IUser } from "../models/User";

class CommentController {
  async createComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId, text, parentCommentId } = req.body;
      //@ts-ignore
      const userId = req.user._id; // Авторизованный пользователь

      const comment = await CommentService.createComment(
        userId,
        postId,
        text,
        parentCommentId
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      //@ts-ignore
      const userId = req.user?._id;
      const comment = await CommentService.deleteComment(commentId, userId);
      res.json(comment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ошибка при получении комментариев", error });
    }
  }

  async updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      //@ts-ignore
      const userId = req.user._id;

      if (!userId || !text) {
        res.status(400).json({ message: "Неверные данные" });
        return;
      }

      const updatedComment = await CommentService.updateComment(
        commentId,
        userId,
        text
      );
      if (!updatedComment) {
        res.status(403).json({ message: "Редактирование запрещено" });
        return;
      }
      res.json(updatedComment);
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = String((req.user as IUser)?._id);
      const success = await CommentService.toggleLike(commentId, userId);
      if (!success) {
        res.status(400).json({ message: "Ошибка" });
        return;
      }
      res.json({ message: "Лайк обновлён" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

export default new CommentController();
