import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения из .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // например, 'my-cloud-name'
  api_key: process.env.CLOUDINARY_API_KEY, // ваш API ключ
  api_secret: process.env.CLOUDINARY_API_SECRET, // ваш API секрет
});
