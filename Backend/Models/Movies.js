import mongoose from "mongoose";

// ----------------- Sub-schemas -----------------
const showPricesSchema = new mongoose.Schema({
  adult: { type: Number, default: 0 },
  kids: { type: Number, default: 0 },
});

const collectorSchema = new mongoose.Schema({
  collectorName: { type: String, required: true },
  adult: { type: Number, required: true }, // changed to Number
  kids: { type: Number, required: true },  // changed to Number
});

const showSchema = new mongoose.Schema({
  date: { type: Date, required: true },   // e.g., 2025-10-09
  time: { type: String, required: true }, // e.g., "10:00 AM"

  prices: {
    online: { type: showPricesSchema, required: true, default: () => ({ adult: 0, kids: 0 }) },
    videoSpeed: { type: showPricesSchema, required: true, default: () => ({ adult: 0, kids: 0 }) },
    // add more methods here if frontend requires, e.g., "others"
  },

  collectors: { type: [collectorSchema], default: [] }, // optional array
});

// ----------------- Main Movie Schema -----------------
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    cast: {
      actor: { type: String, required: true, default: "" },
      actress: { type: String, required: true, default: "" },
      villan: { type: String, required: true, default: "" },
      supporting: { type: String, required: true, default: "" },
    },

    crew: {
      director: { type: String, required: true, default: "" },
      producer: { type: String, required: true, default: "" },
      musicDirector: { type: String, required: true, default: "" },
      cinematographer: { type: String, required: true, default: "" },
    },

    posters: { type: [String], required: true }, // uploaded image URLs
    trailer: { type: String, required: true },   // URL string

    shows: { type: [showSchema], required: true }, // array of shows
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
