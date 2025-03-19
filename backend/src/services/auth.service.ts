import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../exceptions/api-errors";
import UserModel from "../models/User";
import mailService from "./mail.service";
import UserDto from "../dtos/user-dto";
import tokenService from "./token.service";

interface IAuthService {
  registration(
    first_name: string,
    second_name: string,
    email: string,
    password: string
  ): Promise<any>;
  login(email: string, password: string): Promise<any>;
  logout(refreshToken: string): Promise<any>;
  activate(activationLink: string): Promise<void>;
}

class AuthService implements IAuthService {
  async registration(
    first_name: string,
    second_name: string,
    email: string,
    password: string
  ) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest("User with email already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 7);
    const activationLink = uuidv4();
    const user = await UserModel.create({
      first_name,
      second_name,
      email,
      password: hashPassword,
      activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const accessToken = tokenService.generateAccessToken({ ...userDto });
    const refreshToken = tokenService.generateRefreshToken({ ...userDto });
    await tokenService.saveRefreshTokenInDatabase(userDto._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("User with this email not found!");
    }

    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest("Invalid email or password.");
    }

    const userDto = new UserDto(user);
    const accessToken = tokenService.generateAccessToken({ ...userDto });
    const refreshToken = tokenService.generateRefreshToken({ ...userDto });
    await tokenService.saveRefreshTokenInDatabase(userDto._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeRefreshToken(refreshToken);
    return token;
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Wrong activation link!");
    }

    user.isActivated = true;
    await user.save();
  }
}

export default new AuthService();
