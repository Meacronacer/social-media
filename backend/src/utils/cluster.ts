import cluster from "cluster";
import os from "os";
import { config } from "../config/env";
import logger from "../config/logger";

export const runInCluster = (startServer: () => void) => {
  if (cluster.isPrimary && config.NODE_ENV === "production") {
    const numCPUs = os.cpus().length;

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      logger.error(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    startServer();
  }
};
