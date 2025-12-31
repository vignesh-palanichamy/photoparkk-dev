import BacklightCustomizedata from "../models/backlightcustomize.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Upload to Cloudinary from memory buffer
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "backlightcustomize" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

// ✅ Create Backlight Customize Entry
export const createBacklightCustomize = async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity, shape } = req.body;

    // Shape Validation
    const ALLOWED_SHAPES = ["Portrait", "Landscape", "Square"];
    if (!ALLOWED_SHAPES.includes(shape)) {
      return res.status(400).json({ message: "Invalid or missing shape" });
    }

    // Parse sizes (from JSON string to array of objects)
    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    const parsedSizes = sizes.map(size => ({
      label: size.label,
      price: Number(size.price),
      original: Number(size.original),
    }));

    const parsedRating = Number(rating);

    let uploadedImageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      uploadedImageUrl = result.secure_url;
    }

    const posting = new BacklightCustomizedata({
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get all
export const getAllBacklightCustomize = async (req, res) => {
  try {
    const data = await BacklightCustomizedata.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get by ID
export const getBacklightCustomizeById = async (req, res) => {
  try {
    const data = await BacklightCustomizedata.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Upload image only (optional utility route)
export const uploadBacklightImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadToCloudinary(req.file.buffer);
    return res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Backlight Customize
export const updateBacklightCustomize = async (req, res) => {
  try {
    const id = req.params.id;
    let {
      title,
      content,
      rating,
      thickness,
      sizes,
      stock,
      quantity,
      shape
    } = req.body;

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    const parsedSizes = sizes.map(size => ({
      label: size.label,
      price: Number(size.price),
      original: Number(size.original),
    }));

    const parsedRating = Number(rating);

    let uploadedImageUrl = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      uploadedImageUrl = result.secure_url;
    }

    const updated = await BacklightCustomizedata.findByIdAndUpdate(
      id,
      {
        title,
        content,
        rating: parsedRating,
        thickness,
        sizes: parsedSizes,
        stock,
        uploadedImageUrl: uploadedImageUrl || undefined,
        quantity,
        shape,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Backlight Customize
export const deleteBacklightCustomize = async (req, res) => {
  try {
    const deleted = await BacklightCustomizedata.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
