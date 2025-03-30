import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || "development"}`
  ),
});

export const config = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
