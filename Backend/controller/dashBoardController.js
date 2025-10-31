// controllers/bookingController.js
import Booking from "../Models/Booking.js";
import Movies from "../Models/Movies.js";
import QRCode from "qrcode";
import { Resend } from "resend";
import auth from "../Models/users.js"

const resend = new Resend(process.env.RESEND_API_KEY);

export const getTotalSeats = async (req, res) => {
  try {
    const { movieName } = req.query; // get movieName from query params

    const matchStage = movieName ? { movieName } : {}; // filter only if movieName provided

    const totalSeats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSeats: { $sum: "$totalSeatsSelected" }
        }
      }
    ]);

    res.json({
      success: true,
      totalSeats: totalSeats[0]?.totalSeats || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const pendingMoney = async (req, res) => {
  try {
    const { paymentStatus,movieName} = req.query;
    if (!paymentStatus&&!movieName) {
      return res.status(400).json({
        success: false,
        message: "paymentStatus query parameter is required",
      });
    }

    // 1️⃣ Get all bookings with the requested payment status
    const bookings = await Booking.find({ movieName,paymentStatus, });

    // 2️⃣ Calculate total amount
    const totalAmount = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      success: true,
      message: "Pending payment bookings fetched successfully",
      data: bookings,
      totalAmount, // ✅ total sum of totalAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending bookings",
    });
  }
};





   const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const dateObj = new Date();
  dateObj.setHours(Number(hour) || 0, Number(minute) || 0);
  return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, collectorType, collectorId } = req.body;

    // ✅ 1. Validate payment status
    if (!paymentStatus || !["pending", "paid", "failed"].includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid paymentStatus" });
    }

    // ✅ 2. Validate collector access
    const collector = await auth.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ success: false, message: "Collector not found" });
    }

    if (collector.access !== "allowed") {
      return res.status(403).json({ success: false, message: "Access denied. Collector not verified." });
    }

    // ✅ 3. Update booking status
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      {
        paymentStatus: paymentStatus.toLowerCase(),
        collectorType,
        collectorId,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ 4. Generate QR code
    const qrDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        bookingId,
        movieName: booking.movieName,
        date: booking.date,
        timing: booking.timing,
        seatNumbers: booking.seatNumbers,
      })
    );
    const base64QR = qrDataUrl.split(",")[1];

    // ✅ 5. Send email
    await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
      to: booking.email,
      subject: `🎟️ Your Booking QR - ${bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #fff; background: #1c1c1c; padding: 20px;">
          <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
          <p style="color: #fff">Hi ${booking.name},</p>
          <p style="color: #fff">Here’s your QR code and ticket details.</p>
          <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px; color: #fff;">
            <p><strong>Movie:</strong> ${booking.movieName}</p>
            <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>Time:</strong> ${formatTime(booking.timing)}</p>
            <p><strong>Seats:</strong> ${booking.seatNumbers.join(", ")}</p>
            <p><strong>Total Amount:</strong> SEK${booking.totalAmount}</p>
            <p><strong>Payment:</strong> ${paymentStatus}</p>
            <p><strong>Payment Mode:</strong> ${booking.ticketType}</p>
            <p><strong>Show this QR code at the theatre entrance.</strong></p>
          </div>
        </div>`,
      attachments: [
        {
          filename: "qrcode.png",
          content: base64QR,
          content_id: "qrcode",
        },
      ],
    });

    // ✅ 6. Return success
    res.json({
      success: true,
      message: `Payment updated to ${paymentStatus}`,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};








///total shows with movie name filter



export const getTotalShows = async (req, res) => {
  try {
    const { movieName } = req.query; //
    if (!movieName) {
      return res.status(400).json({ success: false, message: "movieName is required" });
    }

    // Find movie by name
    const movie = await Movies.findOne({ title: movieName });

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Count total shows
    const totalShows = movie.shows?.length || 0;

    res.json({
      success: true,
      movieName: movie.title,
      totalShows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};






///id

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId parameter is required",
      });
    }

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

   
    res.json({
      success: true,
      message: "Booking fetched and QR sent to email successfully",
      data: booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
