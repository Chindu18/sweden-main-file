

// import mongoose from "mongoose";

// const currentMovieSchema = new mongoose.Schema(
//   {
//     movie1: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//     movie2: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//     movie3: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//     movie4: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//     movie5: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("MovieGroup", currentMovieSchema);


import mongoose from "mongoose";

const currentMovieSchema = new mongoose.Schema(
  {
    movie1: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie2: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie3: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie4: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie5: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie6: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie7: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie8: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie9: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie10: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie11: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie12: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie13: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie14: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    movie15: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  },
  { timestamps: true }
);

export default mongoose.model("MovieGroup", currentMovieSchema);
