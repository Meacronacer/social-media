import { ObjectId } from "mongoose";
import UserModel from "../models/User";

class SubscriptionService {
  async subscribeToUser(
    currentUserId: string | ObjectId,
    targetUserId: string
  ) {
    const session = await UserModel.startSession();
    try {
      await session.withTransaction(async () => {
        // Добавляем подписку: текущий пользователь начинает следить за targetUserId
        await UserModel.findByIdAndUpdate(
          currentUserId,
          { $addToSet: { following: targetUserId } },
          { session }
        );
        // Добавляем подписчика: targetUserId получает текущего пользователя в список подписчиков
        await UserModel.findByIdAndUpdate(
          targetUserId,
          { $addToSet: { followers: currentUserId } },
          { session }
        );
      });
    } finally {
      session.endSession();
    }
  }

  async unsubscribeFromUser(
    currentUserId: string | ObjectId,
    targetUserId: string
  ) {
    const session = await UserModel.startSession();
    try {
      await session.withTransaction(async () => {
        await UserModel.findByIdAndUpdate(
          currentUserId,
          { $pull: { following: targetUserId } },
          { session }
        );
        await UserModel.findByIdAndUpdate(
          targetUserId,
          { $pull: { followers: currentUserId } },
          { session }
        );
      });
    } finally {
      session.endSession();
    }
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 10) {
    const user = await UserModel.findById(userId)
      .select("followers")
      .populate({
        path: "followers",
        select: "first_name second_name img_url",
        options: {
          skip: (page - 1) * limit,
          limit: limit,
        },
      })
      .lean();
    return user?.followers || [];
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 10) {
    const user = await UserModel.findById(userId)
      .select("following")
      .populate({
        path: "following",
        select: "first_name second_name img_url",
        options: {
          skip: (page - 1) * limit,
          limit: limit,
        },
      })
      .lean();
    return user?.following || [];
  }

  async getRelationshipStatus(
    currentUserId: string | ObjectId,
    targetUserId: string | ObjectId
  ): Promise<{ isFollowing: boolean; isFollowedBy: boolean }> {
    // Получаем данные текущего пользователя (его подписки)
    const currentUser = await UserModel.findById(currentUserId)
      .select("following")
      .lean();
    // Получаем данные целевого пользователя (его подписчики)
    const targetUser = await UserModel.findById(targetUserId)
      .select("followers")
      .lean();

    // Приводим ObjectId к строке для сравнения
    const currentIdStr = currentUserId.toString();
    const targetIdStr = targetUserId.toString();

    const isFollowing =
      currentUser?.following?.some(
        (id: any) => id.toString() === targetIdStr
      ) || false;
    const isFollowedBy =
      targetUser?.followers?.some(
        (id: any) => id.toString() === currentIdStr
      ) || false;

    return { isFollowing, isFollowedBy };
  }
}

export default new SubscriptionService();
