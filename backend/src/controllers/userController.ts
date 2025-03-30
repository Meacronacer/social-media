import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { IUser } from "../models/User";
import ApiError from "../exceptions/api-errors";

class UserController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as IUser)?._id;
      const user = await userService.findUserById(String(userId));
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userService.findUserById(userId);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const userId = (req.user as IUser)?._id;
      const search = req.query.search?.toString() || "";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userService.getUsersWithPagination(
        userId,
        search,
        page,
        limit
      );

      res.json({
        users: result.users,
        total: result.total,
        hasMore: result.hasMore, // Важное исправление
      });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async updateProfileController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
