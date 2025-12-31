import mongoose from "mongoose";

// Size subdocument schema
const SizeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  original: { type: Number, required: true },
});

// Allowed shapes for dropdown
const SHAPES = ["Square", "Portrait", "Landscape", "Love", "Hexagon", "Round"];

const backlightCustomizeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String, // Product image uploaded by admin (optional)
    },

    uploadedImageUrl: {
      type: String, // User uploaded image (optional for customized orders)
    },

    rating: {
      type: Number,
      default: 5,
    },

    // Supports either a string or an array (your frontend handles both cases)
    thickness: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    sizes: {
      type: [SizeSchema],
      required: true,
    },

    stock: {
      type: String,
      default: "In Stock",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    shape: {
      type: String,
      enum: SHAPES,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Backlightcustomizedata = mongoose.model("Backlightcustomizedata",backlightCustomizeSchema);

export default Backlightcustomizedata;
