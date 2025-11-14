import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "@/config";
import { Menu, X } from "lucide-react";

export default function ProductManager() {
  const primary = "#E54343";
  const ink = "#060606";
  const backendurl = backend_url;

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Form states
  const [draftName, setDraftName] = useState("");
  const [draftImg, setDraftImg] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [editing, setEditing] = useState(null);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendurl}/products/get`);
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      console.error("❌ Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle image select + preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraftImg(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  // ✅ Add product (multipart/form-data)
  const handleAddProduct = async () => {
    if (!draftName || !draftImg) return alert("All fields are required!");

    const formData = new FormData();
    formData.append("name", draftName);
    formData.append("img", draftImg);

    try {
      await axios.post(`${backendurl}/products/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product added!");
      setDraftName("");
      setDraftImg(null);
      setPreviewImg("");
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
  };

  // ✅ Update product (with optional image re-upload)
  const handleUpdateProduct = async () => {
    if (!editing) return alert("No product selected for update");

    const formData = new FormData();
    formData.append("name", draftName);
    if (draftImg) formData.append("img", draftImg);

    try {
      await axios.put(`${backendurl}/products/update/${editing}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product updated!");
      setEditing(null);
      setDraftName("");
      setDraftImg(null);
      setPreviewImg("");
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${backendurl}/products/delete/${id}`);
      alert("🗑 Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // ✅ Filter by name
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

 return (
  <div className="min-h-screen bg-white" style={{ color: ink }}>
    {/* ✅ Navbar */}
    <header
      className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 sm:px-6 py-3"
      style={{ borderColor: primary }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
          Manage <span style={{ color: primary }}>Products</span>
        </h1>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditing(null);
              setDraftName("");
              setDraftImg(null);
              setPreviewImg("");
            }}
            className="px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: primary }}
          >
            ➕ Add Product
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mt-3 flex flex-col gap-3 md:hidden animate-slideDown">
          
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditing(null);
              setDraftName("");
              setDraftImg(null);
              setPreviewImg("");
            }}
            className="px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: primary }}
          >
            ➕ Add Product
          </button>
        </div>
      )}
    </header>

    {/* ✅ Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {filtered.map((item) => (
        <div
          key={item._id}
          className="group relative bg-white rounded-3xl border overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          style={{ borderColor: "#f1f1f1" }}
        >
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2 truncate w-full">
              {item.name}
            </h2>

            {/* Action buttons */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  setEditing(item._id);
                  setDraftName(item.name);
                  setPreviewImg(item.img);
                  setDraftImg(null);
                  setShowAddForm(true);
                }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-red-500 shadow hover:shadow-lg transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 shadow hover:shadow-lg transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl border border-transparent group-hover:border-[#E54343]/40 transition-all duration-300" />
        </div>
      ))}
    </div>

    {/* ✅ Modal Popup for Add/Edit Product */}
    {showAddForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[400px] shadow-2xl relative animate-fadeIn">
          <button
            onClick={() => setShowAddForm(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
          <h2
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: primary }}
          >
            {editing ? "Update Product" : "Add New Product"}
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Product name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-[#E54343] focus:outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border px-2 py-2 rounded-md focus:outline-none"
            />

            {previewImg && (
              <img
                src={previewImg}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md border mx-auto"
              />
            )}

            <button
              onClick={editing ? handleUpdateProduct : handleAddProduct}
              className="px-4 py-2 rounded-md text-white font-semibold mt-2 shadow-md hover:shadow-lg transition-all"
              style={{
                background: "linear-gradient(to right, #E54343, #FF6B6B)",
              }}
            >
              {editing ? " Update" : " Add Product"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}
