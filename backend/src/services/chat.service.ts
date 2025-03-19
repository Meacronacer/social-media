import mongoose, { ObjectId } from "mongoose";
import Chat from "../models/Chat";
import Message, { IMessage } from "../models/Message";

class ChatService {
  async getActiveChats(userId: string, searchTerm: string = "") {
    try {
      const regex = new RegExp(searchTerm, "i");
      const userIdObj = new mongoose.Types.ObjectId(userId);

      const aggregationPipeline: mongoose.PipelineStage[] = [
        {
          $match: {
            participants: userIdObj,
            is_active: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            as: "participantsData",
          },
        },
        {
          $unwind: {
            path: "$participantsData",
            preserveNullAndEmptyArrays: true, // Важно для обработки пустых данных
          },
        },
        {
          $match: {
            "participantsData._id": { $ne: userIdObj },
            $or: [
              { "participantsData.first_name": { $regex: regex } },
              { "participantsData.second_name": { $regex: regex } },
            ],
          },
        },
        {
          $group: {
            _id: "$_id",
            participants: { $first: "$participantsData" },
            lastMessage: { $first: "$lastMessage" },
            unreadMessages: { $first: "$unreadMessages" },
            is_active: { $first: "$is_active" },
            createdAt: { $first: "$createdAt" }, // Сохраняем дату создания
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "lastMessage",
            foreignField: "_id",
            as: "lastMessageData",
          },
        },
        {
          $unwind: {
            path: "$lastMessageData",
            preserveNullAndEmptyArrays: true, // Разрешаем отсутствие сообщений
          },
        },
        {
          $addFields: {
            lastMessage: "$lastMessageData",
            lastMessageTimestamp: {
              $ifNull: [
                "$lastMessageData.timestamp",
                "$createdAt", // Используем дату создания чата, если нет сообщений
              ],
            },
          },
        },
        {
          $sort: { lastMessageTimestamp: -1 }, // Сортируем по временной метке
        },
        {
          $project: {
            lastMessageData: 0,
            createdAt: 0,
          },
        },
      ];

      const activeChats = await Chat.aggregate(aggregationPipeline);

      return activeChats.map((chat) => {
        // Исправляем преобразование unreadMessages
        let unreadMap: Map<string, number>;

        if (chat.unreadMessages instanceof Map) {
          unreadMap = chat.unreadMessages;
        } else if (chat.unreadMessages instanceof Object) {
          unreadMap = new Map(Object.entries(chat.unreadMessages));
        } else {
          unreadMap = new Map();
        }

        return {
          ...chat,
          unreadMessages: Object.fromEntries(unreadMap),
        };
      });
    } catch (error) {
      console.error("Error in getActiveChats:", error);
      throw new Error("Failed to fetch active chats");
    }
  }

  async getChatMessages(
    chatId: string,
    lastMessageId?: string,
    limit: number = 20
  ) {
    console.log("Fetching messages:", { chatId, lastMessageId, limit });

    // Находим чат, чтобы получить участников
    const chat = await Chat.findById(chatId).lean();
    if (!chat) {
      throw new Error("Chat not found");
    }

    const participants = chat.participants.map((id) => id.toString());

    // Фильтр по отправителю и получателю
    let filter: any = {
      $or: [
        { sender: participants[0], recipient: participants[1] },
        { sender: participants[1], recipient: participants[0] },
      ],
    };

    // Подгружаем старые сообщения
    if (lastMessageId) {
      const lastMessage = await Message.findById(lastMessageId).lean();
      if (!lastMessage) {
        console.warn("Last message not found, returning empty array");
        return { messages: [], hasMore: false };
      }
      filter.timestamp = { $lt: lastMessage.timestamp };
    }

    // Запрашиваем сообщения
    const messages = await Message.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return { messages: messages.reverse(), hasMore: messages.length === limit };
  }

  async getTotalUnreadMessages(userId: string): Promise<number> {
    const chats = await Chat.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          userUnread: {
            $ifNull: [
              { $getField: { field: userId, input: "$unreadMessages" } },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$userUnread" },
        },
      },
    ]);

    return chats[0]?.total || 0;
  }
}

export default new ChatService();
