import Chat from "../models/Chat";

class ScoketService {
  async getActiveChats(userId: string) {
    const activeChats = await Chat.find({
      users: userId,
      is_active: true,
    }).populate("users", "first_name second_name");
    return activeChats;
  }
}

export default new ScoketService();
