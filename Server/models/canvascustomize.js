import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  original: { type: Number, required: true },
});

const canvascustomize = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5 },
  thickness: { type: String, required: true },
  sizes: { type: [SizeSchema], required: true },
  stock: { type: String },
  quantity: { type: Number },
  shape: { type: String },
});

const Canvascustomizedata = mongoose.model("Canvascustomizedata", canvascustomize);

export default Canvascustomizedata;
