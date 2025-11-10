


// "use client";
// import { useState, useEffect } from "react";
// import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
// import axios from "axios";
// import SeatBlocker from "@/components/SeatBlocker";
// import { backend_url } from "@/config";

// interface Movie {
//   _id: string;
//   title: string;
//   cast: { actor: string; actress: string };
//   posters: string[];
//   moviePosition: number;
// }

// const Movies = () => {
//   const backendurl = backend_url;
//   const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
//   const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
//   const [showSeatBlocker, setShowSeatBlocker] = useState(false);
//   const [movies, setMovies] = useState<(Movie | null)[]>(Array(15).fill(null));
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deletePosition, setDeletePosition] = useState<number | null>(null);

//   // 🎬 Fetch current movies
//   const fetchCurrentMovies = async () => {
//     try {
//       const res = await axios.get(`${backendurl}/movie/currentMovie`);
//       const data = res.data.data[0];
//       if (data) {
//         setCurrentGroupId(data._id);
//         const movieArray = [];
//         for (let i = 1; i <= 15; i++) {
//           movieArray.push(data[`movie${i}`] || null);
//         }
//         setMovies(movieArray);
//       }
//     } catch (err) {
//       console.error("Failed to fetch movies:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentMovies();
//   }, []);

//   // 🗑️ Delete a movie (after confirmation)
//   const handleDelete = async () => {
//     if (deletePosition == null) return;
//     try {
//       const movieToDelete = movies[deletePosition - 1];
//       if (!movieToDelete || !currentGroupId) return;

//       await axios.delete(`${backendurl}/movie/${currentGroupId}/${movieToDelete._id}`);
//       fetchCurrentMovies();
//       setShowConfirm(false);
//     } catch (err) {
//       console.error("Failed to remove movie from group:", err);
//     }
//   };

//   // 🎨 Helper to render AddMovieForm
//   const renderAddMovieForm = (position: number, movieData?: Movie) => (
//     <AddMovieForm
//       backendUrl={backend_url}
//       onSaved={() => {
//         setActiveMovieForm(null);
//         fetchCurrentMovies();
//       }}
//       moviePosition={position as any}
//       movieData={movieData as any}
//     />
//   );

//   // 🎥 Gradient colors for 15 screens
//   const colorClasses = [
//     "from-blue-600 to-cyan-500",
//     "from-green-600 to-lime-500",
//     "from-purple-600 to-pink-500",
//     "from-orange-600 to-yellow-500",
//     "from-pink-600 to-rose-500",
//     "from-teal-600 to-emerald-500",
//     "from-sky-600 to-indigo-500",
//     "from-red-600 to-orange-500",
//     "from-yellow-600 to-amber-500",
//     "from-violet-600 to-fuchsia-500",
//     "from-lime-600 to-green-500",
//     "from-rose-600 to-pink-500",
//     "from-cyan-600 to-blue-500",
//     "from-amber-600 to-yellow-500",
//     "from-indigo-600 to-purple-500",
//   ];

//   // 🎞️ Render each movie row
//   const renderMovieRow = (movie: Movie | null, position: number, colorClass: string) => (
//     <div
//       key={position}
//       className="w-full flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#000] rounded-2xl p-6 shadow-xl border border-gray-800 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
//     >
//       {/* Poster */}
//       <div className="w-full md:w-[350px] h-[220px] overflow-hidden rounded-xl shadow-lg">
//         {movie ? (
//           <img src={movie.posters[0]} alt={movie.title} className="w-full h-full object-cover" />
//         ) : (
//           <button
//             className={`bg-gradient-to-r ${colorClass} w-full h-full text-white text-xl font-semibold rounded-xl flex items-center justify-center`}
//             onClick={() =>
//               setActiveMovieForm(activeMovieForm === position ? null : position)
//             }
//           >
//             + Screen {position}
//           </button>
//         )}
//       </div>

//       {/* Details */}
//       <div className="flex flex-col flex-1 text-center md:text-left space-y-3">
//         <h2 className="text-3xl font-bold text-white tracking-wide">
//           {movie ? movie.title : `Add Movie for Screen ${position}`}
//         </h2>

//         {movie && (
//           <div className="text-gray-300 text-sm sm:text-base leading-relaxed">
//             <b>Actor:</b> {movie.cast.actor} <br />
//             <b>Actress:</b> {movie.cast.actress}
//           </div>
//         )}

//         <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
//           {movie ? (
//             <>
//               <button
//                 className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
//                 onClick={() =>
//                   setActiveMovieForm(activeMovieForm === position ? null : position)
//                 }
//               >
//                 Edit
//               </button>

//               {/* 🧨 Confirm Delete Modal Trigger */}
//               <button
//                 className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
//                 onClick={() => {
//                   setDeletePosition(position);
//                   setShowConfirm(true);
//                 }}
//               >
//                 Delete
//               </button>
//             </>
//           ) : (
//             <button
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
//               onClick={() =>
//                 setActiveMovieForm(activeMovieForm === position ? null : position)
//               }
//             >
//               Add Movie
//             </button>
//           )}
//         </div>

//         {activeMovieForm === position &&
//           renderAddMovieForm(position, movie || undefined)}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-10 bg-gradient-to-w from-[#000000] via-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center space-y-10">
//       <button
//         onClick={() => setShowSeatBlocker(true)}
//         className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg sm:text-xl transition-all duration-300"
//       >
//         Manage Blocked Seats
//       </button>

//       <div className="flex flex-col w-full max-w-6xl space-y-8">
//         {movies.map((movie, index) =>
//           renderMovieRow(movie, index + 1, colorClasses[index % colorClasses.length])
//         )}
//       </div>

//       {/* ✅ Delete Confirmation Modal */}
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center animate-fadeIn">
//             <h2 className="text-xl font-semibold text-gray-800 mb-3">
//               Confirm Delete
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this movie?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSeatBlocker && (
//         <SeatBlocker
//           onClose={() => setShowSeatBlocker(false)}
//           backendUrl={backend_url}
//         />
//       )}
//     </div>
//   );
// };

// export default Movies;


// "use client";
// import { useState, useEffect } from "react";
// import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
// import axios from "axios";
// import SeatBlocker from "@/components/SeatBlocker";
// import { backend_url } from "@/config";

// interface Movie {
//   _id: string;
//   title: string;
//   cast: { actor: string; actress: string };
//   posters: string[];
//   moviePosition: number;
// }

// const Movies = () => {
//   const backendurl = backend_url;
//   const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
//   const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
//   const [showSeatBlocker, setShowSeatBlocker] = useState(false);
//   const [movies, setMovies] = useState<(Movie | null)[]>(Array(5).fill(null)); // show 5 by default
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [deletePosition, setDeletePosition] = useState<number | null>(null);

//   // 🎬 Fetch current movies
//   const fetchCurrentMovies = async () => {
//     try {
//       const res = await axios.get(`${backendurl}/movie/currentMovie`);
//       const data = res.data.data[0];
//       if (data) {
//         setCurrentGroupId(data._id);
//         const movieArray = [];
//         for (let i = 1; i <= 15; i++) {
//           movieArray.push(data[`movie${i}`] || null);
//         }
//         // only show first 5 or existing ones
//         setMovies(movieArray.slice(0, 5));
//       }
//     } catch (err) {
//       console.error("Failed to fetch movies:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentMovies();
//   }, []);

//   // 🗑️ Delete a movie
//   const handleDelete = async () => {
//     if (deletePosition == null) return;
//     try {
//       const movieToDelete = movies[deletePosition - 1];
//       if (!movieToDelete || !currentGroupId) return;
//       await axios.delete(`${backendurl}/movie/${currentGroupId}/${movieToDelete._id}`);
//       fetchCurrentMovies();
//       setShowConfirm(false);
//     } catch (err) {
//       console.error("Failed to remove movie from group:", err);
//     }
//   };

//   const renderAddMovieForm = (position: number, movieData?: Movie) => (
//     <AddMovieForm
//       backendUrl={backend_url}
//       onSaved={() => {
//         setActiveMovieForm(null);
//         fetchCurrentMovies();
//       }}
//       moviePosition={position as any}
//       movieData={movieData as any}
//     />
//   );

//   const colorClasses = [
//     "from-blue-600 to-cyan-500",
//     "from-green-600 to-lime-500",
//     "from-purple-600 to-pink-500",
//     "from-orange-600 to-yellow-500",
//     "from-pink-600 to-rose-500",
//     "from-teal-600 to-emerald-500",
//     "from-sky-600 to-indigo-500",
//     "from-red-600 to-orange-500",
//     "from-yellow-600 to-amber-500",
//     "from-violet-600 to-fuchsia-500",
//     "from-lime-600 to-green-500",
//     "from-rose-600 to-pink-500",
//     "from-cyan-600 to-blue-500",
//     "from-amber-600 to-yellow-500",
//     "from-indigo-600 to-purple-500",
//   ];

//   const renderMovieRow = (movie: Movie | null, position: number, colorClass: string) => (
//     <div
//       key={position}
//       className="w-full flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#000] rounded-2xl p-6 shadow-xl border border-gray-800 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
//     >
//       {/* Poster */}
//       <div className="w-full md:w-[350px] h-[220px] overflow-hidden rounded-xl shadow-lg">
//         {movie ? (
//           <img src={movie.posters[0]} alt={movie.title} className="w-full h-full object-cover" />
//         ) : (
//           <button
//             className={`bg-gradient-to-r ${colorClass} w-full h-full text-white text-xl font-semibold rounded-xl flex items-center justify-center`}
//             onClick={() => setActiveMovieForm(position)}
//           >
//             + Screen {position}
//           </button>
//         )}
//       </div>

//       {/* Details */}
//       <div className="flex flex-col flex-1 text-center md:text-left space-y-3">
//         <h2 className="text-3xl font-bold text-white tracking-wide">
//           {movie ? movie.title : `Add Movie for Screen ${position}`}
//         </h2>

//         {movie && (
//           <div className="text-gray-300 text-sm sm:text-base leading-relaxed">
//             <b>Actor:</b> {movie.cast.actor} <br />
//             <b>Actress:</b> {movie.cast.actress}
//           </div>
//         )}

//         <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
//           {movie ? (
//             <>
//               <button
//                 className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
//                 onClick={() => setActiveMovieForm(position)}
//               >
//                 Edit
//               </button>

//               <button
//                 className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
//                 onClick={() => {
//                   setDeletePosition(position);
//                   setShowConfirm(true);
//                 }}
//               >
//                 Delete
//               </button>
//             </>
//           ) : (
//             <button
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
//               onClick={() => setActiveMovieForm(position)}
//             >
//               Add Movie
//             </button>
//           )}
//         </div>

//         {activeMovieForm === position && renderAddMovieForm(position, movie || undefined)}
//       </div>
//     </div>
//   );

//   // 🆕 Add new movie slot when clicking "Add Movie"
//   const handleAddMovie = () => {
//     if (movies.length >= 15) return alert("You reached the maximum of 15 screens.");
//     setMovies([...movies, null]); // add one more slot
//   };

//   return (
//     <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-10 bg-gradient-to-w from-[#000000] via-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center space-y-10">
//       {/* Top Buttons */}
//       <div className="flex flex-wrap justify-center gap-6 mt-4">
//         <button
//           onClick={handleAddMovie}
//           className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg text-lg transition-all duration-300"
//         >
//           + Add Movie
//         </button>
//         <button
//           onClick={() => setShowSeatBlocker(true)}
//           className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg transition-all duration-300"
//         >
//           Manage Blocked Seats
//         </button>
//       </div>

//       {/* Movie list */}
//       <div className="flex flex-col w-full max-w-6xl space-y-8">
//         {movies.map((movie, index) =>
//           renderMovieRow(movie, index + 1, colorClasses[index % colorClasses.length])
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center animate-fadeIn">
//             <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Delete</h2>
//             <p className="text-gray-600 mb-6">Are you sure you want to delete this movie?</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Seat Blocker */}
//       {showSeatBlocker && (
//         <SeatBlocker onClose={() => setShowSeatBlocker(false)} backendUrl={backend_url} />
//       )}
//     </div>
//   );
// };

// export default Movies;






"use client";
import { useState, useEffect } from "react";
import { AddMovieForm } from "@/components/addMovie/AddMovieForm";
import axios from "axios";
import SeatBlocker from "@/components/SeatBlocker";
import { backend_url } from "@/config";

interface Movie {
  _id: string;
  title: string;
  cast: { actor: string; actress: string };
  posters: string[];
  moviePosition: number;
}

const Movies = () => {
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [activeMovieForm, setActiveMovieForm] = useState<number | null>(null);
  const [showSeatBlocker, setShowSeatBlocker] = useState(false);
  const [movies, setMovies] = useState<(Movie | null)[]>(Array(15).fill(null));
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletePosition, setDeletePosition] = useState<number | null>(null);

  // Fetch current movies
  const fetchCurrentMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/currentMovie`);
      const data = res.data.data[0];
      if (data) {
        setCurrentGroupId(data._id);
        const movieArray = [];
        for (let i = 1; i <= 15; i++) {
          movieArray.push(data[`movie${i}`] || null);
        }
        setMovies(movieArray);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchCurrentMovies();
  }, []);

  // Delete a movie
  const handleDelete = async () => {
    if (deletePosition == null) return;
    try {
      const movieToDelete = movies[deletePosition - 1];
      if (!movieToDelete || !currentGroupId) return;

      await axios.delete(`${backend_url}/movie/${currentGroupId}/${movieToDelete._id}`);
      fetchCurrentMovies();
      setShowConfirm(false);
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
    "from-lime-600 to-green-500",
    "from-rose-600 to-pink-500",
    "from-cyan-600 to-blue-500",
    "from-amber-600 to-yellow-500",
    "from-indigo-600 to-purple-500",
  ];

  // Render movie card
  const renderMovieRow = (movie: Movie | null, position: number, colorClass: string) => (
    <div
      key={position}
      className="w-full md:w-[48%] flex flex-col items-center gap-4 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#000] rounded-2xl p-4 shadow-xl border border-gray-800 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all duration-300"
    >
      {/* Poster */}
      <div className="w-full h-[180px] overflow-hidden rounded-xl shadow-lg">
        {movie ? (
          <img src={movie.posters[0]} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <button
            className={`bg-gradient-to-r ${colorClass} w-full h-full text-white text-xl font-semibold rounded-xl flex items-center justify-center`}
            onClick={() =>
              setActiveMovieForm(activeMovieForm === position ? null : position)
            }
          >
            + Screen {position}
          </button>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {movie ? movie.title : `Add Movie for Screen ${position}`}
        </h2>

        {movie && (
          <div className="text-gray-300 text-sm leading-relaxed">
            <b>Actor:</b> {movie.cast.actor} <br />
            <b>Actress:</b> {movie.cast.actress}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {movie ? (
            <>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                onClick={() =>
                  setActiveMovieForm(activeMovieForm === position ? null : position)
                }
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                onClick={() => {
                  setDeletePosition(position);
                  setShowConfirm(true);
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() =>
                setActiveMovieForm(activeMovieForm === position ? null : position)
              }
            >
              Add Movie
            </button>
          )}
        </div>

        {activeMovieForm === position && renderAddMovieForm(position, movie || undefined)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-w from-[#000000] via-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center space-y-6">
      <button
        onClick={() => setShowSeatBlocker(true)}
        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow-lg text-lg"
      >
        Manage Blocked Seats
      </button>

      {/* Movie cards in grid: 2 per row */}
      <div className="flex flex-wrap justify-between w-full max-w-6xl gap-4 mt-6">
        {movies.map((movie, index) =>
          renderMovieRow(movie, index + 1, colorClasses[index % colorClasses.length])
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center animate-fadeIn">
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
