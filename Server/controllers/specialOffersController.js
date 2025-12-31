import SpecialOffersdata from "../models/specialoffers.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// Helper to parse sizes safely
const parseSizes = (sizes) => {
  if (typeof sizes === "string") {
    sizes = JSON.parse(sizes);
  }

  return sizes.map((size) => {
    const price = Number(size.price);
    const original = Number(size.original);
    if (isNaN(price) || isNaN(original)) {
      throw new Error("Invalid numeric input in sizes");
    }
    return { label: size.label, price, original };
  });
};

// ✅ CREATE Special Offer
export const createSpecialOffer = async (req, res) => {
  try {
    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "special_offers");
      imageUrl = result.secure_url;
    }

    const parsedSizes = parseSizes(sizes);
    const parsedRating = Number(rating);

    const newPost = new SpecialOffersdata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      image: imageUrl,
      quantity,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ GET All Special Offers
export const getAllSpecialOffers = async (req, res) => {
  try {
    const posts = await SpecialOffersdata.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET Special Offer By ID
export const getSpecialOfferById = async (req, res) => {
  try {
    const post = await SpecialOffersdata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE Special Offer
export const updateSpecialOffer = async (req, res) => {
  try {
    const post = await SpecialOffersdata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) throw new Error("Invalid rating");
      post.rating = parsedRating;
    }
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity !== undefined) {
      const parsedQty = Number(quantity);
      if (isNaN(parsedQty)) throw new Error("Invalid quantity");
      post.quantity = parsedQty;
    }

    if (sizes) post.sizes = parseSizes(sizes);

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "special_offers");
      post.image = result.secure_url;
    }

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE Special Offer
export const deleteSpecialOffer = async (req, res) => {
  try {
    const deleted = await SpecialOffersdata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "NOT FOUND" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
