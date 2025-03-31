import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import passport from "./config/passport";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import chatRouter from "./routes/chatRouter";
import postRouter from "./routes/postRouter";
import commentRouter from "./routes/commentRouter";
import subscriptionRouter from "./routes/subscriptionsRouter";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error-middleware";
import { createSocketServer } from "./socket"; // Импорт логики Socket.io
import http from "http";

// Инициализация приложения
const app: Application = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/posts", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.use(errorMiddleware);
// Подключаем Socket.io
createSocketServer(server);

const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI || "";

// Запуск сервера
const start = async () => {
  try {
    await mongoose.connect(uri);
    server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  } catch (e) {
    console.error("Error starting the server:", e);
  }
};

start();
