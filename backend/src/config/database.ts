// src/config/database.ts
import mongoose from "mongoose";
import { config } from "./env";
import logger from "./logger";

// Интерфейс для подключения к БД
interface IDatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

// Конфигурация для разных окружений
const getDatabaseConfig = (): IDatabaseConfig => {
  const baseOptions: mongoose.ConnectOptions = {
    autoIndex: config.NODE_ENV !== "production",
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
  };

  return {
    uri: config.MONGODB_URI,
    options: {
      ...baseOptions,
    },
  };
};

// Обработчики событий MongoDB
const setupDatabaseEvents = (): void => {
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
};

// Функция подключения к БД
export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    logger.warn("MongoDB already connected");
    return;
  }

  const { uri, options } = getDatabaseConfig();
  setupDatabaseEvents();

  try {
    await mongoose.connect(uri, options);
    logger.info(`Connected to MongoDB (${config.NODE_ENV} environment)`);
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

// Функция отключения от БД (для тестов)
export const disconnectDatabase = async (): Promise<void> => {
  if (process.env.NODE_ENV === "test") {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected through app termination");
  process.exit(0);
});
