import UserModel, { IUser } from "../models/User";
import { v4 as uuidv4 } from "uuid";
import { ObjectId, Types } from "mongoose";
import AvatarService from "./avatar.service";
import PostModel from "../models/Post";
import ApiError from "../exceptions/api-errors";
import { getUpdatedUser } from "../utils/getUpdatedUser";

interface UpdateProfileData {
  first_name: string;
  second_name: string;
  description: string;
  skills: string;
  avatarFile?: Express.Multer.File;
}

class UserService {
  async getUsersWithPagination(
    userId: string | Types.ObjectId,
    search: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find({
        _id: { $ne: userId },
        $or: [
          { first_name: new RegExp(search, "i") },
          { second_name: new RegExp(search, "i") },
          { skills: new RegExp(search, "i") },
        ],
      })
        .select("_id first_name second_name img_url skills description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      UserModel.countDocuments({
        _id: { $ne: userId },
        $or: [
          { first_name: new RegExp(search, "i") },
          { second_name: new RegExp(search, "i") },
          { skills: new RegExp(search, "i") },
        ],
      }),
    ]);

    return {
      users,
      total,
      hasMore: skip + limit < total, // Используем limit вместо users.length
    };
  }

  async findUserById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw ApiError.BadRequest("user don't exist");
    }
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
      const postsCount = await PostModel.countDocuments({ author: user._id });
      const followingCount = user.following ? user.following.length : 0;
      // Создаем новый объект без свойства following
      const { following, ...userWithoutFollowing } = user;
      return { ...userWithoutFollowing, postsCount, followingCount };
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

    if (!updatedUser) {
      throw ApiError.BadRequest("Can't update user!");
    }

    return getUpdatedUser(updateData);
  }
}

export default new UserService();
