"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShowForm, ShowType } from "./ShowForm";

interface MovieData {
  title: string;
  cast: {
    actor: string;
    actress: string;
    villan: string;
    supporting: string;
  };
  crew: {
    director: string;
    producer: string;
    musicDirector: string;
    cinematographer: string;
  };
  posters: string[];
  trailer: string;
  shows: ShowType[];
}

interface AddMovieFormProps {
  backendUrl: string;
  onSaved: () => void;
  moviePosition: 1 | 2 | 3;
  movieData?: MovieData; // for editing
}

interface FormDataType {
  title: string;
  cast: {
    actor: string;
    actress: string;
    villan: string;
    supporting: string;
  };
  crew: {
    director: string;
    producer: string;
    musicDirector: string;
    cinematographer: string;
  };
  posters: File[];
  trailer: string;
  shows: (ShowType & { isNew?: boolean })[]; // mark new shows
}

export const AddMovieForm: React.FC<AddMovieFormProps> = ({
  backendUrl,
  onSaved,
  moviePosition,
  movieData,
}) => {
  const isEdit = !!movieData;

  const [formData, setFormData] = useState<FormDataType>({
    title: movieData?.title || "",
    cast: movieData?.cast || { actor: "", actress: "", villan: "", supporting: "" },
    crew: movieData?.crew || { director: "", producer: "", musicDirector: "", cinematographer: "" },
    posters: [],
    trailer: movieData?.trailer || "",
    shows: movieData?.shows.map(show => ({ ...show, isNew: false })) || [],
  });

  const [posterPreviews, setPosterPreviews] = useState<string[]>(movieData?.posters || []);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof FormDataType,
    key?: string
  ) => {
    const { value } = e.target;
    if (section && key) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...(prev[section] as Record<string, string>), [key]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: value }));
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setFormData(prev => ({ ...prev, posters: files }));
    setPosterPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleShowChange = (
    index: number,
    field: "date" | "time" | "prices" | "collectors" | "blockedSeats",
    subField?: "adult" | "kids" | "collectorName",
    collectorIndex?: number,
    value?: string | number[]
  ) => {
    setFormData(prev => {
      const shows = [...prev.shows];
      const show = shows[index];

      if (!show.isNew) return prev; // lock old shows

      if (field === "blockedSeats") show.blockedSeats = value as number[];
      else if (field === "collectors" && collectorIndex !== undefined && subField) {
        show.collectors[collectorIndex][subField] = value as string;
      } else if (field === "prices" && collectorIndex !== undefined && subField) {
        const priceKey = collectorIndex === 0 ? "online" : "videoSpeed";
        show.prices[priceKey][subField] = value as string;
      } else show[field] = value as string;

      shows[index] = show;
      return { ...prev, shows };
    });
  };

  const addShow = () => {
    setFormData(prev => ({
      ...prev,
      shows: [
        ...prev.shows,
        {
          date: "",
          time: "",
          prices: { online: { adult: "", kids: "" }, videoSpeed: { adult: "", kids: "" } },
          collectors: [],
          blockedSeats: [],
          isNew: true, // mark as new show
        },
      ],
    }));
  };

  const addCollector = (showIndex: number) => {
    setFormData(prev => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev; // cannot add collector to old show
      shows[showIndex].collectors.push({ collectorName: "", adult: "", kids: "" });
      return { ...prev, shows };
    });
  };

  const removeCollector = (showIndex: number, collectorIndex: number) => {
    setFormData(prev => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev;
      shows[showIndex].collectors.splice(collectorIndex, 1);
      return { ...prev, shows };
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
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

    data.append("trailer", formData.trailer);
    data.append("showTimings", JSON.stringify(formData.shows));
    data.append("moviePosition", moviePosition.toString());

    formData.posters.forEach((file) => data.append("photos", file));

    if (isEdit) {
      // ✅ PUT call for editing
      await axios.put(`${backendUrl}/api/update/${movieData?._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Movie updated successfully!");
    } else {
      // ✅ POST call for new movie
      await axios.post(`${backendUrl}/api/addDetails`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Movie saved successfully!");
    }

    onSaved();
  } catch (err) {
    console.error(err);
    alert("Failed to save movie.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 border rounded shadow space-y-4 max-w-3xl">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Movie Title"
        className="border p-2 w-full rounded"
        required
        disabled={isEdit}
      />

      {Object.keys(formData.cast).map(role => (
        <input
          key={role}
          type="text"
          placeholder={role}
          value={formData.cast[role as keyof typeof formData.cast]}
          onChange={e => handleChange(e, "cast", role)}
          className="border p-2 w-full rounded"
          required
        />
      ))}

      {Object.keys(formData.crew).map(role => (
        <input
          key={role}
          type="text"
          placeholder={role}
          value={formData.crew[role as keyof typeof formData.crew]}
          onChange={e => handleChange(e, "crew", role)}
          className="border p-2 w-full rounded"
          required
        />
      ))}

      <input
        type="url"
        name="trailer"
        placeholder="Trailer URL"
        value={formData.trailer}
        onChange={e => setFormData(prev => ({ ...prev, trailer: e.target.value }))}
        className="border p-2 w-full rounded"
      />
      {formData.trailer && (
        <iframe
          src={formData.trailer.replace("watch?v=", "embed/")}
          title="Trailer"
          className="w-full h-60 border rounded"
          allowFullScreen
        ></iframe>
      )}

      <input type="file" multiple accept="image/*" onChange={handlePosterUpload} />
      <div className="flex gap-2 mt-2">
        {posterPreviews.map((src, idx) => (
          <img key={idx} src={src} className="w-24 h-24 object-cover rounded" />
        ))}
      </div>

      <div>
        {formData.shows.map((show, idx) => (
          <ShowForm
            key={idx}
            show={show}
            index={idx}
            onChange={handleShowChange}
            onAddCollector={addCollector}
            onRemoveCollector={removeCollector}
            readOnly={!show.isNew} // old shows read-only, new shows editable
          />
        ))}
        <button type="button" className="bg-gray-300 px-2 py-1 rounded mt-2" onClick={addShow}>
          + Add New Show
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full"
      >
        {loading ? "Saving..." : "Save Movie"}
      </button>
    </form>
  );
};
