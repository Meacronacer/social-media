import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { IUser } from "../models/User";

class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as IUser)?._id;
      const user = await userService.findUserById(String(userId));
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json({ message: "can't get user" });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userService.findUserById(userId);
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json({ message: "can't get user" });
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req.user as IUser)?._id;
      const search = req.query.search?.toString() || "";
      const users = await userService.getUsers(userId, search);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async updateProfileController(req: Request, res: Response) {
    try {
      const { first_name, second_name, description, skills } = req.body;
      const avatarFile = req.file;
      // Предполагается, что middleware аутентификации устанавливает req.user
      const userId = (req.user as IUser)?._id;

      const updatedUser = await userService.updateUserProfile(userId, {
        first_name,
        second_name,
        description,
        skills,
        avatarFile,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

export default new UserController();
