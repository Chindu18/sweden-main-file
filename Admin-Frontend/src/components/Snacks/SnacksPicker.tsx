import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "@/config";
import { Menu, X } from "lucide-react"; // icons for mobile menu

export default function SnacksPicker() {
  const navigate = useNavigate();
  const primary = "#E54343";
  const ink = "#060606";

  type Snack = {
    _id: string;
    name: string;
    price: number | string;
    img?: string | null;
    category: string;
  };

  const backendurl = backend_url;
  const defaultData: Record<string, Snack[]> = {
    Vegetarian: [],
    "Non Vegetarian": [],
    Juice: [],
  };

  const [data, setData] = useState<Record<string, Snack[]>>(defaultData);
  const [query, setQuery] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // edit/add states
  const [editing, setEditing] = useState<{ cat: string; id: string } | null>(null);
  const [draftName, setDraftName] = useState<string>("");
  const [draftPrice, setDraftPrice] = useState<string>("");
  const [draftImg, setDraftImg] = useState<string>("");
  const [draftCategory, setDraftCategory] = useState<string>("Vegetarian");

  const fetchSnacks = async () => {
    try {
      const res = await axios.get(`${backendurl}/snacks/getsnack`);
      if (res.data.success) {
        const grouped = { Vegetarian: [], "Non Vegetarian": [], Juice: [] };
        res.data.snacks.forEach((snack) => {
          grouped[snack.category]?.push(snack);
        });
        setData(grouped);
      }
    } catch (err) {
      console.error("Error loading snacks:", err);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const next = { Vegetarian: [], "Non Vegetarian": [], Juice: [] };
    for (const [cat, items] of Object.entries(data)) {
      next[cat] = (items as Snack[]).filter((s) => s.name.toLowerCase().includes(q));
    }
    return next;
  }, [data, query]);

  function startEdit(cat, item) {
    setEditing({ cat, id: item._id });
    setDraftName(item.name);
    setDraftPrice(String(item.price));
    setDraftImg(item.img);
    setDraftCategory(item.category);
  }

  function cancelEdit() {
    setEditing(null);
    setDraftName("");
    setDraftPrice("");
    setDraftImg("");
  }

  async function commitEdit() {
    if (!editing) return;
    try {
      await axios.put(`${backendurl}/snacks/updatesnack/${editing.id}`, {
        name: draftName,
        price: draftPrice,
        category: draftCategory,
        img: draftImg,
      });
      alert("✅ Snack updated!");
      fetchSnacks();
      cancelEdit();
    } catch (err) {
      alert("❌ Update failed");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this snack?")) return;
    try {
      await axios.delete(`${backendurl}/snacks/deletesnack/${id}`);
      alert("🗑 Snack deleted!");
      fetchSnacks();
    } catch {
      alert("❌ Delete failed");
    }
  }

  async function handleAddSnack() {
    if (!draftName || !draftPrice || !draftCategory || !draftImg) {
      alert("All fields required!");
      return;
    }
    try {
      await axios.post(`${backendurl}/snacks/addsnack`, {
        name: draftName,
        price: draftPrice,
        category: draftCategory,
        img: draftImg,
      });
      alert("✅ Snack added!");
      setShowAddForm(false);
      fetchSnacks();
      setDraftName("");
      setDraftPrice("");
      setDraftImg("");
    } catch {
      alert("❌ Add failed");
    }
  }

  function onChangeDraftImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setDraftImg(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: ink }}>
      {/* ✅ Responsive Navbar */}
      <header
        className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 sm:px-6 py-3"
        style={{ borderColor: primary }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
            Snacks <span style={{ color: primary }}>Cart</span>
          </h1>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <input
              type="text"
              placeholder="Search snacks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm w-44 sm:w-64 focus:outline-none"
              style={{ borderColor: primary }}
            />
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: primary }}
            >
              ➕ Add
            </button>
            <button
              onClick={() => navigate("/snack-distribute")}
              className="px-4 py-2 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
            >
              🍿 Distribute
            </button>
          </div>

          {/* Mobile menu icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="mt-3 flex flex-col gap-3 md:hidden animate-slideDown">
            <input
              type="text"
              placeholder="Search snacks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm focus:outline-none"
              style={{ borderColor: primary }}
            />
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: primary }}
            >
              ➕ Add
            </button>
            <button
              onClick={() => navigate("/snack-distribute")}
              className="px-4 py-2 rounded-md text-white font-semibold bg-green-600"
            >
              🍿 Distribute Snacks
            </button>
          </div>
        )}
      </header>

      {/* ✅ Add Snack Form */}
      {showAddForm && (
        <div className="p-6 border-b bg-[#fff5f5] flex flex-wrap gap-4 justify-center items-center">
          <input
            type="text"
            placeholder="Name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-40"
            style={{ borderColor: primary }}
          />
          <input
            type="number"
            placeholder="Price"
            value={draftPrice}
            onChange={(e) => setDraftPrice(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-32"
            style={{ borderColor: primary }}
          />
          <select
            value={draftCategory}
            onChange={(e) => setDraftCategory(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-40"
            style={{ borderColor: primary }}
          >
            <option>Vegetarian</option>
            <option>Non Vegetarian</option>
            <option>Juice</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={onChangeDraftImage}
            className="border px-2 py-2 rounded-md w-full sm:w-48"
            style={{ borderColor: primary }}
          />
          <button
            onClick={handleAddSnack}
            className="px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: primary }}
          >
            Add Snack
          </button>
        </div>
      )}

      {/* ✅ Snacks grid */}
      <main className="px-4 sm:px-6 lg:px-10 py-8 space-y-12">
        {Object.entries(filtered).map(([category, snacks]) => (
          <section key={category}>
            <h2
              className="text-2xl md:text-3xl font-bold text-center underline underline-offset-8 mb-8"
              style={{ textDecorationColor: primary }}
            >
              {category}
            </h2>

            <div className="grid gap-6 sm:gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {snacks.map((snack) => {
                const isEditing =
                  editing && editing.cat === category && editing.id === snack._id;
                return (
                  <div
                    key={snack._id}
                    className="border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
                    style={{ borderColor: isEditing ? primary : "#ddd" }}
                  >
                    <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={isEditing && draftImg ? draftImg : snack.img}
                        alt={snack.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {isEditing && (
                        <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border shadow-sm">
                          📷 Change
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChangeDraftImage}
                          />
                        </label>
                      )}
                    </div>

                    <div className="p-3 text-center bg-[#fff6f6]">
                      {!isEditing ? (
                        <>
                          <p className="font-semibold text-base mb-1 truncate">
                            {snack.name}
                          </p>
                          <div className="flex justify-center items-center gap-3 mt-2 text-sm">
                            <span className="font-medium text-gray-700">
                              SEK{snack.price}
                            </span>
                            <button
                              onClick={() => startEdit(category, snack)}
                              className="text-red-500 hover:text-red-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(snack._id)}
                              className="text-gray-600 hover:text-black"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-full border px-2 py-1 rounded-md text-sm"
                            style={{ borderColor: primary }}
                          />
                          <input
                            type="number"
                            value={draftPrice}
                            onChange={(e) => setDraftPrice(e.target.value)}
                            className="w-full border px-2 py-1 rounded-md text-sm"
                            style={{ borderColor: primary }}
                          />
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={commitEdit}
                              className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 rounded border text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
