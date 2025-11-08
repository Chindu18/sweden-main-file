

"use client";
import { useState, useEffect } from "react";
import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
import axios from "axios";
import SeatBlocker from "@/components/SeatBlocker";
import {  backend_url } from "@/config"

interface Movie {
  _id: string;
  title: string;
  cast: { actor: string; actress: string };
  posters: string[];
  moviePosition: 1 | 2 | 3 | 4 | 5;
}


const Movies = () => {
  const backendurl = backend_url ;
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
  const [showSeatBlocker, setShowSeatBlocker] = useState(false);

  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [movie3, setMovie3] = useState<Movie | null>(null);
  const [movie4, setMovie4] = useState<Movie | null>(null);
  const [movie5, setMovie5] = useState<Movie | null>(null);

  const fetchCurrentMovies = async () => {
    try {
      const res = await axios.get(`${backendurl}/movie/currentMovie`);
      const data = res.data.data[0];
      if (data) {
        setCurrentGroupId(data._id);
        setMovie1(data.movie1 || null);
        setMovie2(data.movie2 || null);
        setMovie3(data.movie3 || null);
        setMovie4(data.movie4 || null);
        setMovie5(data.movie5 || null);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchCurrentMovies();
  }, []);

const handleDelete = async (position: number) => {
  try {
    const movieToDelete =
      position === 1
        ? movie1
        : position === 2
        ? movie2
        : position === 3
        ? movie3
        : position === 4
        ? movie4
        : movie5;

    if (!movieToDelete || !currentGroupId) return;

    // ✅ Only remove the movie reference from group (not delete movie)
    await axios.delete(`${backendurl}/movie/${currentGroupId}/${movieToDelete._id}`);

    fetchCurrentMovies(); // refresh after success
  } catch (err) {
    console.error("Failed to remove movie from group:", err);
  }
};


  const renderAddMovieForm = (position: number, movieData?: Movie) => (
    <AddMovieForm
      backendUrl={backend_url}
      onSaved={() => {
        setActiveMovieForm(null);
        fetchCurrentMovies();
      }}
      moviePosition={position as any}
      movieData={movieData as any}
    />
  );

  const renderMovieRow = (
    movie: Movie | null,
    position: number,
    colorClass: string
  ) => (
    <div
      key={position}
      className="w-full flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#000] rounded-2xl p-6 shadow-xl border border-gray-800 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
    >
      {/* 🎞️ Poster (Left side) */}
      <div className="w-full md:w-[350px] h-[220px] overflow-hidden rounded-xl shadow-lg">
        {movie ? (
          <img
            src={movie.posters[0]}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <button
            className={`${colorClass} w-full h-full text-white text-xl font-semibold rounded-xl flex items-center justify-center`}
            onClick={() =>
              setActiveMovieForm(activeMovieForm === position ? null : position)
            }
          >
            + Screen {position}
          </button>
        )}
      </div>

      {/* 🎬 Movie Details (Right side) */}
      <div className="flex flex-col flex-1 text-center md:text-left space-y-3">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          {movie ? movie.title : `Add Movie for Screen ${position}`}
        </h2>

        {movie && (
          <div className="text-gray-300 text-sm sm:text-base leading-relaxed">
            <b>Actor:</b> {movie.cast.actor} <br />
            <b>Actress:</b> {movie.cast.actress}
          </div>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          {movie ? (
            <>
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                onClick={() =>
                  setActiveMovieForm(activeMovieForm === position ? null : position)
                }
              >
                 Edit
              </button>
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                onClick={() => handleDelete(position)}
              >
                 Delete
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() =>
                setActiveMovieForm(activeMovieForm === position ? null : position)
              }
            >
              Add Movie
            </button>
          )}
        </div>

        {/* Form (Below buttons) */}
        {activeMovieForm === position &&
          renderAddMovieForm(
            position,
            position === 1
              ? movie1
              : position === 2
              ? movie2
              : position === 3
              ? movie3
              : position === 4
              ? movie4
              : movie5
          )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-10 bg-gradient-to-w from-[#000000] via-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center space-y-10">
      
       <button
        onClick={() => setShowSeatBlocker(true)}
        className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg sm:text-xl transition-all duration-300"
      >
         Manage Blocked Seats
      </button>
      <div className="flex flex-col w-full max-w-6xl space-y-8">
        {renderMovieRow(movie1, 1, "bg-gradient-to-r from-blue-600 to-cyan-500")}
        {renderMovieRow(movie2, 2, "bg-gradient-to-r from-green-600 to-lime-500")}
        {renderMovieRow(movie3, 3, "bg-gradient-to-r from-purple-600 to-pink-500")}
        {renderMovieRow(movie4, 4, "bg-gradient-to-r from-orange-600 to-yellow-500")}
        {renderMovieRow(movie5, 5, "bg-gradient-to-r from-pink-600 to-rose-500")}
      </div>

      

      {showSeatBlocker && (
        <SeatBlocker
          onClose={() => setShowSeatBlocker(false)}
          backendUrl={backend_url}
        />
      )}
    </div>
  );
};

export default Movies;
