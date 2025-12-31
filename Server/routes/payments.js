// routes/paymentRoutes.js
import express from "express";
import { protect } from "../Middleware/authmiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
