import { IUser } from "./../models/User";
import { Request, Response, NextFunction } from "express";
import SubscriptionService from "../services/subscriptions.service";
import userService from "../services/user.service";

class SubscriptionController {
  async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = (req.user as IUser)?._id;
      const { targetUserId } = req.body;
      await SubscriptionService.subscribeToUser(currentUserId, targetUserId);
      res.status(200).json({ message: "Подписка оформлена успешно" });
    } catch (error) {
      next(error);
    }
  }

  async unsubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = (req.user as IUser)?._id;
      const { targetUserId } = req.body;
      await SubscriptionService.unsubscribeFromUser(
        currentUserId,
        targetUserId
      );
      res.status(200).json({ message: "Отписка выполнена успешно" });
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const followers = await SubscriptionService.getFollowers(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const following = await SubscriptionService.getFollowing(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  }

  async getRelationshipStatus(req: Request, res: Response, next: NextFunction) {
    try {
      // Из middleware auth предполагается, что req.user уже установлен
      const currentUserId = (req.user as IUser)._id;
      const { targetUserId } = req.params;
      const status = await SubscriptionService.getRelationshipStatus(
        currentUserId,
        targetUserId
      );
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }
}

export default new SubscriptionController();
