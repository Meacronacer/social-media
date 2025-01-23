import jwt, { JwtPayload } from "jsonwebtoken";
import tokenModel from "../models/Token";
import ApiError from "../exceptions/api-errors";
import UserModel from "../models/User";
import UserDto from "../dtos/user-dto";

interface Payload {
  [key: string]: any;
}

class TokenService {
  generateTokens(payload: Payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "15d",
      }
    );

    return { accessToken, refreshToken };
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

    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    if (user) {
      const userDto = new UserDto(user);
      const tokens = this.generateTokens({ ...userDto });
      await this.saveRefreshTokenInDatabase(userDto.id, tokens.refreshToken);
      return {
        ...tokens,
        user: userDto,
      };
    }
  }

  async saveRefreshTokenInDatabase(userId: string, refreshToken: string) {
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
