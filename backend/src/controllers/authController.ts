import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-errors";
import authService from "../services/auth-service";
import tokenService from "../services/token-service";
import UserDto from "../dtos/user-dto";
import { validationResult } from "express-validator";

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      res.cookie("accessToken", userData.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      if (user) {
        //@ts-ignore
        const userDto = new UserDto(user);
        const { accessToken, refreshToken } = tokenService.generateTokens({
          ...userDto,
        });

        await tokenService.saveRefreshTokenInDatabase(userDto.id, refreshToken);

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.redirect("http://localhost:3000/");
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
        });
        res.json({ message: "Access token refreshed!" });
      }
    } catch (e) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
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
