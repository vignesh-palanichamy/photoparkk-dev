import multer from "multer";

// Store files in memory (needed for buffer upload to Cloudinary)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
