

import { useState, useEffect } from "react";
import { IndianRupee, X } from "lucide-react";
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
  const backend_url = "https://swedenn-backend.onrender.com";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [revenueData, setRevenueData] = useState<Record<string, { paid: number; pending: number }>>({});
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const options = { weekday: "short", day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ---------------------- Fetch Movies & Revenue ----------------------
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${backend_url}/movie/getmovie`);
      const moviesData: Movie[] = res.data.data;
      setMovies(moviesData);

      const revData: Record<string, { paid: number; pending: number }> = {};

      // Fetch revenue for each movie
      await Promise.all(
        moviesData.map(async (movie) => {
          const [pendingResp, paidResp] = await Promise.all([
            axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "pending" } }),
            axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "paid" } }),
          ]);

          revData[movie.title] = {
            pending: pendingResp.data.data?.reduce((sum: number, b: any) => sum + b.totalAmount, 0) || 0,
            paid: paidResp.data.data?.reduce((sum: number, b: any) => sum + b.totalAmount, 0) || 0,
          };
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
        {[...movies].reverse().map((movie) => (
          <Card key={movie._id} className="cursor-pointer hover:shadow-lg" onClick={() => setModalMovie(movie)}>
            <img src={getPosterSrc(movie.posters[0])} alt={movie.title} className="w-full h-64 object-cover" />
            <CardContent className="flex flex-col gap-2 p-3">
              <span className="font-bold">{movie.title}</span>
              <span>
                <strong>Paid:</strong> SEK{revenueData[movie.title]?.paid || 0} &nbsp;
                <strong>Pending:</strong> SEK{revenueData[movie.title]?.pending || 0}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {modalMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-3/4 max-w-xl relative overflow-auto max-h-[90vh]">
            <button className="absolute top-2 right-2" onClick={() => setModalMovie(null)}>
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">{modalMovie.title}</h2>
            <p className="mb-2">
              <strong>Cast:</strong> {Object.values(modalMovie.cast).join(", ")}
            </p>
            <p className="mb-2">
              <strong>Crew:</strong> {Object.values(modalMovie.crew).join(", ")}
            </p>
            <p className="mb-2">
              <strong>Shows:</strong>
            </p>
            <ul className="list-disc pl-5">
              {modalMovie.shows.map((show, idx) => (
                <li key={idx}>
                  {formatDate(show.date)} - {formatTime(show.time)} - Online: {show.prices.online.adult}/{show.prices.online.kids}, Video: {show.prices.videoSpeed.adult}/{show.prices.videoSpeed.kids}, Soder: {show.prices.soder.adult}/{show.prices.soder.kids}
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
