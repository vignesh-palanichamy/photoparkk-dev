import express from "express";
import { upload } from "../Middleware/multerConfig.js";
import {
  createSpecialOffer,
  getAllSpecialOffers,
  getSpecialOfferById,
  updateSpecialOffer,
  deleteSpecialOffer,
} from "../controllers/specialOffersController.js";

const router = express.Router();

// Image uploads handled via multer middleware
router.post("/", upload.single("image"), createSpecialOffer);
router.get("/", getAllSpecialOffers);
router.get("/:id", getSpecialOfferById);
router.put("/:id", upload.single("image"), updateSpecialOffer);
router.delete("/:id", deleteSpecialOffer);

export default router;
