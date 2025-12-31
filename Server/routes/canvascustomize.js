import express from "express";
import upload from "../Middleware/upload.js";
import {
  createCanvas,
  getAllCanvas,
  getCanvasById,
  uploadImage,
  updateCanvas,
  deleteCanvas,
} from "../controllers/canvasCustomizeController.js";

const router = express.Router();

router.post("/", upload.single("image"), createCanvas);
router.get("/", getAllCanvas);
router.get("/:id", getCanvasById);
router.post("/upload", upload.single("image"), uploadImage);
router.put("/:id", upload.single("image"), updateCanvas);
router.delete("/:id", deleteCanvas);

export default router;
