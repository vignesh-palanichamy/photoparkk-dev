import Canvascustomizedata from "../models/canvascustomize.js";
import cloudinary from "../config/cloudinary.js";

// Allowed shape values
const ALLOWED_SHAPES = ["Portrait", "Landscape", "Square"];

export const createCanvas = async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    if (!ALLOWED_SHAPES.includes(shape)) {
      return res.status(400).json({ message: "Invalid or missing shape" });
    }

    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    const parsedSizes = sizes.map(size => ({
      label: size.label,
      price: Number(size.price),
      original: Number(size.original),
    }));

    const parsedRating = Number(rating);

    let imageUrl = null;
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "canvasCustomize" },
        (error, result) => {
          if (error) throw new Error("Cloudinary upload failed");
          return result?.secure_url;
        }
      );

      const stream = cloudinary.uploader.upload_stream({ folder: "canvasCustomize" }, (err, result) => {
        if (err) throw err;
        imageUrl = result.secure_url;
      });

      stream.end(req.file.buffer);
    }

    const newCanvas = new Canvascustomizedata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      quantity,
      shape,
      image: imageUrl,
    });

    const saved = await newCanvas.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Canvas Create Error:", error);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

export const getAllCanvas = async (req, res) => {
  try {
    const posts = await Canvascustomizedata.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCanvasById = async (req, res) => {
  try {
    const post = await Canvascustomizedata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCanvas = async (req, res) => {
  try {
    const post = await Canvascustomizedata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating) post.rating = Number(rating);
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity) post.quantity = quantity;
    if (shape && ALLOWED_SHAPES.includes(shape)) post.shape = shape;

    if (sizes) {
      let parsedSizes = sizes;
      if (typeof sizes === "string") parsedSizes = JSON.parse(sizes);
      post.sizes = parsedSizes.map(size => ({
        label: size.label,
        price: Number(size.price),
        original: Number(size.original),
      }));
    }

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream({ folder: "canvasCustomize" }, (err, result) => {
        if (err) throw err;
        post.image = result.secure_url;
      });
      stream.end(req.file.buffer);
    }

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCanvas = async (req, res) => {
  try {
    const deleted = await Canvascustomizedata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "NOT FOUND" });
    res.json({ message: "Canvas deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const stream = cloudinary.uploader.upload_stream({ folder: "canvasCustomize" }, (err, result) => {
      if (err) throw err;
      res.status(200).json({ imageUrl: result.secure_url });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
