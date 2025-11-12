import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { uploadProductImage } from "../middlewares/uploadMovieFiles.js";

const productrouter = express.Router();

productrouter.post("/add", uploadProductImage, addProduct);
productrouter.get("/get", getProducts);
productrouter.put("/update/:id", uploadProductImage, updateProduct);
productrouter.delete("/delete/:id", deleteProduct);

export default productrouter;
