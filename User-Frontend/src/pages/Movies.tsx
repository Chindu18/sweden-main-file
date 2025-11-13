
"use client";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import moviePoster1 from "@/assets/movie-poster-1.jpg";
import moviePoster2 from "@/assets/movie-poster-2.jpg";
import moviePoster3 from "@/assets/movie-poster-3.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import { backend_url } from "@/config";
import { motion } from "framer-motion";

const Movies = () => {
  const { id } = useParams();
  const backendurl = backend_url;
  const navigate = useNavigate();

  const [playTrailer, setPlayTrailer] = useState(false);
  const [Movielist, setMovielist] = useState({
    title: "Movie Title",
    cast: { actor: "Hero", actress: "Heroine", villain: "Villain", supporting: [] as string[] },
    crew: {
      director: "Director",
      producer: "Producer",
      musicDirector: "Music Director",
      cinematographer: "Cinematographer",
    },
    posters: [] as string[],
    trailer: "",
    showTimings: [] as string[],
    ticketPrice: { kids: 0, adults: 0 },
    bookingOpenDays: 3,
    _id: undefined as string | undefined,
  });

  // Fetch movie details
  const fetchMovie = async () => {
    try {
      if (!id) return;
      const response = await axios.get(`${backendurl}/movie/getsinglemovie/${id}`);
      const movieData = response.data.data;
      setMovielist(movieData);
    } catch (error) {
      console.error("Movie fetch error:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (!Movielist) return <p>Loading movie...</p>;

  // Carousel items
  const carouselItems: any[] = [];
  if (Movielist.trailer) {
    carouselItems.push({
      id: "trailer",
      type: "trailer",
      poster: Movielist.posters?.[0] || moviePoster1,
      video: Movielist.trailer,
      title: Movielist.title,
    });
  }

  const posterItems =
    Movielist.posters?.length > 0
      ? Movielist.posters.map((photo, index) => ({
          id: index + 1,
          type: "poster",
          image: photo,
          title: Movielist.title || `Movie ${index + 1}`,
        }))
      : [
          { id: 1, type: "poster", image: moviePoster1, title: Movielist.title || "Default Movie" },
          { id: 2, type: "poster", image: moviePoster2, title: "Latest Blockbuster" },
          { id: 3, type: "poster", image: moviePoster3, title: "Classic Tamil Films" },
        ];

  carouselItems.push(...posterItems);

  const castMembers = [
    { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
    { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
    { id: 3, name: Movielist.cast?.villain || "Villain Name", role: "Villain" },
    { id: 4, name: Movielist.cast?.supporting || "Support Artists", role: "Support" },
  ];

  const crewMembers = [
    { id: 1, name: Movielist.crew?.director || "Director", role: "Direction" },
    { id: 2, name: Movielist.crew?.musicDirector || "Music Director", role: "Music" },
    { id: 3, name: Movielist.crew?.cinematographer || "Cinematographer", role: "Cinematography" },
    { id: 4, name: Movielist.crew?.producer || "Producer", role: "Production" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes ping-slow { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        .animate-ping-slow { animation: ping-slow 2.5s ease-in-out infinite; }
      `}</style>

      {/* Hero Poster Carousel */}
      <section className="relative bg-black overflow-hidden">
        <div className="container mx-auto px-4 py-10 md:py-12 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mb-4 drop-shadow-lg">
              Now Showing
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full"></div>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {carouselItems.map((item) => {
                const youtubeId = item.video?.includes("youtube.com")
                  ? item.video.split("v=")[1]?.split("&")[0]
                  : null;
                const youtubeThumbnail = youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                  : null;

                return (
                  <CarouselItem key={item.id}>
                    <div className="relative group w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl">
                      {item.type === "trailer" && !playTrailer && (
                        <>
                          <div className="absolute inset-0">
                            <img
                              src={youtubeThumbnail || item.poster}
                              alt="Trailer Background"
                              className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
                            />
                          </div>
                          <img
                            src={youtubeThumbnail || item.poster}
                            alt="Trailer Poster"
                            className="relative w-auto max-h-full object-contain rounded-2xl shadow-2xl z-10"
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                            onClick={() => setPlayTrailer(true)}
                          >
                            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                              <span className="text-white text-3xl sm:text-4xl">▶</span>
                            </div>
                          </div>
                        </>
                      )}

                      {item.type === "trailer" && playTrailer && (
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                          <iframe
                            className="w-full h-full"
                            src={`${item.video.replace("watch?v=", "embed/")}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      {item.type === "poster" && (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                            />
                          </div>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="relative z-10 mx-auto h-full object-contain rounded-2xl shadow-2xl"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-2xl z-20">
                        <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">
                          {item.title}
                        </h3>
                        {item.type === "trailer" && (
                          <p className="text-xs sm:text-sm md:text-lg text-white/80">Trailer</p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20" />
            <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20" />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-10 bg-white text-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <Button
              onClick={() => Movielist._id && navigate(`/book-ticket/${Movielist._id}`)}
              className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] hover:opacity-90 text-white font-bold text-base sm:text-lg md:text-xl py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-2xl w-full sm:w-auto disabled:opacity-60"
              size="lg"
              disabled={!Movielist._id}
            >
              Book Ticket Now
            </Button>

            <div className="flex justify-center items-center gap-3 mt-5">
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-500" />
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0072ff] to-[#00c6a7] bg-clip-text text-transparent">
                Discount at Video Speed
              </h3>
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-500" />
            </div>
          </div>
        </div>
      </section>

   {/* ⭐ Star Cast Section (only show if cast exists) */}
{(
  Movielist.cast?.actor ||
  Movielist.cast?.actress ||
  Movielist.cast?.villain ||
  (Movielist.cast?.supporting?.length ?? 0) > 0
) && (
  <section className="py-8 md:py-10 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Star Cast</h2>
        <p className="text-muted-foreground text-base md:text-lg">Meet the talented artists</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        {[
          Movielist.cast?.actor && { id: 1, name: Movielist.cast.actor, role: "Hero" },
          Movielist.cast?.actress && { id: 2, name: Movielist.cast.actress, role: "Heroine" },
          Movielist.cast?.villain && { id: 3, name: Movielist.cast.villain, role: "Villain" },
          ...((Array.isArray(Movielist.cast?.supporting) ? Movielist.cast.supporting : [])).map((s, i) => ({

            id: 4 + i,
            name: s,
            role: "Support",
          })),
        ]
          .filter(Boolean)
          .map((cast) => (
            <Card
              key={cast.id}
              className="border-2 border-gray-200 hover:border-[#0072ff] transition-all duration-300 hover:shadow-lg rounded-xl w-64"
            >
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-extrabold text-xl md:text-2xl mb-1">{cast.name}</h3>
                <p className="text-[#0072ff] text-sm md:text-base font-semibold">{cast.role}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  </section>
)}

{/* 🎬 Creative Crew Section (only show if crew exists) */}
{(
  Movielist.crew?.director ||
  Movielist.crew?.musicDirector ||
  Movielist.crew?.cinematographer ||
  Movielist.crew?.producer
) && (
  <section className="py-8 md:py-10 bg-white text-black">
    <div className="container mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">Creative Crew</h2>
        <p className="text-gray-600 text-base md:text-lg">The masterminds behind the magic</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
        {[
          Movielist.crew?.director && { id: 1, name: Movielist.crew.director, role: "Director" },
          Movielist.crew?.musicDirector && { id: 2, name: Movielist.crew.musicDirector, role: "Music Director" },
          Movielist.crew?.cinematographer && { id: 3, name: Movielist.crew.cinematographer, role: "Cinematographer" },
          Movielist.crew?.producer && { id: 4, name: Movielist.crew.producer, role: "Producer" },
        ]
          .filter(Boolean)
          .map((crew) => (
            <Card
              key={crew.id}
              className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl w-64"
            >
              <CardContent className="p-5 sm:p-6 text-center">
                <span className="text-3xl block mb-2">🎬</span>
                <h3 className="font-extrabold text-xl md:text-2xl mb-1 tracking-wide">{crew.name}</h3>
                <p className="text-blue-500 text-sm md:text-base font-semibold">{crew.role}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  </section>
)}




      {/* Contact Section */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-[#00B1BC] via-[#00A0D9] to-[#0083EE] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Contact</h2>
            <div className="w-28 h-1 bg-white/40 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div initial={{ x: -120, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 rounded-2xl shadow-lg">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">Location</h3>
                  </div>
                  <p className="text-base mb-2 font-semibold text-white">
                    Varby Gard-Varby Gard T-Bana, Varby Alle 14, 143 40 Varby, Sweden
                  </p>
                  <a href="https://share.google/reJxV2DULn5kWR8p9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-white hover:text-black/80 text-base transition-colors">
                    📍 Utbildningsvagen 2A, 147 40 Tumba, Sweden
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ x: 120, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 rounded-2xl shadow-lg">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">Contact</h3>
                  </div>
                  <div className="space-y-2 text-base font-semibold text-white">
                    <p>+46 704859228</p>
                    <p>+46 739844564</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Ticket Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => Movielist._id && navigate(`/book-ticket/${Movielist._id}`)}
          className="relative bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 overflow-hidden disabled:opacity-60"
          disabled={!Movielist._id}
        >
          <span className="absolute inset-0 bg-white/10 blur-2xl rounded-full animate-ping-slow" />
          <span className="relative text-3xl">🎟</span>
        </button>
      </div>
    </div>
  );
};

export default Movies;
