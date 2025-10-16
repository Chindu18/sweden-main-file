import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IndianRupee, Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import Scanner from "./Scanner";

const Dashboard = () => {
  const backend_url = "https://swedenn-backend.onrender.com";

  const [movie, setMovie] = useState({});
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingToggleIndex, setPendingToggleIndex] = useState(null);
  const [totalSeats, setTotalSeats] = useState(0);
  const [paidMoney, setPaidMoney] = useState(0);
  const [pendingMoney, setPendingMoney] = useState(0);
  const [totalShow, setTotalShows] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [singleId, setsingleId] = useState({});

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);
  // Fetch latest movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${backend_url}/movie/getmovie`);
        const data = response.data.data;
        if (data && data.length > 0) setMovie(data[data.length - 1]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, []);

  // Fetch dashboard data for selected movie
  useEffect(() => {
    if (!movie.title) return;
    const fetchData = async () => {
      try {
        const seatsResp = await axios.get(`${backend_url}/dashboard/seats`, { params: { movieName: movie.title } });
        setTotalSeats(seatsResp.data.totalSeats);

        const totalShowResp = await axios.get(`${backend_url}/dashboard/totalshow`, { params: { movieName: movie.title } });
        setTotalShows(totalShowResp.data.totalShows);

        const pendingResp = await axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "pending" } });
        const paidResp = await axios.get(`${backend_url}/dashboard/pending`, { params: { movieName: movie.title, paymentStatus: "paid" } });

        const combined = [...pendingResp.data.data, ...paidResp.data.data];
        setAllBookings(combined);
        setBookings(combined);

        setPendingMoney(pendingResp.data.totalAmount);
        setPaidMoney(paidResp.data.totalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [movie]);

  // Filter bookings based on status, method, and search
  useEffect(() => {
    let filtered = allBookings;

    // Filter by status
    if (paymentStatus.toLowerCase() === "pending") {
      filtered = filtered.filter(b => b.paymentStatus?.toString().trim().toLowerCase() === "pending");
    } else if (paymentStatus.toLowerCase() === "paid") {
      filtered = filtered.filter(b => b.paymentStatus?.toString().trim().toLowerCase() === "paid");
    }

    // Filter by payment method (ticketType in backend)
if (paymentMethod.toLowerCase() === "online") {
  filtered = filtered.filter(
    b => b.ticketType?.toString().trim().toLowerCase() === "online"
  );
} else if (paymentMethod.toLowerCase() === "offline") {
  filtered = filtered.filter(
    b => b.ticketType?.toString().trim().toLowerCase() === "video speed"
  );
}


    setBookings(filtered);
  }, [paymentStatus, paymentMethod, allBookings, searchId]);

  const confirmToggleStatus = async () => {
    if (pendingToggleIndex === null) return;
    const booking = bookings[pendingToggleIndex];

    try {
      const res = await axios.put(`${backend_url}/dashboard/booking/${booking.bookingId}/status`, { paymentStatus: "paid" });
      const updatedBooking = res.data.data;
      setsingleId(updatedBooking);

      setBookings(prev => {
        const newBookings = [...prev];
        newBookings[pendingToggleIndex].paymentStatus = "paid";
        return newBookings;
      });

      setPendingMoney(prev => prev - booking.totalAmount);
      setPaidMoney(prev => prev + booking.totalAmount);

      try {
        await axios.post(`${backend_url}/booking/paid`, { email: updatedBooking.email || 'chinraman8@gmail.com', bookingId: updatedBooking.bookingId });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setPendingToggleIndex(null);
      setShowModal(false);
    }
  };

  const cancelToggleStatus = () => {
    setPendingToggleIndex(null);
    setShowModal(false);
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-primary">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">video speed</p>
                <p className="text-3xl font-bold mt-2">{totalSeats}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-green-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-3xl font-bold mt-2 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" /> {paidMoney}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-orange-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">online to others</p>
                <p className="text-3xl font-bold mt-2 flex items-center gap-1">
                  <IndianRupee className="h-6 w-6" /> {pendingMoney}
                </p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg border-l-4 border-l-purple-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Shows</p>
                <p className="text-3xl font-bold mt-2">{totalShow}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </CardContent>
          </Card>
        </div>

       
      </div>
    </div>

    <Scanner/>
    </>
  );
};

export default Dashboard;
