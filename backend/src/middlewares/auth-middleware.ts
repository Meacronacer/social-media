import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-errors";
import tokenService from "../services/token.service";

export default function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { accessToken } = req.cookies;

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
