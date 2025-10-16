"use client";

import { useState } from "react";
import axios from "axios";
import { IndianRupee } from "lucide-react";

// ---------------- Interfaces ----------------
interface Cast {
  actor: string;
  actress: string;
  villan: string;
  supporting: string;
}

interface Crew {
  director: string;
  producer: string;
  musicDirector: string;
  cinematographer: string;
}

interface ShowPrices {
  adult: string;
  kids: string;
}

interface Show {
  date: string;
  time: string;
  prices: {
    online: ShowPrices;
    videoSpeed: ShowPrices;
    others: ShowPrices;
  };
}

interface MovieFormProps {
  backend_url: string;
  onSave?: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ backend_url, onSave }) => {
  const initialFormData: Omit<any, "_id"> & { posters: File[] } = {
    title: "",
    cast: { actor: "", actress: "", villan: "", supporting: "" },
    crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
    posters: [],
    shows: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [posterPreviews, setPosterPreviews] = useState<string[]>([]);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------- Handlers ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof Omit<any, "_id" | "title" | "posters" | "shows">,
    key?: string
  ) => {
    const { value, name } = e.target;
    if (section && key) {
      setFormData({ ...formData, [section]: { ...formData[section], [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setFormData({ ...formData, posters: files });
    setPosterPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleTrailerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrailerFile(file);
      setTrailerPreview(URL.createObjectURL(file));
    }
  };

  const addShow = () => {
    setFormData({
      ...formData,
      shows: [
        ...formData.shows,
        {
          date: "",
          time: "",
          prices: {
            online: { adult: "", kids: "" },
            videoSpeed: { adult: "", kids: "" },
            others: { adult: "", kids: "" },
          },
        },
      ],
    });
  };

  const handleShowChange = (
    index: number,
    field: "date" | "time" | "prices",
    method: keyof Show["prices"] | null,
    type: keyof ShowPrices | null,
    value: string
  ) => {
    const shows = [...formData.shows];
    if (field === "time") shows[index].time = value;
    else if (field === "date") shows[index].date = value;
    else if (field === "prices" && method && type) {
      if (/\D/.test(value)) return;
      shows[index].prices[method][type] = value;
    }
    setFormData({ ...formData, shows });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trailerFile) return alert("Please upload a trailer!");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("hero", formData.cast.actor);
      data.append("heroine", formData.cast.actress);
      data.append("villain", formData.cast.villan);
      data.append("supportArtists", formData.cast.supporting);
      data.append("director", formData.crew.director);
      data.append("producer", formData.crew.producer);
      data.append("musicDirector", formData.crew.musicDirector);
      data.append("cinematographer", formData.crew.cinematographer);
      data.append("showTimings", JSON.stringify(formData.shows));
      formData.posters.forEach(file => data.append("photos", file));
      data.append("trailer", trailerFile);

      await axios.post(`${backend_url}/api/addDetails`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Movie saved successfully!");
      setFormData(initialFormData);
      setPosterPreviews([]);
      setTrailerFile(null);
      setTrailerPreview(null);
      onSave && onSave();
    } catch (err) {
      console.error(err);
      alert("Failed to save movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-6 max-w-3xl p-6 border rounded shadow space-y-4" onSubmit={handleSubmit}>
      {/* Movie Title */}
      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded"
      />

      {/* Cast */}
      <div>
        <label className="font-semibold">Cast:</label>
        {Object.keys(formData.cast).map(role => (
          <input
            key={role}
            type="text"
            placeholder={role.charAt(0).toUpperCase() + role.slice(1)}
            value={formData.cast[role as keyof Cast]}
            onChange={e => handleChange(e, "cast", role)}
            required
            className="border p-2 w-full rounded mb-2"
          />
        ))}
      </div>

      {/* Crew */}
      <div>
        <label className="font-semibold">Crew:</label>
        {Object.keys(formData.crew).map(role => (
          <input
            key={role}
            type="text"
            placeholder={role.replace(/([A-Z])/g, " $1")}
            value={formData.crew[role as keyof Crew]}
            onChange={e => handleChange(e, "crew", role)}
            required
            className="border p-2 w-full rounded mb-2"
          />
        ))}
      </div>

      {/* Posters */}
      <div>
        <label className="font-semibold">Posters (3 max):</label>
        <input type="file" multiple accept="image/*" onChange={handlePosterUpload} required />
        <div className="flex gap-2 mt-2">
          {posterPreviews.map((src, idx) => (
            <img key={idx} src={src} alt={`Poster ${idx + 1}`} className="w-24 h-24 object-cover border rounded" />
          ))}
        </div>
      </div>

      {/* Trailer */}
      <div>
        <label className="font-semibold">Trailer:</label>
        <input type="file" accept="video/*" onChange={handleTrailerUpload} required />
        {trailerPreview && (
          <div className="mt-2">
            <video src={trailerPreview} controls className="w-full max-w-md border rounded" />
          </div>
        )}
      </div>

      {/* Shows */}
      <div>
        <label className="font-semibold">Shows:</label>
        {formData.shows.map((show, idx) => (
          <div key={idx} className="border p-3 rounded mb-3 space-y-2">
            <input
              type="date"
              value={show.date}
              onChange={e => handleShowChange(idx, "date", null, null, e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="time"
              value={show.time}
              onChange={e => handleShowChange(idx, "time", null, null, e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              {(["online", "videoSpeed", "others"] as const).map(method => (
                <div key={method} className="border p-2 rounded space-y-1">
                  <p className="font-medium">{method}</p>
                  <input
                    type="text"
                    placeholder="Adult Price"
                    value={show.prices[method].adult}
                    onChange={e => handleShowChange(idx, "prices", method, "adult", e.target.value)}
                    className="border p-1 w-full rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kids Price"
                    value={show.prices[method].kids}
                    onChange={e => handleShowChange(idx, "prices", method, "kids", e.target.value)}
                    className="border p-1 w-full rounded"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="bg-gray-300 text-black px-2 py-1 rounded" onClick={addShow}>
          + Add Show
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Movie"}
      </button>
    </form>
  );
};

export default MovieForm;
