import jwt from "jsonwebtoken";
import User from "../models/users.js";

// Protect routes using Access Token only
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("🔐 Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "jwt expired" });
    }

    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Admin-only middleware
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
