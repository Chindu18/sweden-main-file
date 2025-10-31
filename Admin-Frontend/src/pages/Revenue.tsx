"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

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
    soder: ShowPrices;
  };
}

interface Movie {
  _id: string;
  title: string;
  cast: Cast;
  crew: Crew;
  posters: string[];
  shows: Show[];
}

const Revenue = () => {
  const backend_url = "http://localhost:8004";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [revenueData, setRevenueData] = useState<
    Record<string, { paid: number; pending: number }>
  >({});
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ---------------------- Fetch Movies & Revenue ----------------------
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/getmovie`);

      // ✅ Safely extract movie data
      const moviesData: Movie[] =
        Array.isArray(res.data?.data) ? res.data.data : [];

      setMovies(moviesData);

      const revData: Record<string, { paid: number; pending: number }> = {};

      // ✅ Fetch revenue for each movie in parallel
      await Promise.all(
        moviesData.map(async (movie) => {
          try {
            const [pendingResp, paidResp] = await Promise.all([
              axios.get(`${backend_url}/dashboard/pending`, {
                params: {
                  movieName: movie.title,
                  paymentStatus: "pending",
                },
              }),
              axios.get(`${backend_url}/dashboard/pending`, {
                params: {
                  movieName: movie.title,
                  paymentStatus: "paid",
                },
              }),
            ]);

            revData[movie.title] = {
              pending:
                pendingResp.data?.data?.reduce(
                  (sum: number, b: any) => sum + (b.totalAmount || 0),
                  0
                ) || 0,
              paid:
                paidResp.data?.data?.reduce(
                  (sum: number, b: any) => sum + (b.totalAmount || 0),
                  0
                ) || 0,
            };
          } catch (err) {
            console.warn(`Error fetching revenue for ${movie.title}:`, err);
            revData[movie.title] = { paid: 0, pending: 0 };
          }
        })
      );

      setRevenueData(revData);
    } catch (err) {
      console.error("Error fetching movies or revenue:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getPosterSrc = (poster: File | string) =>
    poster instanceof File ? URL.createObjectURL(poster) : poster;

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Movie Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(movies) && movies.length > 0 ? (
          [...movies].reverse().map((movie) => (
            <div
              key={movie._id}
              className="cursor-pointer hover:shadow-lg transition rounded-lg overflow-hidden"
              onClick={() => setModalMovie(movie)}
            >
              <Card>
                <img
                  src={getPosterSrc(movie.posters?.[0] || "/placeholder.png")}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-t"
                />
                <CardContent className="flex flex-col gap-2 p-3">
                  <span className="font-bold text-lg">{movie.title}</span>
                  <span>
                    <strong>Paid:</strong> SEK
                    {revenueData[movie.title]?.paid ?? 0} &nbsp;
                    <strong>Pending:</strong> SEK
                    {revenueData[movie.title]?.pending ?? 0}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No movies available
          </p>
        )}
      </div>

      {/* Modal */}
      {modalMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-xl relative overflow-auto max-h-[90vh] shadow-lg">
            <button
              className="absolute top-3 right-3 hover:text-red-500"
              onClick={() => setModalMovie(null)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
            <p className="mb-2">
              <strong>Cast:</strong>{" "}
              {Object.values(modalMovie.cast).filter(Boolean).join(", ")}
            </p>
            <p className="mb-2">
              <strong>Crew:</strong>{" "}
              {Object.values(modalMovie.crew).filter(Boolean).join(", ")}
            </p>
            <p className="mb-2 font-semibold">Shows:</p>
            <ul className="list-disc pl-5 space-y-1">
              {modalMovie.shows.map((show, idx) => (
                <li key={idx}>
                  {formatDate(show.date)} - {formatTime(show.time)} —{" "}
                  <span className="text-sm text-gray-700">
                    Online: {show.prices.online.adult}/
                    {show.prices.online.kids}, Video:{" "}
                    {show.prices.videoSpeed.adult}/
                    {show.prices.videoSpeed.kids}, Soder:{" "}
                    {show.prices.soder.adult}/{show.prices.soder.kids}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
