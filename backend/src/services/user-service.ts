import UserModel, { IUser } from "../models/User";
import uuid from "uuid";
import Chat from "../models/Chat";

class UserService {
  async getActiveChats(userId: string) {
    const activeChats = await Chat.find({
      users: userId,
      is_active: true,
    }).populate("users", "first_name second_name");
    return activeChats;
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async findUserById(id: string) {
    const user = await UserModel.find((user: IUser) => user.id === id);
    return user;
  }

  async findOrCreateUser(profile: any) {
    const email = profile.emails[0].value; // Google возвращает email в массиве
    const firstName = profile.name.givenName || ""; // Имя пользователя
    const secondName = profile.name.familyName || ""; // Фамилия пользователя
    const imgUrl = profile.photos[0]?.value || ""; // Фото профиля

    try {
      // Попробуем найти пользователя по email
      let user = await UserModel.findOne({ email });

      if (!user) {
        // Если пользователь не найден, создаем нового
        user = await UserModel.create({
          first_name: firstName,
          second_name: secondName,
          img_url: imgUrl,
          email,
          password: uuid.v4(), // Генерируем случайный пароль (можно хранить пустым или фиксированным значением)
          isActivated: true, // Google уже подтверждает email
          activationLink: null, // Не нужен, так как email уже подтвержден
          roles: ["USER"], // Назначаем дефолтную роль (можно настроить)
          posts: [],
          chats: [],
        });
      }

      return user;
    } catch (error) {
      console.error("Ошибка при поиске или создании пользователя:", error);
      throw new Error("Ошибка при обработке Google авторизации");
    }
  }
}

export default new UserService();
