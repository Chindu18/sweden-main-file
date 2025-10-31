"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Backend base URL
const BASE_URL = "http://localhost:8004/collectors";

interface Collector {
  _id: string;
  name: string;
  description: string;
}

export default function CollectorManager() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Fetch all collectors
  const fetchCollectors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getcollectors`);
      const list = res.data.collectors || []; // ✅ ensure array
      setCollectors(list);
    } catch (err) {
      console.error("Error fetching collectors", err);
      setCollectors([]); // fallback to avoid .map crash
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  // ✅ Add or Update collector
  const handleSubmit = async () => {
    if (!name.trim()) return alert("Name is required");

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/updatecollector/${editingId}`, {
          name,
          description,
        });
        alert("Collector updated successfully");
      } else {
        await axios.post(`${BASE_URL}/addcollectors`, { name, description });
        alert("Collector added successfully");
      }

      setName("");
      setDescription("");
      setEditingId(null);
      fetchCollectors();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Delete collector
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collector?")) return;

    try {
      await axios.delete(`${BASE_URL}/deletecollector/${id}`);
      alert("Collector deleted successfully");
      fetchCollectors();
    } catch {
      alert("Error deleting collector");
    }
  };

  // ✅ Edit mode
  const handleEdit = (collector: Collector) => {
    setName(collector.name);
    setDescription(collector.description);
    setEditingId(collector._id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add / Edit Collector Card */}
      <Card className="max-w-md mx-auto shadow-lg border">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Collector" : "Add Collector"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Collector Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white hover:opacity-90"
            >
              {editingId ? "Update" : "Add"}
            </Button>

            {editingId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setDescription("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collector List */}
      <div className="grid gap-3 max-w-md mx-auto">
        {collectors.length === 0 ? (
          <p className="text-center text-gray-500">
            No collectors found. Add one above.
          </p>
        ) : (
          collectors.map((c) => (
            <Card key={c._id} className="shadow-sm border">
              <CardContent className="flex justify-between items-center py-3">
                <div>
                  <p className="font-semibold text-lg">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
                <div className="flex gap-2">
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
