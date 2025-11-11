
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
import SeatBlocker from "@/components/SeatBlocker";
import { backend_url } from "@/config";

interface Movie {
  _id: string;
  title: string;
  cast: { actor: string; actress: string };
  posters: string[];
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);
  const [showSeatBlocker, setShowSeatBlocker] = useState(false);

  // Fetch current movies dynamically
const [groupId, setGroupId] = useState<string | null>(null);

// Fetch current movies dynamically
const fetchCurrentMovies = async () => {
  try {
    const res = await axios.get(`${backend_url}/movie/currentMovie`);
    if (res.data?.data) {
      setMovies(res.data.data);
      setGroupId(res.data.groupId); // store the groupId
    }
  } catch (err) {
    console.error("❌ Failed to fetch movies:", err);
  }
};

// Delete a movie
const handleDelete = async () => {
  if (!deleteMovieId || !groupId) return;

  try {
    await axios.delete(`${backend_url}/movie/${groupId}/${deleteMovieId}`); // ✅ deleteMovieId must be a string
    alert("Movie removed successfully!");
    fetchCurrentMovies();
    setShowConfirm(false);
  } catch (err: any) {
    console.error("❌ Failed to delete movie:", err);
    alert(err.response?.data?.message || "Failed to delete movie.");
  }
};



  useEffect(() => {
    fetchCurrentMovies();
  }, []);

  // Delete a movie



  const colorClasses = [
    "from-blue-600 to-cyan-500",
    "from-green-600 to-lime-500",
    "from-purple-600 to-pink-500",
    "from-orange-600 to-yellow-500",
    "from-pink-600 to-rose-500",
    "from-teal-600 to-emerald-500",
    "from-sky-600 to-indigo-500",
    "from-red-600 to-orange-500",
    "from-yellow-600 to-amber-500",
    "from-violet-600 to-fuchsia-500",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 flex flex-col items-center space-y-10">
      {/* Header Buttons */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => setShowSeatBlocker(true)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg"
        >
          Manage Blocked Seats
        </button>
        <button
          onClick={() => {
            setEditMovie(null);
            setShowForm(!showForm);
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg text-lg"
        >
          {showForm ? "Close Form" : "Add Movie"}
        </button>
      </div>

      {/* Add Movie Form */}
      {showForm && (
        <div className="w-full max-w-4xl bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-lg">
          <AddMovieForm
            backendUrl={backend_url}
            onSaved={() => {
              setShowForm(false);
              fetchCurrentMovies();
            }}
            movieData={editMovie as any}
          />
        </div>
      )}

      {/* Movies Grid */}
      <div className="flex flex-wrap justify-center md:justify-start gap-6 w-full max-w-6xl">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div
              key={movie._id}
              className={`bg-gradient-to-r ${colorClasses[index % colorClasses.length]} w-full sm:w-[48%] md:w-[30%] lg:w-[22%] rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105`}
            >
              <img
                src={movie.posters?.[0]}
                alt={movie.title}
                className="w-full h-[230px] object-cover"
              />
              <div className="p-4 text-center bg-black/70">
                <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                <p className="text-sm text-gray-300">
                  <b>Actor:</b> {movie.cast?.actor || "N/A"} <br />
                  <b>Actress:</b> {movie.cast?.actress || "N/A"}
                </p>
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditMovie(movie);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </button>
                 <button
  onClick={() => {
    setDeleteMovieId(movie._id);
    setShowConfirm(true);
  }}
  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
>
  Delete
</button>

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full text-lg">
            🎬 No movies currently available.
          </p>
        )}
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this movie?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Blocker */}
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
