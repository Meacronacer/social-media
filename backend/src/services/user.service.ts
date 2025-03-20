import UserModel, { IUser } from "../models/User";
import { v4 as uuidv4 } from "uuid";
import { ObjectId, Types } from "mongoose";
import AvatarService from "./avatar.service";
import PostModel from "../models/Post";

interface UpdateProfileData {
  first_name: string;
  second_name: string;
  description: string;
  skills: string;
  avatarFile?: Express.Multer.File;
}

class UserService {
  async getUsers(userId: string | ObjectId, search: string) {
    const regex = new RegExp(search, "i");

    const users = await UserModel.find({
      _id: { $ne: userId },
      $or: [{ first_name: regex }, { second_name: regex }, { skills: regex }],
    }).select(
      "-isActivated -posts -password -chats -activationLink -roles -__v -email"
    );

    return users;
  }

  async findUserById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    // Обратите внимание: здесь мы не исключаем following
    const user = await UserModel.findById(new Types.ObjectId(id))
      .select(
        "-password -isActivated -activationLink -roles -posts -chats -__v -updatedAt"
      )
      .populate({
        path: "followers",
        select: "first_name second_name img_url", // поля для подписчиков
        options: { limit: 6 },
      })
      .lean();

    if (user) {
      // Подсчитываем количество постов, где автор равен найденному пользователю
      const postsCount = await PostModel.countDocuments({ author: user._id });
      // Количество подписок определяется длиной массива following
      const followingCount = user.following ? user.following.length : 0;
      return { ...user, postsCount, followingCount };
    }

    return user;
  }

  async findOrCreateUser(profile: any) {
    const email = profile.emails[0].value; // Email из Google
    const firstName = profile.name.givenName || "";
    const secondName = profile.name.familyName || "";
    const imgUrl = profile.photos[0]?.value || "";

    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          first_name: firstName,
          second_name: secondName,
          img_url: imgUrl,
          email,
          password: uuidv4(),
          isActivated: true,
          activationLink: null,
        });
      }
      return user;
    } catch (error) {
      console.error("Ошибка при поиске или создании пользователя:", error);
      throw new Error("Ошибка при обработке Google авторизации");
    }
  }

  async updateUserProfile(userId: string | ObjectId, data: UpdateProfileData) {
    const { first_name, second_name, description, skills, avatarFile } = data;
    let img_url;
    if (avatarFile) {
      const result = await AvatarService.uploadToCloudinary(avatarFile.buffer);
      img_url = result.secure_url;
    }
    // Преобразуем skills из строки в массив
    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    const updateData: any = {
      first_name,
      second_name,
      description,
      skills: skillsArray,
    };
    if (img_url) {
      updateData.img_url = img_url;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return updatedUser;
  }
}

export default new UserService();
