import Product from "../Models/productModel.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim())
      return res.status(400).json({ success: false, message: "Product name is required" });

    if (!req.file)
      return res.status(400).json({ success: false, message: "Product image is required" });

    const imageUrl = req.file.path;

    const product = await Product.create({ name: name.trim(), img: imageUrl });

    res.status(201).json({
      success: true,
      message: "✅ New product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updateData = { name };

    if (req.file) updateData.img = req.file.path;

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "✅ Product updated successfully",
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      message: "🗑 Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
