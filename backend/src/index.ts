import { createApp } from "./app";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";
import http from "http";
import { createSocketServer } from "./socket";
import logger from "./config/logger";

const startServer = async () => {
  try {
    // Сначала подключаем базу данных
    await connectDatabase();

    // Затем создаем приложение и сервер
    const app = createApp();
    const server = http.createServer(app);

    // WebSocket initialization
    createSocketServer(server);

    // Server start
    server.listen(config.PORT, () => {
      logger.info(
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
      );
    });

    // Handle server errors
    server.on("error", (error) => {
      logger.error("Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
