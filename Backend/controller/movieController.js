import Movie from "../Models/Movies.js"; // singular, matches the variable

import MovieGroup from "../Models/currentMovie.js"

export const getMovie=async(req,res)=>{
    try {
         const response=await Movie.find();
          res.status(200).json({
            success:true,
            message:`movie data fetched success,total data is:${response.length}`,
            data:response
          })
    } catch (error) {
        res.json({
            success:false,
            message:`error is ocuured ,${error.message}`
        })
    }
}
export const getSingleMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Movie ID is required" });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    res.status(200).json({ success: true, message: "Movie fetched successfully", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error occurred: ${error.message}` });
  }
};




export const currentMovies = async (req, res) => {
  try {
    const response = await MovieGroup.find().populate("movie1 movie2 movie3");

    res.status(200).json({
      success: true,
      message: `current movie data fetched success, total data is: ${response.length}`,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error occurred: ${error.message}`,
    });
  }
};





export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Movie ID is required" });
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found or already deleted" });
    }

    res.status(200).json({ success: true, message: "Movie deleted successfully", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error occurred: ${error.message}` });
  }
};
