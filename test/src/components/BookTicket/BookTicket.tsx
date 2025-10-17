import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import { Users, Ticket, CreditCard, Film } from "lucide-react";

import TicketForm from "./TicketForm";
import OTPVerification from "./OTPVerification";
import PriceSummary from "./PriceSummary";
import SeatLayout from "./SeatLayout";

import { Movie, Show, BookingData } from "./types";

const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour) || 0, Number(minute) || 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const formatDate = (dateString: string) => {
  const options = { weekday: "short", day: "numeric", month: "short" } as const;
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const backend_url = "https://swedenn-backend.onrender.com";

const BookTicket: React.FC = () => {
  // -------------------- State --------------------
  const [movie, setMovie] = useState<Movie>({
    title: "",
    cast: { hero: "", heroine: "", villain: "", supportArtists: [] },
    crew: { director: "", producer: "", musicDirector: "", cinematographer: "" },
    photos: [],
    shows: [],
    bookingOpenDays: 3,
  });

  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adult, setAdult] = useState(0);
  const [kids, setKids] = useState(0);
  const [ticketType, setTicketType] = useState<string>("");
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [Phone, setPhone] = useState("");

  // otp
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // qr
  const [qr, setQr] = useState("");

  // -------------------- Fetch Movie --------------------
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${backend_url}/movie/getmovie`);
        const data = response.data.data;
        if (data && data.length > 0) {
          const lastMovie = data[data.length - 1];
          setMovie(lastMovie);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, []);

  // -------------------- fetch booked seats --------------------
  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
    axios
      .get(`${backend_url}/api/bookedSeats`, { params: { date: selectedDate, timing: selectedTime } })
      .then((res) => {
        setBookedSeats(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedDate, selectedTime]);

  // Reset seats on ticket type change
  useEffect(() => {
    setAdult(0);
    setKids(0);
    setSelectedSeats([]);
  }, [ticketType]);

  // -------------------- Get Selected Show --------------------
  const selectedShow = movie.shows?.find((s) => s.date === selectedDate && s.time === selectedTime);

  // -------------------- Get Dynamic Ticket Price --------------------
  const getTicketPrice = (type: string) => {
    if (!selectedShow) return { adult: 0, kids: 0 };
    if (type === "online") return selectedShow.prices.online;
    if (type === "video") return selectedShow.prices.videoSpeed;
    if (type === "others" || type === "soder") return (selectedShow.prices as any).others || selectedShow.prices.soder || { adult: 0, kids: 0 };
    return { adult: 0, kids: 0 };
  };

  const ticketPrice = getTicketPrice(ticketType);
  let totalSeatsSelected = Number(adult + kids);
  const calculateTotal = () => adult * ticketPrice.adult + kids * ticketPrice.kids;

  // -------------------- Seat Selection --------------------
  const handleSeatClick = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) {
      toast({ title: "Seat Unavailable", description: "This seat is already booked.", variant: "destructive" });
      return;
    }
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= totalSeatsSelected) {
        toast({
          title: "Maximum Seats Selected",
          description: `You can only select ${totalSeatsSelected} seat(s).`,
          variant: "destructive",
        });
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (!name || !email || selectedSeats.length !== totalSeatsSelected || !ticketType || !selectedShow || !Phone) {
      toast({ title: "Missing Information", description: "Please fill all fields and select seats.", variant: "destructive" });
      return;
    }

    const paymentStatus = "pending";
    const phoneNumber = Number(Phone);
    if (isNaN(phoneNumber)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }

    const booking: BookingData & any = {
      name,
      email,
      phone: Phone,
      date: selectedShow.date,
      timing: selectedShow.time,
      movieName: movie.title,
      seatNumbers: selectedSeats,
      paymentStatus,
      adult,
      totalSeats: totalSeatsSelected,
      kids,
      ticketType,
      totalAmount: calculateTotal(),
      collectorType: "",
      collectorId: "",
    };

    try {
      const response = await axios.post(`${backend_url}/api/addBooking`, booking);
      if (response.data.success) {
        setBookedSeats([...bookedSeats, ...selectedSeats]);
        setQr(response.data.qrCode);
        setBookingData(response.data || booking);
        setShowQRModal(true);

        if (ticketType === "online") {
          toast({ title: "Mode: Online — we will get back soon for banking details", description: "Mode: Online — we will get back soon for banking details" });
        } else if (ticketType === "video speed") {
          toast({ title: "Mode: Video Speed", description: "Mode: Video Speed,Your ticket has been booked." });
        } else if (ticketType === "others") {
          toast({ title: "Mode: Others", description: "Mode: Others,Your ticket has been booked." });
        } else {
          toast({ title: "Booking Successful!", description: "Your ticket has been booked." });
        }

        // Reset form (keeps movie & show selection)
        setName("");
        setEmail("");
        setAdult(0);
        setKids(0);
        setTicketType("");
        setSelectedSeats([]);
        setPhone("");
      }
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.response?.data?.message || "Something went wrong", variant: "destructive" });
      console.log(error);
    }
  };

  // OTP functions (same API)
  const sendOtp = async () => {
    if (!email) {
      toast({ title: "Enter Email", description: "Please enter your email first.", variant: "destructive" });
      return;
    }
    try {
      await axios.post(`${backend_url}/otp/send-otp`, { email });
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email for OTP." });
    } catch (err: any) {
      toast({ title: "Failed to send OTP", description: "Try again.", variant: "destructive" });
      console.log(err?.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${backend_url}/otp/verify-otp`, { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast({ title: "OTP Verified", description: "You can now book your tickets." });
      } else {
        toast({ title: "Invalid OTP", description: res.data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Failed to verify OTP", description: "Try again.", variant: "destructive" });
      console.log(err?.message);
    }
  };

  // seat layout sets (same as your original)
  const seatLayoutSets = [
    [19, 19, 21, 21, 21, 21, 21, 21],
    [19, 19, 19, 19, 19, 19, 19, 19, 19],
    [7],
  ];

  // Helper: filter future shows
  const futureShows = (movie.shows || []).filter((show: Show) => {
    try {
      const [hours, minutes] = show.time.includes(":") ? show.time.split(":").map(Number) : [0, 0];
      const showDateTime = new Date(show.date);
      showDateTime.setHours(hours || 0, minutes || 0, 0, 0);
      return showDateTime >= new Date();
    } catch {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4">Book Your Tickets</h1>
          <div className="w-32 h-1 bg-accent mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-lg mt-4">Select your seats and complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-border hover:border-accent/50 transition-colors shadow-xl animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white">
                <CardTitle className="text-3xl flex items-center gap-3 tracking-[2px]">
                  <Ticket className="w-8 h-8" /> Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <TicketForm name={name} email={email} phone={Phone} setName={setName} setEmail={setEmail} setPhone={setPhone} />

                <div className="space-y-2">
                  <Label className="text-lg flex items-center gap-2">
                    <Film className="w-5 h-5 text-accent" /> Shows
                  </Label>
                  <div>
                    {futureShows.map((show, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedShowId(index);
                          setSelectedDate(show.date);
                          setSelectedTime(show.time);
                        }}
                        className={`m-2 px-6 border rounded-lg p-3 text-center cursor-pointer transition-all ${
                          selectedShowId === index ? "bg-accent text-white border-accent" : "bg-background border-border hover:border-accent"
                        }`}
                      >
                        <p className="font-semibold">{formatTime(show.time)}</p>
                        <p className="text-sm">{formatDate(show.date)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border hover:border-accent/50 transition-colors shadow-xl animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-secondary to-cinema-black text-white">
                <CardTitle className="text-3xl flex items-center gap-3 tracking-[2px]">
                  <CreditCard className="w-8 h-8" /> PAYMENT METHOD
                </CardTitle>
              </CardHeader>
              <CardContent className=" md:p-6 space-y-4 ">
                <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:gap-4 mb-6">
                  {["online", "video", "others"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTicketType(type)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg border-2 transition-all duration-200 ${
                        ticketType === type ? "bg-accent text-white border-accent" : "bg-background border-border hover:border-accent"
                      }`}
                    >
                      {type === "online" ? "Online Payment" : type === "video" ? "Video Speed" : "others"}
                    </button>
                  ))}
                </div>

                {ticketType && (
                  <div className="space-y-6 border-2 border-border rounded-lg p-4 sm:p-6">
                    {/* Adult */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <Label className="text-lg font-semibold mb-2 sm:mb-0">Adult (SEK{ticketPrice.adult})</Label>
                      <div className="flex justify-center sm:justify-start items-center gap-2">
                        <button onClick={() => setAdult(Math.max(adult - 1, 0))} className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base">-</button>
                        <span className="w-10 text-center text-lg">{adult}</span>
                        <button onClick={() => setAdult(adult + 1)} className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base">+</button>
                      </div>
                    </div>

                    {/* Kids */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <Label className="text-lg font-semibold mb-2 sm:mb-0">Kids (SEK{ticketPrice.kids})</Label>
                      <div className="flex justify-center sm:justify-start items-center gap-2">
                        <button onClick={() => setKids(Math.max(kids - 1, 0))} className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base">-</button>
                        <span className="w-10 text-center text-lg">{kids}</span>
                        <button onClick={() => setKids(kids + 1)} className="px-4 py-2 bg-gray-200 rounded text-lg sm:text-base">+</button>
                      </div>
                    </div>

                    <p className="text-lg font-semibold text-center sm:text-left">Total Seats: {totalSeatsSelected}</p>

                    <div className="pt-4 border-t-2 border-border mt-4">
                      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-accent/10 rounded-lg gap-2 sm:gap-0">
                        <span className="text-xl font-bold">Total Amount:</span>
                        <span className="text-2xl font-bold text-accent">SEK{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-accent shadow-xl animate-slide-up">
              <CardContent className="p-6">
                <Label className="text-foreground text-lg font-semibold mb-3 block">Selected Seats</Label>
                <div className="p-4 bg-muted rounded-lg min-h-[80px] flex items-center justify-center">
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.sort((a, b) => a - b).map((seat) => (
                        <span key={seat} className="px-4 py-2 bg-seat-selected text-white rounded-lg font-bold text-lg shadow-lg">{seat}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-lg">No seats selected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="border-2 border-border rounded-lg p-6">
              <OTPVerification email={email} otp={otp} setOtp={setOtp} otpSent={otpSent} otpVerified={otpVerified} sendOtp={sendOtp} verifyOtp={verifyOtp} />

              <Button onClick={handleBooking} className="w-full bg-accent hover:bg-accent/90 text-white font-bold text-2xl py-8 rounded-xl shadow-2xl cinema-glow hover:scale-105 transition-all duration-300" size="lg" disabled={!otpVerified}>
                Book Now
              </Button>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-border shadow-2xl animate-scale-in h-full max-w-full mx-auto">
              <CardHeader className="bg-gradient-to-r from-cinema-black to-secondary text-white">
                <CardTitle className="text-2xl sm:text-3xl tracking-[2px] text-center sm:text-left">Select Your Seats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="mb-8 sm:mb-12">
                  <div className="bg-gradient-to-r from-transparent via-accent to-transparent h-1 rounded-full mb-2 sm:mb-3 shadow-lg cinema-glow"></div>
                  <p className="text-center text-base sm:text-lg font-bold text-foreground tracking-wider">THIS IS THE SCREEN</p>
                </div>

                <SeatLayout seatLayoutSets={seatLayoutSets} bookedSeats={bookedSeats} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

<Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="w-full max-w-sm sm:max-w-[400px] rounded-2xl p-6 text-center">
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl font-bold">Your Booking QR Code</DialogTitle>
    </DialogHeader>

    <div className="flex flex-col items-center gap-4 mt-4">
      {/* QR code with booking ID only */}
      <QRCodeSVG value={bookingData?.bookingId || "TEMP-ID"} size={200} bgColor="#fff" fgColor="#e50914" />

      {/* Ticket details below QR */}
      <div className="bg-black/80 text-white p-4 rounded-lg w-full text-left">
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Date:</strong> {selectedDate ? formatDate(selectedDate) : ""}</p>
        <p><strong>Time:</strong> {selectedTime ? formatTime(selectedTime) : ""}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
        <p><strong>Ticket Type:</strong> {bookingData?.ticketType || ticketType}</p>
        <p><strong>Total Amount:</strong> SEK {bookingData?.totalAmount || calculateTotal()}</p>
        <p><strong>Email:</strong> {bookingData?.email || email}</p>
        <p><strong>Phone:</strong> {bookingData?.phone || Phone}</p>
      </div>
    </div>
  </DialogContent>
</Dialog>



    </div>
  );
};

export default BookTicket;
