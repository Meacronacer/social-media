import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-errors";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";
import UserDto from "../dtos/user-dto";
import { validationResult } from "express-validator";
import { IUser } from "../models/User";
import { config } from "../config/env";

class AuthController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { first_name, second_name, email, password } = req.body;
      await authService.registration(first_name, second_name, email, password);
      res.status(201).json({
        message:
          "Activation link was sent to your email. Please activate your account!",
      });
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      if (!userData.user.isActivated) {
        throw ApiError.BadRequest(
          "your account is not activated, please go to your email to activate your account"
        );
      }
      res.cookie("accessToken", userData.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/", // Явно указываем корневой путь
        domain: config.isProduction
          ? new URL(process.env.API_URL as string).hostname
          : undefined,
      });
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/", // Явно указываем корневой путь
        domain: config.isProduction
          ? new URL(process.env.API_URL as string).hostname
          : undefined,
      });
      res.status(200).json({ message: "you logged in" });
    } catch (e) {
      next(e);
    }
  }

  async loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser;

      if (user) {
        const userDto = new UserDto(user);
        const accessToken = tokenService.generateAccessToken({ ...userDto });
        const refreshToken = tokenService.generateRefreshToken({ ...userDto });
        await tokenService.saveRefreshTokenInDatabase(
          userDto._id,
          refreshToken
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/", // Явно указываем корневой путь
          domain: config.isProduction
            ? new URL(process.env.API_URL as string).hostname
            : undefined,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/", // Явно указываем корневой путь
          domain: config.isProduction
            ? new URL(process.env.API_URL as string).hostname
            : undefined,
        });

        res.redirect(process.env.CLIENT_URL as string);
      }
    } catch (e) {
      res.status(500).json({ error: "Google callback error" });
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const userData = await tokenService.refresh(refreshToken);

      if (userData) {
        res.cookie("accessToken", userData.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/", // Явно указываем корневой путь
          domain: config.isProduction
            ? new URL(process.env.API_URL as string).hostname
            : undefined,
        });
        res.json({ message: "Access token refreshed!" });
      }
    } catch (e) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      next(e);
    }
  }

  async requestPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      await authService.requestPasswordReset(email);
      res.status(200).json({
        message: "Reset link sent to your email.",
      });
    } catch (e) {
      next(e);
    }
  }

  async checkResetTokenValidity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.query.token as string;
      console.log("check reset token validity", token);
      await authService.checkResetTokenValidity(token);
      res.status(200).json({ message: "token are valid" });
    } catch (e) {
      next(e);
    }
  }

  // Эндпоинт для сброса пароля
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Password updated successfully." });
    } catch (e) {
      next(e);
    }
  }

  async activation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const activationLink = req.params.link;
      await authService.activate(activationLink);
      res.redirect(process.env.CLIENT_URL as string);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "You logged out successfully" });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
