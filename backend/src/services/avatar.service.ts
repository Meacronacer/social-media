import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import "../config/cloudinary";

// Настройка Cloudinary должна быть выполнена (например, в отдельном конфиге)
// cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

class AvatarService {
  uploadToCloudinary(fileBuffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars", // Папка для хранения аватарок
          resource_type: "image",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }
}

export default new AvatarService();
