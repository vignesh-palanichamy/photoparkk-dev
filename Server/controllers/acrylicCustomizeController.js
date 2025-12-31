import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Acryliccustomizedata from "../models/acryliccustomize.js";
import cloudinary from "../config/cloudinary.js";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if missing
const uploadsDir = path.join(__dirname, "../acryliccustomizeUploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const ALLOWED_SHAPES = ["Square", "Portrait", "Landscape", "Love", "Hexagon", "Round"];

export const createAcrylic = async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    if (!ALLOWED_SHAPES.includes(shape)) {
      return res.status(400).json({ message: "Invalid or missing shape" });
    }

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    const parsedSizes = sizes.map((size) => {
      const price = Number(size.price);
      const original = Number(size.original);
      if (isNaN(price) || isNaN(original)) {
        throw new Error("Invalid numeric input in sizes");
      }
      return { label: size.label, price, original };
    });

    const parsedRating = Number(rating);
    if (isNaN(parsedRating)) {
      return res.status(400).json({ message: "Invalid numeric input in rating" });
    }

    let uploadedImageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "acryliccustomize" },
        async (error, result) => {
          if (error) throw error;
          uploadedImageUrl = result.secure_url;

          const posting = new Acryliccustomizedata({
            title,
            content,
            rating: parsedRating,
            thickness,
            sizes: parsedSizes,
            stock,
            uploadedImageUrl,
            quantity,
            shape,
          });

          const PostingComplete = await posting.save();
          return res.status(201).json(PostingComplete);
        }
      );

      result.end(req.file.buffer);
    } else {
      const posting = new Acryliccustomizedata({
        title,
        content,
        rating: parsedRating,
        thickness,
        sizes: parsedSizes,
        stock,
        uploadedImageUrl: null,
        quantity,
        shape,
      });
      const PostingComplete = await posting.save();
      return res.status(201).json(PostingComplete);
    }
  } catch (error) {
    console.error("Acrylic Customize POST error:", error.message);
    return res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

export const getAllAcrylic = async (req, res) => {
  try {
    const getPost = await Acryliccustomizedata.find();
    return res.json(getPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAcrylicById = async (req, res) => {
  try {
    const getPostId = await Acryliccustomizedata.findById(req.params.id);
    if (!getPostId) return res.status(404).json({ message: "NOT FOUND" });
    return res.json(getPostId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "acryliccustomize" },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).json({ message: "Upload failed" });
        }
        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Image upload error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateAcrylic = async (req, res) => {
  try {
    const post = await Acryliccustomizedata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) return res.status(400).json({ message: "Invalid rating" });
      post.rating = parsedRating;
    }
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity) post.quantity = quantity;

    if (shape) {
      if (!ALLOWED_SHAPES.includes(shape)) {
        return res.status(400).json({ message: "Invalid shape" });
      }
      post.shape = shape;
    }

    if (sizes) {
      let parsedSizes = sizes;
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch {
          return res.status(400).json({ message: "Invalid sizes format" });
        }
      }
      post.sizes = parsedSizes.map((size) => {
        const price = Number(size.price);
        const original = Number(size.original);
        if (isNaN(price) || isNaN(original)) {
          throw new Error("Invalid numeric input in sizes");
        }
        return { label: size.label, price, original };
      });
    }

    if (req.file) {
      const upload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "acryliccustomize" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      post.uploadedImageUrl = upload.secure_url;
    }

    const UpdatedPost = await post.save();
    return res.json(UpdatedPost);
  } catch (error) {
    console.error("Update error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAcrylic = async (req, res) => {
  try {
    const deleted = await Acryliccustomizedata.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "NOT FOUND" });
    }
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
