import mongoose from "mongoose";

const addToCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "productType",
      required: function () {
        return !["AcrylicCustomizedata", "Canvascustomizedata", "Backlightcustomizedata"].includes(this.productType);
      },
    },

    productType: {
      type: String,
      enum: [
        "Newarrivaldata",
        "SpecialOffersdata",
        "AcrylicCustomizedata",
        "Canvascustomizedata",
        "Backlightcustomizedata",
      ],
      required: [true, "Product type is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },

    size: { type: String, required: false },
    thickness: { type: String, required: false },
    image: { type: String, required: false },
    uploadedImageUrl: { type: String, required: false },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be non-negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Optional: prevent duplicate cart entries for same user/product/image
addToCartSchema.index(
  { userId: 1, productId: 1, uploadedImageUrl: 1 },
  { unique: false }
);

const addtocartdata = mongoose.model("AddToCart", addToCartSchema);

export default addtocartdata;
