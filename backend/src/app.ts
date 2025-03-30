import express from "express";
import cors from "cors"; // Добавить импорт
import passport from "./config/passport";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import chatRouter from "./routes/chatRouter";
import postRouter from "./routes/postRouter";
import commentRouter from "./routes/commentRouter";
import subscriptionRouter from "./routes/subscriptionsRouter";
import errorMiddleware from "./middlewares/error-middleware";
import cookieParser from "cookie-parser";
import { config } from "./config/env"; // Добавить импорт конфига
import { securityMiddleware } from "./middlewares/security";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(...securityMiddleware());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Настройка CORS
  app.use(
    cors({
      origin: config.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/chats", chatRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/subscriptions", subscriptionRouter);

  // Health Check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  // Error Handling
  app.use(errorMiddleware);

  return app;
};
