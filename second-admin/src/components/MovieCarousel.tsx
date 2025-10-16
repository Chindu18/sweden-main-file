import { useState } from "react";
import { ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

import movie1 from "@/assets/movie1.jpg";
import movie2 from "@/assets/movie2.jpg";
import movie3 from "@/assets/movie3.jpg";
import movie4 from "@/assets/movie4.jpg";
import movie5 from "@/assets/movie5.jpg";

const movies = [
  {
    id: 1,
    image: movie1,
    title: "Classic Tamil Film 1975",
    members: 850,
    collected: 12000,
    pending: 4500,
    bookings: [
      { name: "Kumar Rajan", email: "kumar@email.com", status: "Paid" },
      { name: "Priya Lakshmi", email: "priya@email.com", status: "Pending" },
      { name: "Vijay Anand", email: "vijay@email.com", status: "Paid" },
    ]
  },
  {
    id: 2,
    image: movie2,
    title: "Action Hero 1985",
    members: 1200,
    collected: 18000,
    pending: 6000,
    bookings: [
      { name: "Anitha Selvi", email: "anitha@email.com", status: "Paid" },
      { name: "Rajesh Kumar", email: "rajesh@email.com", status: "Paid" },
      { name: "Meena Sundari", email: "meena@email.com", status: "Pending" },
    ]
  },
  {
    id: 3,
    image: movie3,
    title: "Romance Classic 1995",
    members: 950,
    collected: 14000,
    pending: 5000,
    bookings: [
      { name: "Surya Prakash", email: "surya@email.com", status: "Pending" },
      { name: "Divya Bharathi", email: "divya@email.com", status: "Paid" },
      { name: "Karthik Raj", email: "karthik@email.com", status: "Paid" },
    ]
  },
  {
    id: 4,
    image: movie4,
    title: "Family Drama 2005",
    members: 1100,
    collected: 16500,
    pending: 5500,
    bookings: [
      { name: "Lakshmi Devi", email: "lakshmi@email.com", status: "Paid" },
      { name: "Arjun Shetty", email: "arjun@email.com", status: "Paid" },
      { name: "Deepa Rani", email: "deepa@email.com", status: "Pending" },
    ]
  },
  {
    id: 5,
    image: movie5,
    title: "Modern Blockbuster 2024",
    members: 1500,
    collected: 25000,
    pending: 8000,
    bookings: [
      { name: "Arun Kumar", email: "arun@email.com", status: "Paid" },
      { name: "Sangeetha Iyer", email: "sangeetha@email.com", status: "Paid" },
      { name: "Bharath Raj", email: "bharath@email.com", status: "Pending" },
    ]
  },
];

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<typeof movies[0] | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const getVisibleMovies = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(movies[(currentIndex + i) % movies.length]);
    }
    return visible;
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
              Movie Collection
            </span>
          </h2>
          
          <div className="relative">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="icon"
                className="shrink-0 hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                {getVisibleMovies().map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="cursor-pointer group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-semibold text-sm">{movie.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={nextSlide}
                variant="outline"
                size="icon"
                className="shrink-0 hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedMovie?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedMovie && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold text-primary">{selectedMovie.members}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <p className="text-sm text-green-700">Collected</p>
                  <p className="text-2xl font-bold text-green-700 flex items-center justify-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {selectedMovie.collected}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                  <p className="text-sm text-orange-700">Pending</p>
                  <p className="text-2xl font-bold text-orange-700 flex items-center justify-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {selectedMovie.pending}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                  <p className="text-sm text-blue-700">Total</p>
                  <p className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {selectedMovie.collected + selectedMovie.pending}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMovie.bookings.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieCarousel;
