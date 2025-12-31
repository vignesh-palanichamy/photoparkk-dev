import express from "express";
import upload from "../Middleware/upload.js";
import {
  createFrameCustomize,
  uploadFrameImage,
  getAllFrames,
  getFrameById,
  updateFrameById,
  deleteFrameById,
} from "../controllers/frameCustomizeController.js";

const router = express.Router();

// Routes
router.post("/", upload.single("userUploadedImage"), createFrameCustomize);
router.post("/upload-frame-image", upload.single("frameImage"), uploadFrameImage);

router.get("/", getAllFrames);
router.get("/:id", getFrameById);
router.put("/:id", upload.single("userUploadedImage"), updateFrameById);
router.delete("/:id", deleteFrameById);

export default router;
