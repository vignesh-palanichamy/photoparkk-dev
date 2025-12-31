import express from "express";
import upload from "../Middleware/upload.js"; // uses memoryStorage
import {
  createBacklightCustomize,
  getAllBacklightCustomize,
  getBacklightCustomizeById,
  uploadBacklightImage,
  updateBacklightCustomize,
  deleteBacklightCustomize,
} from "../controllers/backlightCustomizeController.js";

const router = express.Router();

router.post("/", upload.single("image"), createBacklightCustomize);
router.get("/", getAllBacklightCustomize);
router.get("/:id", getBacklightCustomizeById);
router.post("/upload", upload.single("image"), uploadBacklightImage);
router.put("/:id", upload.single("image"), updateBacklightCustomize);
router.delete("/:id", deleteBacklightCustomize);

export default router;
