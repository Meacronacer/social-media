import { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";

class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      res.json(req.user);
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
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
