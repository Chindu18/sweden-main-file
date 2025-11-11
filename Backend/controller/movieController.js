



import Movie from "../Models/Movies.js";
import MovieGroup from "../Models/currentMovie.js";

export const getMovie = async (req, res) => {
  try {
    const response = await Movie.find();
    res.status(200).json({
      success: true,
      message: `movie data fetched success, total data is: ${response.length}`,
      data: response,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `error occurred: ${error.message}`,
    });
  }
};

export const getSingleMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ success: false, message: "Movie ID required" });

    const movie = await Movie.findById(id);
    if (!movie)
      return res.status(404).json({ success: false, message: "Movie not found" });

    res.status(200).json({ success: true, message: "Fetched successfully", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
};

// export const currentMovies = async (req, res) => {
//   try {
//     const response = await MovieGroup.find().populate("movie1 movie2 movie3 movie4 movie5");

//     res.status(200).json({
//       success: true,
//       message: `Current movie data fetched successfully. Total: ${response.length}`,
//       data: response,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `Error occurred: ${error.message}`,
//     });
//   }
// };



// export const removeMovieFromGroup = async (req, res) => {
//   try {
//     const { groupId, movieId } = req.params;

//     const group = await MovieGroup.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ success: false, message: "Group not found" });
//     }

//     let updated = false;
//     ["movie1", "movie2", "movie3", "movie4", "movie5"].forEach((key) => {
//       if (group[key]?.toString() === movieId) {
//         group[key] = undefined;
//         updated = true;
//       }
//     });

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Movie not found in this group" });
//     }

//     await group.save();

//     res.status(200).json({
//       success: true,
//       message: "Movie removed from group successfully",
//       data: group,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error removing movie from group",
//       error: error.message,
//     });
//   }
// };




// export const removeMovieFromGroup = async (req, res) => {
//   try {
//     const { groupId, movieId } = req.params;

//     const group = await MovieGroup.findById(groupId);
//     if (!group) {
//       return res.status(404).json({ success: false, message: "Group not found" });
//     }

//     let updated = false;
//     for (let i = 1; i <= 15; i++) {
//       const key = `movie${i}`;
//       if (group[key]?.toString() === movieId) {
//         group[key] = undefined;
//         updated = true;
//       }
//     }

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Movie not found in this group" });
//     }

//     await group.save();

//     res.status(200).json({
//       success: true,
//       message: "Movie removed from group successfully",
//       data: group,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error removing movie from group",
//       error: error.message,
//     });
//   }
// };

// controller



export const currentMovies = async (req, res) => {
  try {
    // Get the latest MovieGroup document
    const group = await MovieGroup.findOne().lean();

    if (!group) {
      return res.status(200).json({
        success: true,
        message: "No current movie group found",
        data: [],
        groupId: null, // no group
      });
    }

    // Collect all movie IDs
    let movieIds = [];

    if (Array.isArray(group.movies)) {
      movieIds.push(...group.movies);
    }

    for (let i = 1; i <= 15; i++) {
      const key = `movie${i}`;
      if (group[key]) movieIds.push(group[key]);
    }

    // Fetch full movie details
    const movies = await Movie.find({ _id: { $in: movieIds } }).lean();

    res.status(200).json({
      success: true,
      message: `Fetched ${movies.length} current movies`,
      data: movies,        // movie list
      groupId: group._id,  // send group id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const removeMovieFromGroup = async (req, res) => {
  try {
    const { groupId, movieId } = req.params;
    const group = await MovieGroup.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    // Check movies array first
    let index = group.movies.findIndex(m => m.toString() === movieId);
    if (index !== -1) {
      group.movies.splice(index, 1);
    } else {
      // Check old movie1...movie15 fields
      let found = false;
      for (let i = 1; i <= 15; i++) {
        const key = `movie${i}`;
        if (group[key]?.toString() === movieId) {
          group[key] = undefined;
          found = true;
          break;
        }
      }
      if (!found) return res.status(404).json({ success: false, message: "Movie not in group" });
    }

    await group.save();
    res.status(200).json({ success: true, message: "Movie removed from group successfully", data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, message: "Movie ID required" });

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie)
      return res.status(404).json({ success: false, message: "Movie not found" });

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
};

