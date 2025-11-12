import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    img: {
      type: String, // base64 or URL
      required: [true, "Product image is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
