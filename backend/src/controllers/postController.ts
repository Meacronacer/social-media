import { Request, Response } from "express";
import PostService from "../services/post.service";
import { IUser } from "../models/User";

class PostController {
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;
      const userId = (req.user as IUser)?._id;

      console.log(text, userId);
      if (!userId || !text) {
        res.status(400).json({ message: "Неверные данные" });
        return;
      }
      const post = await PostService.createPost(userId, text);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getPostsPaginated(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const limit = Number(req.query.limit) || 5;
      const lastCreatedAt = req.query.lastCreatedAt as string | undefined;

      // Преобразуем строку в Date объект если параметр есть
      const parsedLastCreatedAt = lastCreatedAt
        ? new Date(lastCreatedAt)
        : undefined;

      // Получаем данные из сервиса
      const { posts, hasMore } = await PostService.getPostsPaginated(
        userId,
        limit,
        parsedLastCreatedAt
      );

      // Отправляем ответ с дополнительным полем hasMore
      res.json({
        posts,
        hasMore,
      });
    } catch (e) {
      console.error("Error in getPostsPaginated:", e);
      res.status(500).json({
        message: "Ошибка сервера",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      console.log("begin");
      const { postId } = req.params;
      const userId = String((req.user as IUser)?._id);
      console.log("before success");
      const success = await PostService.deletePost(postId, userId);
      if (!success) {
        res.status(403).json({ message: "Удаление запрещено" });
        return;
      }
      console.log("after success");
      res.json({ message: "Пост удалён" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = (req.user as IUser)?._id;

      if (!userId || !text) {
        res.status(400).json({ message: "Неверные данные" });
        return;
      }

      const updatedPost = await PostService.updatePost(postId, userId, text);
      if (!updatedPost) {
        res.status(403).json({ message: "Редактирование запрещено" });
        return;
      }
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = String((req.user as IUser)?._id);
      const success = await PostService.toggleLike(postId, userId);
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

export default new PostController();
