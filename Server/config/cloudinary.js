// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config(); // Load .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Named export for upload
export const uploadToCloudinary = async (fileBuffer, folder = "orders") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default cloudinary;
