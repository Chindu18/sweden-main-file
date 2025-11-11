
// "use client";
// import { useNavigate, useParams } from "react-router-dom";
// import { MapPin, Phone, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";
// import moviePoster1 from "@/assets/movie-poster-1.jpg";
// import moviePoster2 from "@/assets/movie-poster-2.jpg";
// import moviePoster3 from "@/assets/movie-poster-3.jpg";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { backend_url } from "@/config";
// import { motion } from "framer-motion";

// const Movies = () => {
//   const { id } = useParams();
//   const backendurl = backend_url;
//   const navigate = useNavigate();

//   const [playTrailer, setPlayTrailer] = useState(false);
//   const [Movielist, setMovielist] = useState({
//     title: "Movie Title",
//     cast: { actor: "Hero", actress: "Heroine", villain: "Villain", supporting: [] },
//     crew: {
//       director: "Director",
//       producer: "Producer",
//       musicDirector: "Music Director",
//       cinematographer: "Cinematographer",
//     },
//     posters: [],
//     trailer: "",
//     showTimings: [],
//     ticketPrice: { kids: 0, adults: 0 },
//     bookingOpenDays: 3,
//   });

//   // ✅ Fixed: use backticks for template literal
//   const fetchMovie = async () => {
//     try {
//       if (!id) return;
//       const response = await axios.get(`${backendurl}/movie/getsinglemovie/${id}`);
//       const movieData = response.data.data;
//       console.log(movieData);
//       setMovielist(movieData);
//     } catch (error) {
//       console.error("Movie fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMovie();
//   }, [id]);

//   if (!Movielist) return <p>Loading movie...</p>;

//   const carouselItems = [];
//   if (Movielist.trailer) {
//     carouselItems.push({
//       id: "trailer",
//       type: "trailer",
//       poster: Movielist.posters?.[0] || moviePoster1,
//       video: Movielist.trailer,
//       title: Movielist.title,
//     });
//   }

//   const posterItems =
//     Movielist.posters?.length > 0
//       ? Movielist.posters.map((photo, index) => ({
//           id: index + 1,
//           type: "poster",
//           image: photo,
//           title: Movielist.title || `Movie ${index + 1}`,
//         }))
//       : [
//           { id: 1, type: "poster", image: moviePoster1, title: Movielist.title || "Default Movie" },
//           { id: 2, type: "poster", image: moviePoster2, title: "Latest Blockbuster" },
//           { id: 3, type: "poster", image: moviePoster3, title: "Classic Tamil Films" },
//         ];

//   carouselItems.push(...posterItems);

//   const castMembers = [
//     { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
//     { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
//     { id: 3, name: Movielist.cast?.villain || "Villain Name", role: "Villain" },
//     { id: 4, name: Movielist.cast?.supporting || "Support Artists", role: "Support" },
//   ];

//   const crewMembers = [
//     { id: 1, name: Movielist.crew?.director || "Director", role: "Direction" },
//     { id: 2, name: Movielist.crew?.musicDirector || "Music Director", role: "Music" },
//     { id: 3, name: Movielist.crew?.cinematographer || "Cinematographer", role: "Cinematography" },
//     { id: 4, name: Movielist.crew?.producer || "Producer", role: "Production" },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <style>{`
//         @keyframes ping-slow {
//           0%, 100% { opacity: 0.6; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.15); }
//         }
//         .animate-ping-slow {
//           animation: ping-slow 2.5s ease-in-out infinite;
//         }
//       `}</style>

//       {/* Hero Poster Carousel */}
//       <section className="relative bg-black overflow-hidden">
//         <div className="container mx-auto px-4 py-20 relative z-10">
//           <div className="text-center mb-12 animate-fade-in">
//             <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mb-4 drop-shadow-lg">
//               Now Showing
//             </h1>
//             <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white mx-auto rounded-full"></div>
//           </div>

//           <Carousel className="w-full animate-slide-up">
//             <CarouselContent>
//               {carouselItems.map((item) => {
//                 const youtubeId = item.video?.includes("youtube.com")
//                   ? item.video.split("v=")[1]?.split("&")[0]
//                   : null;
//                 const youtubeThumbnail = youtubeId
//                   ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
//                   : null;

//                 return (
//                   <CarouselItem key={item.id}>
//                     <div className="relative group w-full h-[250px] sm:h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl">
//                       {item.type === "trailer" && !playTrailer && (
//                         <>
//                           <div className="absolute inset-0">
//                             <img
//                               src={youtubeThumbnail || item.poster}
//                               alt="Trailer Background"
//                               className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
//                             />
//                           </div>
//                           <img
//                             src={youtubeThumbnail || item.poster}
//                             alt="Trailer Poster"
//                             className="relative w-auto max-h-full object-contain rounded-2xl shadow-2xl z-10"
//                           />
//                           <div
//                             className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
//                             onClick={() => setPlayTrailer(true)}
//                           >
//                             <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
//                               <span className="text-white text-3xl sm:text-4xl">&#9658;</span>
//                             </div>
//                           </div>
//                         </>
//                       )}

//                       {item.type === "trailer" && playTrailer && (
//                         <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
//                           <iframe
//                             className="w-full h-full"
//                             src={`${item.video.replace("watch?v=", "embed/")}?autoplay=1&controls=1&modestbranding=1&rel=0`}
//                             title={item.title}
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                           ></iframe>
//                         </div>
//                       )}

//                       {item.type === "poster" && (
//                         <div className="relative w-full h-full">
//                           <div className="absolute inset-0">
//                             <img
//                               src={item.image}
//                               alt={item.title}
//                               className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
//                             />
//                           </div>
//                           <img
//                             src={item.image}
//                             alt={item.title}
//                             className="relative z-10 mx-auto h-full object-contain rounded-2xl shadow-2xl"
//                           />
//                         </div>
//                       )}

//                       <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-2xl z-20">
//                         <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">
//                           {item.title}
//                         </h3>
//                         {item.type === "trailer" && (
//                           <p className="text-xs sm:text-sm md:text-lg text-white/80">Trailer</p>
//                         )}
//                       </div>
//                     </div>
//                   </CarouselItem>
//                 );
//               })}
//             </CarouselContent>
//             <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
//             <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
//           </Carousel>
//         </div>
//       </section>
// {/*Discount Section */}
//       <section className="py-20 bg-white text-black relative overflow-hidden"><div className="container mx-auto px-4 max-w-6xl relative z-10">
//     <div className="text-center mb-16">
//       <h2 className="text-5xl md:text-6xl font-bold mb-4">Discount</h2>
//       <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full"></div>
//     </div>

//     <div className="text-center mb-12 px-4 sm:px-0">
//       <Button
//         onClick={() => navigate(`/book-ticket/${Movielist._id}`)}
//         className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] hover:bg-[#0072ff] text-white font-bold text-sm sm:text-lg md:text-2xl py-3 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 rounded-full cinema-glow hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto"
//         size="lg"
//       >
//         Book Ticket Now
//       </Button>
//     </div>

//     {/* Discount Banner */}
//     <Card className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] border-[#0072ff] cinema-glow mb-12 overflow-hidden relative">
//       <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//       <CardContent className="p-8 relative z-10">
//         <div className="flex items-center justify-center gap-4 flex-wrap">
//           <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
//           <h3 className="text-3xl md:text-4xl font-bold text-center text-white">
//             Discount at Video Speed
//           </h3>
//           <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// </section>


//       {/* Cast Section */}
//      <section className="py-10 bg-muted/30">
//   <div className="container mx-auto px-4">
//     <div className="text-center mb-12 animate-fade-in">
//       <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Star Cast</h2>
//       <p className="text-muted-foreground text-lg">Meet the talented artists</p>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
//       {castMembers.map((cast, index) => (
//         <Card
//           key={cast.id}
//           className="border-2 border-gray-200 hover:border-[#0072ff] transition-all duration-300 hover-lift animate-scale-in overflow-hidden group"
//           style={{ animationDelay: `${index * 0.1}s` }}
//         >
//           <CardContent className="p-6 text-center">
//             {/* Smaller icon, clean look */}
//             <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <span className="text-3xl md:text-3xl group-hover:scale-110 transition-transform">👤</span>
//             </div>

//             {/* Large, bold text */}
//             <h3 className="font-extrabold text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
//               {cast.name}
//             </h3>
//             <p className="text-[#0072ff] text-lg md:text-xl font-semibold">{cast.role}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   </div>
// </section>

//       {/* Crew Section */}

// {/* Crew Section */}
// <section className="py-10 bg-white text-black">
//   <div className="container mx-auto px-4">
//     <div className="text-center mb-12 animate-fade-in">
//       <h2 className="text-5xl md:text-6xl font-bold mb-4">Creative Crew</h2>
//       <p className="text-gray-600 text-lg">The masterminds behind the magic</p>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
//       {/* Director */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">👤</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             K. Rajesh
//           </h3>
          
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Director</p>
//         </CardContent>
//       </Card>

//       {/* Music Director */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">🎵</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             A. Prakash
//           </h3>
         
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Music Director</p>
//         </CardContent>
//       </Card>

//       {/* Cinematographer */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//             <span className="text-3xl block mb-2">🎥</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             S. Mani
//           </h3>
        
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Cinematographer</p>
//         </CardContent>
//       </Card>

//       {/* Producer */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">💰</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             M. Varun
//           </h3>
          
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Producer</p>
//         </CardContent>
//       </Card>
//     </div>
//   </div>
// </section>

//       {/* Discount & Contact Section */}
     
//    <section className="py-20 bg-gradient-to-br from-[#00B1BC] via-[#00A0D9] to-[#0083EE] text-white relative overflow-hidden">
//   <div className="container mx-auto px-4 max-w-6xl relative z-10">
//     {/* Header */}
//     <div className="text-center mb-16">
//       <h2 className="text-5xl md:text-6xl font-extrabold mb-4">Contact</h2>
//       <div className="w-32 h-1 bg-gradient-to-r from-[#00B1BC] to-[#0083EE] mx-auto rounded-full"></div>
//     </div>

//     {/* Cards Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
//       {/* Location Card */}
//       <motion.div
//         initial={{ x: -150, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 w-full rounded-2xl shadow-lg">
//           <CardContent className="p-6 sm:p-8">
//             <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
//               <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               <h3 className="text-2xl sm:text-3xl font-bold text-white">
//                 Location
//               </h3>
//             </div>
//             <p className="text-base sm:text-lg mb-2 sm:mb-4 font-semibold text-white">
//               Varby Gard-Varby Gard T-Bana, Varby Alle 14, 143 40 Varby,
//               Sweden
//             </p>
//             <a
//               href="https://share.google/reJxV2DULn5kWR8p9"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 font-bold text-white hover:text-[#00A0D9] text-base sm:text-lg transition-colors"
//             >
//               📍 Utbildningsvagen 2A, 147 40 Tumba, Sweden
//             </a>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Contact Card */}
//       <motion.div
//         initial={{ x: 150, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 w-full rounded-2xl shadow-lg">
//           <CardContent className="p-6 sm:p-8">
//             <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
//               <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               <h3 className="text-2xl sm:text-3xl font-bold text-white">
//                 Contact
//               </h3>
//             </div>
//             <div className="space-y-2 text-base sm:text-lg font-semibold text-white">
//               <p>+46 704859228</p>
//               <p>+46 739844564</p>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   </div>
// </section>


//     {/* Floating Round Ticket Button */}
// <div className="fixed bottom-6 right-6 z-50">
//   <button
//     onClick={() => navigate(`/book-ticket/${Movielist._id}`)}
//     className="relative bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
//                hover:scale-110 transition-transform duration-300 overflow-hidden"
//   >
//     {/* Glowing Animation */}
//     <span className="absolute inset-0 bg-accent/30 blur-2xl rounded-full animate-ping-slow"></span>

//     {/* Ticket Icon */}
//     <span className="relative text-3xl">🎟️</span>
//   </button>

//   {/* Inline Animation (No CSS File Needed) */}
//   <style>
//     {`
//       @keyframes ping-slow {
//         0%, 100% { opacity: 0.6; transform: scale(1); }
//         50% { opacity: 1; transform: scale(1.2); }
//       }
//       .animate-ping-slow {
//         animation: ping-slow 2.5s ease-in-out infinite;
//       }
//     `}
//   </style>
// </div>
//       {/* All other sections below remain the same */}



//     </div>
//   );
// };

// export default Movies;



// // "use client";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { MapPin, Phone, Sparkles } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Carousel,
// //   CarouselContent,
// //   CarouselItem,
// //   CarouselNext,
// //   CarouselPrevious,
// // } from "@/components/ui/carousel";
// // import { Card, CardContent } from "@/components/ui/card";
// // import moviePoster1 from "@/assets/movie-poster-1.jpg";
// // import moviePoster2 from "@/assets/movie-poster-2.jpg";
// // import moviePoster3 from "@/assets/movie-poster-3.jpg";
// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import { backend_url } from "@/config";
 
// // const Movies = () => {
// //   const { id } = useParams(); // Get movie ID from URL
// //   const backendurl = backend_url;
// //   const navigate = useNavigate();

// //   const [playTrailer, setPlayTrailer] = useState(false);
// //   const [Movielist, setMovielist] = useState({
// //     title: "Movie Title",
// //     cast: { actor: "Hero", actress: "Heroine", villain: "Villain", supporting: [] },
// //     crew: { director: "Director", producer: "Producer", musicDirector: "Music Director", cinematographer: "Cinematographer" },
// //     posters: [],
// //     trailer: "",
// //     showTimings: [],
// //     ticketPrice: { kids: 0, adults: 0 },
// //     bookingOpenDays: 3,
// //   });

// //   // Fetch movie by ID
// //   const fetchMovie = async () => {
// //     try {
// //       if (!id) return;
// //       const response = await axios.get(${backendurl}/movie/getsinglemovie/${id});
// //       const movieData = response.data.data;
// //       console.log(movieData) // assuming API returns the movie object
// //       setMovielist(movieData);
      
// //     } catch (error) {
// //       console.error("Movie fetch error:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMovie();
// //   }, [id]);

// //   if (!Movielist) return <p>Loading movie...</p>;

// //   // Prepare carousel items
// //   const carouselItems = [];
// //   if (Movielist.trailer) {
// //     carouselItems.push({
// //       id: "trailer",
// //       type: "trailer",
// //       poster: Movielist.posters?.[0] || moviePoster1,
// //       video: Movielist.trailer,
// //       title: Movielist.title,
// //     });
// //   }

// //   const posterItems =
// //     Movielist.posters?.length > 0
// //       ? Movielist.posters.map((photo, index) => ({
// //           id: index + 1,
// //           type: "poster",
// //           image: photo,
// //           title: Movielist.title || Movie ${index + 1},
// //         }))
// //       : [
// //           { id: 1, type: "poster", image: moviePoster1, title: Movielist.title || "Default Movie" },
// //           { id: 2, type: "poster", image: moviePoster2, title: "Latest Blockbuster" },
// //           { id: 3, type: "poster", image: moviePoster3, title: "Classic Tamil Films" },
// //         ];

// //   carouselItems.push(...posterItems);

// //   // Cast & Crew members
// //   const castMembers = [
// //     { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
// //     { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
// //     { id: 3, name: Movielist.cast?.villain || "Villain Name", role: "Villain" },
// //     { id: 4, name: Movielist.cast?.supporting || "Support Artists", role: "Support" },
// //   ];

// //   const crewMembers = [
// //     { id: 1, name: Movielist.crew?.director || "Director", role: "Direction" },
// //     { id: 2, name: Movielist.crew?.musicDirector || "Music Director", role: "Music" },
// //     { id: 3, name: Movielist.crew?.cinematographer || "Cinematographer", role: "Cinematography" },
// //     { id: 4, name: Movielist.crew?.producer || "Producer", role: "Production" },
// //   ];



// //   <style>
// //   {`
// //     @keyframes ping-slow {
// //       0%, 100% { opacity: 0.6; transform: scale(1); }
// //       50% { opacity: 1; transform: scale(1.15); }
// //     }
// //     .animate-ping-slow {
// //       animation: ping-slow 2.5s ease-in-out infinite;
// //     }
// //   `}
// // </style>

// //   return (
// //     <div className="min-h-screen bg-background">
// //       {/* Hero Poster Carousel */}
// //       <section className="relative bg-black overflow-hidden">
// //         <div className="container mx-auto px-4 py-20 relative z-10">
// //           <div className="text-center mb-12 animate-fade-in">
// //             <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mb-4 drop-shadow-lg">
// //               Now Showing
// //             </h1>
// //             <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white mx-auto rounded-full"></div>
// //           </div>

// //          <Carousel className="w-full animate-slide-up">
// //   <CarouselContent>
// //     {carouselItems.map((item) => {
// //       // Detect if YouTube trailer exists
// //       const youtubeId = item.video?.includes("youtube.com")
// //         ? item.video.split("v=")[1]?.split("&")[0]
// //         : null;

// //       // Generate YouTube thumbnail if trailer
// //       const youtubeThumbnail = youtubeId
// //         ? https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg
// //         : null;

// //       return (
// //         <CarouselItem key={item.id}>
// //           <div className="relative group w-full h-[250px] sm:h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl">
            
// //             {/* 🎬 Trailer Thumbnail or Video */}
// //             {item.type === "trailer" && !playTrailer && (
// //               <>
// //                 {/* Blurred background (for style) */}
// //                 <div className="absolute inset-0">
// //                   <img
// //                     src={youtubeThumbnail || item.poster}
// //                     alt="Trailer Background"
// //                     className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
// //                   />
// //                 </div>

// //                 {/* Center Thumbnail */}
// //                 <img
// //                   src={youtubeThumbnail || item.poster}
// //                   alt="Trailer Poster"
// //                   className="relative w-auto max-h-full object-contain rounded-2xl shadow-2xl z-10"
// //                 />

// //                 {/* Play Button */}
// //                 <div
// //                   className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
// //                   onClick={() => setPlayTrailer(true)}
// //                 >
// //                   <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
// //                     <span className="text-white text-3xl sm:text-4xl">&#9658;</span>
// //                   </div>
// //                 </div>
// //               </>
// //             )}

// //             {/* 🎥 Play Trailer */}
// //             {item.type === "trailer" && playTrailer && (
// //               <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
// //                 <iframe
// //                   className="w-full h-full"
// //                   src={${item.video.replace("watch?v=", "embed/")}?autoplay=1&controls=1&modestbranding=1&rel=0}
// //                   title={item.title}
// //                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //                   allowFullScreen
// //                 ></iframe>
// //               </div>
// //             )}

// //             {/* 🖼 Movie Posters */}
// //             {item.type === "poster" && (
// //               <div className="relative w-full h-full">
// //                 {/* Blurred background for portrait posters */}
// //                 <div className="absolute inset-0">
// //                   <img
// //                     src={item.image}
// //                     alt={item.title}
// //                     className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
// //                   />
// //                 </div>
// //                 {/* Actual poster */}
// //                 <img
// //                   src={item.image}
// //                   alt={item.title}
// //                   className="relative z-10 mx-auto h-full object-contain rounded-2xl shadow-2xl"
// //                 />
// //               </div>
// //             )}

// //             {/* 🔤 Title Overlay */}
// //             <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-2xl z-20">
// //               <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">
// //                 {item.title}
// //               </h3>
// //               {item.type === "trailer" && (
// //                 <p className="text-xs sm:text-sm md:text-lg text-white/80">Trailer</p>
// //               )}
// //             </div>
// //           </div>
// //         </CarouselItem>
// //       );
// //     })}
// //   </CarouselContent>

// //   {/* Navigation Buttons */}
// //   <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
// //   <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
// // </Carousel>

// //         </div>
// //       </section>

// //       {/* Cast Section */}
// //       <section className="py-20 bg-muted/30">
// //         <div className="container mx-auto px-4">
// //           <div className="text-center mb-12 animate-fade-in">
// //             <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Star Cast</h2>
// //             <p className="text-muted-foreground text-lg">Meet the talented artists</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
// //             {castMembers.map((cast, index) => (
// //               <Card key={cast.id} className="border-2 border-gray-200 hover:border-[#0072ff] transition-all duration-300 hover-lift animate-scale-in overflow-hidden group" style={{ animationDelay: ${index * 0.1}s }}>
// //                 <CardContent className="p-6 text-center">
// //                   <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] rounded-full flex items-center justify-center border-4 border-[#0072ff] group-hover:border-[#0072ff] transition-colors">
// //                     <span className="text-5xl group-hover:scale-110 transition-transform">👤</span>
// //                   </div>
// //                   <h3 className="font-bold text-lg text-foreground mb-1">{cast.name}</h3>
// //                   <p className="text-[#0072ff] text-sm font-semibold">{cast.role}</p>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Crew Section */}
// //       <section className="py-20">
// //         <div className="container mx-auto px-4">
// //           <div className="text-center mb-12 animate-fade-in">
// //             <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Creative Crew</h2>
// //             <p className="text-muted-foreground text-lg">The masterminds behind the magic</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
// //             {crewMembers.map((crew, index) => (
// //               <Card key={crew.id} className="border-2 border-border hover:border-[#0072ff] transition-all duration-300 hover-lift animate-scale-in overflow-hidden group" style={{ animationDelay: ${index * 0.1}s }}>
// //                 <CardContent className="p-6 text-center">
// //                   <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] from-[#0072ff] to-[#00c6a7] rounded-full flex items-center justify-center border-4 border-[#0072ff] group-hover:border-[#0072ff] transition-colors">
// //                     <span className="text-5xl group-hover:scale-110 transition-transform">🎬</span>
// //                   </div>
// //                   <h3 className="font-bold text-lg text-foreground mb-1">{crew.name}</h3>
// //                   <p className="text-[#0072ff] text-sm font-semibold">{crew.role}</p>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Discount & Contact Section */}
// //       <section className="py-20 bg-gradient-to-br from-cinema-black via-secondary to-cinema-black text-white relative overflow-hidden">
// //         <div className="container mx-auto px-4 max-w-6xl relative z-10">
// //           <div className="text-center mb-16">
// //             <h2 className="text-5xl md:text-6xl font-bold mb-4">Discount & Contact</h2>
// //             <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full"></div>
// //           </div>

// //           <div className="text-center mb-12 px-4 sm:px-0">
// //             <Button
// //                onClick={() => navigate(/book-ticket/${Movielist._id})}
// //               className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] hover:bg-[#0072ff] text-white font-bold text-sm sm:text-lg md:text-2xl py-3 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 rounded-full cinema-glow hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto"
// //               size="lg"
// //             >
// //               Book Ticket Now
// //             </Button>
// //           </div>

// //           {/* Discount Banner */}
// //           <Card className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] border-[#0072ff] cinema-glow mb-12 overflow-hidden relative">
// //             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
// //             <CardContent className="p-8 relative z-10">
// //               <div className="flex items-center justify-center gap-4 flex-wrap">
// //                 <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
// //                 <h3 className="text-3xl md:text-4xl font-bold text-center text-white">
// //                   Discount at Video Speed
// //                 </h3>
// //                 <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Location & Contact Cards */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
// //             {/* Location */}
// //             <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
// //               <CardContent className="p-6 sm:p-8">
// //                 <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
// //                   <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#0072ff]" />
// //                   <h3 className="text-2xl sm:text-3xl font-bold text-white">Location</h3>
// //                 </div>
// //                 <p className="text-base sm:text-lg mb-2 sm:mb-4 text-white">
// //                   varby gard-varby gard t-bana, varby alle 14, 143 40 varby, Sweden
// //                 </p>
// //                 <a
// //                   href="https://share.google/reJxV2DULn5kWR8p9"
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="inline-flex items-center gap-1 sm:gap-2 text-[#0072ff] hover:text-[#0072ff]/80 font-semibold text-base sm:text-lg transition-colors"
// //                 >
// //                   Utbildningsvagen 2A, 147 40 Tumba, Sweden
// //                 </a>
// //               </CardContent>
// //             </Card>

// //             {/* Contact */}
// //             <Card className="bg-white/5 backdrop-blur-md border-white/10 hover-lift w-full">
// //               <CardContent className="p-6 sm:p-8">
// //                 <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
// //                   <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-[#0072ff]" />
// //                   <h3 className="text-2xl sm:text-3xl font-bold text-white">Contact</h3>
// //                 </div>
// //                 <div className="space-y-1 sm:space-y-2 text-base sm:text-lg text-white">
// //                   <p>+46704859228</p>
// //                   <p>+46739844564</p>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </section>
// //     {/* Floating Round Ticket Button */}
// // <div className="fixed bottom-6 right-6 z-50">
// //   <button
// //     onClick={() => navigate(/book-ticket/${Movielist._id})}
// //     className="relative bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
// //                hover:scale-110 transition-transform duration-300 overflow-hidden"
// //   >
// //     {/* Glowing Animation */}
// //     <span className="absolute inset-0 bg-accent/30 blur-2xl rounded-full animate-ping-slow"></span>

// //     {/* Ticket Icon */}
// //     <span className="relative text-3xl">🎟</span>
// //   </button>

// //   {/* Inline Animation (No CSS File Needed) */}
// //   <style>
// //     {`
// //       @keyframes ping-slow {
// //         0%, 100% { opacity: 0.6; transform: scale(1); }
// //         50% { opacity: 1; transform: scale(1.2); }
// //       }
// //       .animate-ping-slow {
// //         animation: ping-slow 2.5s ease-in-out infinite;
// //       }
// //     `}
// //   </style>
// // </div>


// //     </div>
// //   );
// // };

// // export default Movies;


// "use client";
// import { useNavigate, useParams } from "react-router-dom";
// import { MapPin, Phone, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";
// import moviePoster1 from "@/assets/movie-poster-1.jpg";
// import moviePoster2 from "@/assets/movie-poster-2.jpg";
// import moviePoster3 from "@/assets/movie-poster-3.jpg";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { backend_url } from "@/config";
// import { motion } from "framer-motion";

// const Movies = () => {
//   const { id } = useParams();
//   const backendurl = backend_url;
//   const navigate = useNavigate();

//   const [playTrailer, setPlayTrailer] = useState(false);
//   const [Movielist, setMovielist] = useState({
//     title: "Movie Title",
//     cast: { actor: "Hero", actress: "Heroine", villain: "Villain", supporting: [] },
//     crew: {
//       director: "Director",
//       producer: "Producer",
//       musicDirector: "Music Director",
//       cinematographer: "Cinematographer",
//     },
//     posters: [],
//     trailer: "",
//     showTimings: [],
//     ticketPrice: { kids: 0, adults: 0 },
//     bookingOpenDays: 3,
//   });

//   // ✅ Fixed: use backticks for template literal
//   const fetchMovie = async () => {
//     try {
//       if (!id) return;
//       const response = await axios.get(${backendurl}/movie/getsinglemovie/${id});
//       const movieData = response.data.data;
//       console.log(movieData);
//       setMovielist(movieData);
//     } catch (error) {
//       console.error("Movie fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMovie();
//   }, [id]);

//   if (!Movielist) return <p>Loading movie...</p>;

//   const carouselItems = [];
//   if (Movielist.trailer) {
//     carouselItems.push({
//       id: "trailer",
//       type: "trailer",
//       poster: Movielist.posters?.[0] || moviePoster1,
//       video: Movielist.trailer,
//       title: Movielist.title,
//     });
//   }

//   const posterItems =
//     Movielist.posters?.length > 0
//       ? Movielist.posters.map((photo, index) => ({
//           id: index + 1,
//           type: "poster",
//           image: photo,
//           title: Movielist.title || Movie ${index + 1},
//         }))
//       : [
//           { id: 1, type: "poster", image: moviePoster1, title: Movielist.title || "Default Movie" },
//           { id: 2, type: "poster", image: moviePoster2, title: "Latest Blockbuster" },
//           { id: 3, type: "poster", image: moviePoster3, title: "Classic Tamil Films" },
//         ];

//   carouselItems.push(...posterItems);

//   const castMembers = [
//     { id: 1, name: Movielist.cast?.actor || "Hero Name", role: "Hero" },
//     { id: 2, name: Movielist.cast?.actress || "Heroine Name", role: "Heroine" },
//     { id: 3, name: Movielist.cast?.villain || "Villain Name", role: "Villain" },
//     { id: 4, name: Movielist.cast?.supporting || "Support Artists", role: "Support" },
//   ];

//   const crewMembers = [
//     { id: 1, name: Movielist.crew?.director || "Director", role: "Direction" },
//     { id: 2, name: Movielist.crew?.musicDirector || "Music Director", role: "Music" },
//     { id: 3, name: Movielist.crew?.cinematographer || "Cinematographer", role: "Cinematography" },
//     { id: 4, name: Movielist.crew?.producer || "Producer", role: "Production" },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <style>{`
//         @keyframes ping-slow {
//           0%, 100% { opacity: 0.6; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.15); }
//         }
//         .animate-ping-slow {
//           animation: ping-slow 2.5s ease-in-out infinite;
//         }
//       `}</style>

//       {/* Hero Poster Carousel */}
//       <section className="relative bg-black overflow-hidden">
//         <div className="container mx-auto px-4 py-20 relative z-10">
//           <div className="text-center mb-12 animate-fade-in">
//             <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mb-4 drop-shadow-lg">
//               Now Showing
//             </h1>
//             <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white mx-auto rounded-full"></div>
//           </div>

//           <Carousel className="w-full animate-slide-up">
//             <CarouselContent>
//               {carouselItems.map((item) => {
//                 const youtubeId = item.video?.includes("youtube.com")
//                   ? item.video.split("v=")[1]?.split("&")[0]
//                   : null;
//                 const youtubeThumbnail = youtubeId
//                   ? https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg
//                   : null;

//                 return (
//                   <CarouselItem key={item.id}>
//                     <div className="relative group w-full h-[250px] sm:h-[400px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden rounded-2xl">
//                       {item.type === "trailer" && !playTrailer && (
//                         <>
//                           <div className="absolute inset-0">
//                             <img
//                               src={youtubeThumbnail || item.poster}
//                               alt="Trailer Background"
//                               className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
//                             />
//                           </div>
//                           <img
//                             src={youtubeThumbnail || item.poster}
//                             alt="Trailer Poster"
//                             className="relative w-auto max-h-full object-contain rounded-2xl shadow-2xl z-10"
//                           />
//                           <div
//                             className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
//                             onClick={() => setPlayTrailer(true)}
//                           >
//                             <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black/60 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
//                               <span className="text-white text-3xl sm:text-4xl">&#9658;</span>
//                             </div>
//                           </div>
//                         </>
//                       )}

//                       {item.type === "trailer" && playTrailer && (
//                         <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
//                           <iframe
//                             className="w-full h-full"
//                             src={${item.video.replace("watch?v=", "embed/")}?autoplay=1&controls=1&modestbranding=1&rel=0}
//                             title={item.title}
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                           ></iframe>
//                         </div>
//                       )}

//                       {item.type === "poster" && (
//                         <div className="relative w-full h-full">
//                           <div className="absolute inset-0">
//                             <img
//                               src={item.image}
//                               alt={item.title}
//                               className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
//                             />
//                           </div>
//                           <img
//                             src={item.image}
//                             alt={item.title}
//                             className="relative z-10 mx-auto h-full object-contain rounded-2xl shadow-2xl"
//                           />
//                         </div>
//                       )}

//                       <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-2xl z-20">
//                         <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 drop-shadow-lg">
//                           {item.title}
//                         </h3>
//                         {item.type === "trailer" && (
//                           <p className="text-xs sm:text-sm md:text-lg text-white/80">Trailer</p>
//                         )}
//                       </div>
//                     </div>
//                   </CarouselItem>
//                 );
//               })}
//             </CarouselContent>
//             <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
//             <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 hover:bg-accent hover:border-accent" />
//           </Carousel>
//         </div>
//       </section>
// {/*Discount Section */}
//       <section className="py-20 bg-white text-black relative overflow-hidden"><div className="container mx-auto px-4 max-w-6xl relative z-10">
//     <div className="text-center mb-16">
//       <h2 className="text-5xl md:text-6xl font-bold mb-4">Discount</h2>
//       <div className="w-32 h-1 bg-gradient-to-r from-[#0072ff] to-[#00c6a7] mx-auto rounded-full"></div>
//     </div>

//     <div className="text-center mb-12 px-4 sm:px-0">
//       <Button
//         onClick={() => navigate(/book-ticket/${Movielist._id})}
//         className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] hover:bg-[#0072ff] text-white font-bold text-sm sm:text-lg md:text-2xl py-3 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 rounded-full cinema-glow hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto"
//         size="lg"
//       >
//         Book Ticket Now
//       </Button>
//     </div>

//     {/* Discount Banner */}
//     <Card className="bg-gradient-to-r from-[#0072ff] to-[#00c6a7] border-[#0072ff] cinema-glow mb-12 overflow-hidden relative">
//       <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//       <CardContent className="p-8 relative z-10">
//         <div className="flex items-center justify-center gap-4 flex-wrap">
//           <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
//           <h3 className="text-3xl md:text-4xl font-bold text-center text-white">
//             Discount at Video Speed
//           </h3>
//           <Sparkles className="w-8 h-8 animate-pulse text-yellow-600" />
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// </section>


//       {/* Cast Section */}
//      <section className="py-10 bg-muted/30">
//   <div className="container mx-auto px-4">
//     <div className="text-center mb-12 animate-fade-in">
//       <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Star Cast</h2>
//       <p className="text-muted-foreground text-lg">Meet the talented artists</p>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
//       {castMembers.map((cast, index) => (
//         <Card
//           key={cast.id}
//           className="border-2 border-gray-200 hover:border-[#0072ff] transition-all duration-300 hover-lift animate-scale-in overflow-hidden group"
//           style={{ animationDelay: ${index * 0.1}s }}
//         >
//           <CardContent className="p-6 text-center">
//             {/* Smaller icon, clean look */}
//             <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <span className="text-3xl md:text-3xl group-hover:scale-110 transition-transform">👤</span>
//             </div>

//             {/* Large, bold text */}
//             <h3 className="font-extrabold text-2xl md:text-3xl text-foreground mb-2 tracking-wide">
//               {cast.name}
//             </h3>
//             <p className="text-[#0072ff] text-lg md:text-xl font-semibold">{cast.role}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   </div>
// </section>

//       {/* Crew Section */}

// {/* Crew Section */}
// <section className="py-10 bg-white text-black">
//   <div className="container mx-auto px-4">
//     <div className="text-center mb-12 animate-fade-in">
//       <h2 className="text-5xl md:text-6xl font-bold mb-4">Creative Crew</h2>
//       <p className="text-gray-600 text-lg">The masterminds behind the magic</p>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
//       {/* Director */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">👤</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             K. Rajesh
//           </h3>
          
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Director</p>
//         </CardContent>
//       </Card>

//       {/* Music Director */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">🎵</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             A. Prakash
//           </h3>
         
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Music Director</p>
//         </CardContent>
//       </Card>

//       {/* Cinematographer */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//             <span className="text-3xl block mb-2">🎥</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             S. Mani
//           </h3>
        
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Cinematographer</p>
//         </CardContent>
//       </Card>

//       {/* Producer */}
//       <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-scale-in rounded-xl">
//         <CardContent className="p-6 text-center">
//           <span className="text-3xl block mb-2">💰</span>
//           <h3 className="font-extrabold text-2xl md:text-3xl mb-2 tracking-wide">
//             M. Varun
//           </h3>
          
//           <p className="text-blue-500 text-lg md:text-xl font-semibold">Producer</p>
//         </CardContent>
//       </Card>
//     </div>
//   </div>
// </section>

//       {/* Discount & Contact Section */}
     
//    <section className="py-20 bg-gradient-to-br from-[#00B1BC] via-[#00A0D9] to-[#0083EE] text-white relative overflow-hidden">
//   <div className="container mx-auto px-4 max-w-6xl relative z-10">
//     {/* Header */}
//     <div className="text-center mb-16">
//       <h2 className="text-5xl md:text-6xl font-extrabold mb-4">Contact</h2>
//       <div className="w-32 h-1 bg-gradient-to-r from-[#00B1BC] to-[#0083EE] mx-auto rounded-full"></div>
//     </div>

//     {/* Cards Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
//       {/* Location Card */}
//       <motion.div
//         initial={{ x: -150, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 w-full rounded-2xl shadow-lg">
//           <CardContent className="p-6 sm:p-8">
//             <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
//               <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               <h3 className="text-2xl sm:text-3xl font-bold text-white">
//                 Location
//               </h3>
//             </div>
//             <p className="text-base sm:text-lg mb-2 sm:mb-4 font-semibold text-white">
//               Varby Gard-Varby Gard T-Bana, Varby Alle 14, 143 40 Varby,
//               Sweden
//             </p>
//             <a
//               href="https://share.google/reJxV2DULn5kWR8p9"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 font-bold text-white hover:text-[#00A0D9] text-base sm:text-lg transition-colors"
//             >
//               📍 Utbildningsvagen 2A, 147 40 Tumba, Sweden
//             </a>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Contact Card */}
//       <motion.div
//         initial={{ x: 150, opacity: 0 }}
//         whileInView={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true }}
//       >
//         <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:scale-105 transition-transform duration-300 w-full rounded-2xl shadow-lg">
//           <CardContent className="p-6 sm:p-8">
//             <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
//               <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               <h3 className="text-2xl sm:text-3xl font-bold text-white">
//                 Contact
//               </h3>
//             </div>
//             <div className="space-y-2 text-base sm:text-lg font-semibold text-white">
//               <p>+46 704859228</p>
//               <p>+46 739844564</p>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   </div>
// </section>


//     {/* Floating Round Ticket Button */}
// <div className="fixed bottom-6 right-6 z-50">
//   <button
//     onClick={() => navigate(/book-ticket/${Movielist._id})}
//     className="relative bg-gradient-to-r from-[#0072ff] to-[#00c6a7] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
//                hover:scale-110 transition-transform duration-300 overflow-hidden"
//   >
//     {/* Glowing Animation */}
//     <span className="absolute inset-0 bg-accent/30 blur-2xl rounded-full animate-ping-slow"></span>

//     {/* Ticket Icon */}
//     <span className="relative text-3xl">🎟</span>
//   </button>

//   {/* Inline Animation (No CSS File Needed) */}
//   <style>
//     {`
//       @keyframes ping-slow {
//         0%, 100% { opacity: 0.6; transform: scale(1); }
//         50% { opacity: 1; transform: scale(1.2); }
//       }
//       .animate-ping-slow {
//         animation: ping-slow 2.5s ease-in-out infinite;
//       }
//     `}
//   </style>
// </div>
//       {/* All other sections below remain the same */}



//     </div>
//   );
// };

// export default Movies;
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

      {/* Cast & Crew Sections */}
      <section className="py-8 md:py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Star Cast</h2>
            <p className="text-muted-foreground text-base md:text-lg">Meet the talented artists</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {castMembers.map((cast) => (
              <Card key={cast.id} className="border-2 border-gray-200 hover:border-[#0072ff] transition-all duration-300 hover:shadow-lg rounded-xl">
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

      <section className="py-8 md:py-10 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">Creative Crew</h2>
            <p className="text-gray-600 text-base md:text-lg">The masterminds behind the magic</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {crewMembers.map((crew) => (
              <Card key={crew.id} className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl">
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
