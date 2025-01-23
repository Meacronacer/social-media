import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "../exceptions/api-errors";

const errorMiddleware: ErrorRequestHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
  } else {
    res
      .status(500)
      .json({
        message: "We have some troubles on the server, please try later!",
      });
  }

  // Call next() if further error-handling is needed
  next();
};

export default errorMiddleware;
