

"use client";
import React, { useState } from "react";
import axios from "axios";
import { ShowForm, ShowType } from "./ShowForm";
import { backend_url } from "@/config";
import CampaignToggle from "../campaignmail/CampaignToggle";

const backend = backend_url;

interface MovieData {
  _id?: string;
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
  movieData?: MovieData;
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
  shows: (ShowType & { isNew?: boolean })[];
}

// ---------- Reusable UI Elements ----------
const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({
  htmlFor,
  children,
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-semibold leading-6 text-slate-900 dark:text-white"
  >
    {children}
  </label>
);

const TextInput = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { dense?: boolean }
) => (
  <input
    {...props}
    className={[
      "mt-1 w-full rounded-xl border border-slate-300 bg-white/90 px-4",
      props.dense ? "py-2.5" : "py-3.5",
      "text-slate-900 placeholder-slate-400 shadow-sm",
      "focus:outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-400",
      "dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-400 dark:border-slate-700 dark:focus:ring-white/10",
      props.className || "",
    ].join(" ")}
  />
);

const Section: React.FC<
  React.PropsWithChildren<{ title: string; subtitle?: string }>
> = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
    <div className="mb-4">
      <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </section>
);

export const AddMovieForm: React.FC<AddMovieFormProps> = ({
  backendUrl,
  onSaved,
  moviePosition,
  movieData,
}) => {
  const isEdit = !!movieData;

  const [formData, setFormData] = useState<FormDataType>({
    title: movieData?.title || "",
    cast: movieData?.cast || {
      actor: "",
      actress: "",
      villan: "",
      supporting: "",
    },
    crew: movieData?.crew || {
      director: "",
      producer: "",
      musicDirector: "",
      cinematographer: "",
    },
    posters: [],
    trailer: movieData?.trailer || "",
    shows:
      movieData?.shows?.map((show) => ({
        ...show,
        isNew: false,
      })) || [],
  });

  const [posterPreviews, setPosterPreviews] = useState<string[]>(
    movieData?.posters || []
  );
  const [loading, setLoading] = useState(false);

  // ---------- Input Handlers ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: keyof FormDataType,
    key?: string
  ) => {
    const { value, name } = e.target;
    if (section && key) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, string>),
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as keyof FormDataType]: value as any,
      }));
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setFormData((prev) => ({ ...prev, posters: files }));
    setPosterPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleShowChange = (
    index: number,
    field: "date" | "time" | "prices" | "collectors" | "blockedSeats",
    subField?: "adult" | "kids" | "collectorName",
    collectorIndex?: number,
    value?: string | number[]
  ) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      const show = { ...shows[index] };

      if (!show.isNew) return prev;

      if (field === "blockedSeats") show.blockedSeats = value as number[];
      else if (field === "collectors" && collectorIndex !== undefined && subField) {
        show.collectors[collectorIndex][subField] = value as string;
      } else if (field === "prices" && collectorIndex !== undefined && subField) {
        const priceKey = collectorIndex === 0 ? "online" : "videoSpeed";
        (show.prices as any)[priceKey][subField] = value as string;
      } else (show as any)[field] = value;

      shows[index] = show;
      return { ...prev, shows };
    });
  };

  const addShow = () => {
    setFormData((prev) => ({
      ...prev,
      shows: [
        ...prev.shows,
        {
          date: "",
          time: "",
          prices: {
            online: { adult: "", kids: "" },
            videoSpeed: { adult: "", kids: "" },
          },
          collectors: [],
          blockedSeats: [],
          isNew: true,
        },
      ],
    }));
  };

  const addCollector = (showIndex: number) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev;
      shows[showIndex].collectors.push({
        collectorName: "",
        adult: "",
        kids: "",
      });
      return { ...prev, shows };
    });
  };

  const removeCollector = (showIndex: number, collectorIndex: number) => {
    setFormData((prev) => {
      const shows = [...prev.shows];
      if (!shows[showIndex].isNew) return prev;
      shows[showIndex].collectors.splice(collectorIndex, 1);
      return { ...prev, shows };
    });
  };

  // ---------- Submit Handler ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title || "");
      data.append("hero", formData.cast.actor || "");
      data.append("heroine", formData.cast.actress || "");
      data.append("villain", formData.cast.villan || "");
      data.append("supportArtists", formData.cast.supporting || "");
      data.append("director", formData.crew.director || "");
      data.append("producer", formData.crew.producer || "");
      data.append("musicDirector", formData.crew.musicDirector || "");
      data.append("cinematographer", formData.crew.cinematographer || "");
      data.append("trailer", formData.trailer || "");
      data.append("showTimings", JSON.stringify(formData.shows || []));
      data.append("moviePosition", String(moviePosition));

      formData.posters.forEach((file) => data.append("photos", file));

      if (isEdit && movieData?._id) {
        await axios.put(`${backend}/api/update/${movieData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Movie updated successfully!");
      } else {
        await axios.post(`${backend}/api/addDetails`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Movie added successfully!");
      }

      onSaved();
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Failed to save movie.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- JSX ----------
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-10 max-w-5xl space-y-6 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isEdit ? "Edit Movie" : "Add New Movie"}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Fill in the movie details below.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Save Movie"}
        </button>
      </div>

      <CampaignToggle />

      {/* Title */}
      <Section title="Title">
        <Label htmlFor="title">Movie Title</Label>
        <TextInput
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., The Great Adventure"
          required
          disabled={isEdit}
        />
      </Section>

      {/* Cast */}
      <Section title="Cast">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(formData.cast).map((role) => (
            <div key={role}>
              <Label htmlFor={`cast-${role}`}>{role}</Label>
              <TextInput
                id={`cast-${role}`}
                type="text"
                placeholder={role}
                value={(formData.cast as any)[role]}
                onChange={(e) => handleChange(e, "cast", role)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Crew */}
      <Section title="Crew">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(formData.crew).map((role) => (
            <div key={role}>
              <Label htmlFor={`crew-${role}`}>{role}</Label>
              <TextInput
                id={`crew-${role}`}
                type="text"
                placeholder={role}
                value={(formData.crew as any)[role]}
                onChange={(e) => handleChange(e, "crew", role)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Trailer */}
      <Section title="Trailer">
        <Label htmlFor="trailer">Trailer URL</Label>
        <TextInput
          id="trailer"
          type="url"
          name="trailer"
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.trailer}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, trailer: e.target.value }))
          }
        />
        {formData.trailer && (
          <iframe
            src={formData.trailer.replace("watch?v=", "embed/")}
            className="mt-3 aspect-video w-full rounded-xl border border-slate-200 shadow-sm dark:border-slate-800"
            allowFullScreen
          ></iframe>
        )}
      </Section>

      {/* Posters */}
      <Section title="Posters" subtitle="Upload up to 3 posters">
        <input
          id="posters"
          type="file"
          multiple
          accept="image/*"
          onChange={handlePosterUpload}
          className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-800 dark:text-slate-300 dark:file:bg-white dark:file:text-slate-900 dark:hover:file:bg-slate-100"
        />
        {!!posterPreviews.length && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {posterPreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Poster ${idx + 1}`}
                className="aspect-[1/1] w-full rounded-xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        )}
      </Section>

      {/* Shows */}
      <Section title="Shows" subtitle="Add new shows; old ones are locked">
        {formData.shows.map((show, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Show #{idx + 1} {show.isNew ? "• New" : "• Locked"}
            </p>
            <ShowForm
              show={show}
              index={idx}
              onChange={handleShowChange}
              onAddCollector={addCollector}
              onRemoveCollector={removeCollector}
              readOnly={!show.isNew}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addShow}
          className="mt-3 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          + Add New Show
        </button>
      </Section>
       <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Save Movie"}
        </button>
    </form>
  );
};
