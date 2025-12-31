import express from "express";
import upload from "../Middleware/upload.js";
import {
  createAcrylic,
  getAllAcrylic,
  getAcrylicById,
  uploadImage,
  updateAcrylic,
  deleteAcrylic,
} from "../controllers/acrylicCustomizeController.js";

const router = express.Router();

// 🐛 DEBUG: Simple test route to verify routing works
router.get("/test", (req, res) => {
  res.json({ 
    message: "Acrylic customize route is working", 
    method: req.method,
    timestamp: new Date().toISOString() 
  });
});

router.post("/upload/test", (req, res) => {
  res.json({ 
    message: "POST method works on acrylic customize", 
    method: req.method,
    timestamp: new Date().toISOString() 
  });
});

router.post("/", upload.single("image"), createAcrylic);
router.get("/", getAllAcrylic);
router.get("/:id", getAcrylicById);
router.post("/upload", upload.single("image"), uploadImage);
router.put("/:id", upload.single("image"), updateAcrylic);
router.delete("/:id", deleteAcrylic);

export default router;
