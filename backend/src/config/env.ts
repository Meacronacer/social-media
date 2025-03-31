import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || "development"}`
  ),
});

export const config = {
  isProduction: process.env.NODE_ENV === "production",
  PORT: Number(process.env.PORT) || 8000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  API_URL: process.env.API_URL || "http://localhost:8000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
