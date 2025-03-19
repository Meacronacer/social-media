import jwt, { JwtPayload } from "jsonwebtoken";
import tokenModel from "../models/Token";
import ApiError from "../exceptions/api-errors";
import UserModel from "../models/User";
import UserDto from "../dtos/user-dto";
import { ObjectId } from "mongoose";

interface Payload {
  [key: string]: any;
}

class TokenService {
  generateAccessToken(payload: Payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    return accessToken;
  }

  generateRefreshToken(payload: Payload) {
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "15d",
      }
    );

    return refreshToken;
  }

  validateAccessToken(token: string): JwtPayload | null {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      );
      return userData as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): JwtPayload | null {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      );
      return userData as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    // Проверяем валидность refreshToken
    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      if (tokenFromDb) {
        await this.removeRefreshToken(refreshToken);
      }
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData._id);
    if (!user) {
      // Если пользователь не найден, выбрасываем ошибку
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto(user);
    // Генерируем новый accessToken, используя корректный payload
    const accessToken = this.generateAccessToken({
      ...userDto,
    });
    // Возвращаем новый accessToken, оставляем старый refreshToken
    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  async saveRefreshTokenInDatabase(
    userId: string | ObjectId,
    refreshToken: string
  ) {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });

    return token;
  }

  async removeRefreshToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
