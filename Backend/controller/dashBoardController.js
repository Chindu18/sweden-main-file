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

    // ✅ Validate payment status
    if (!paymentStatus || !["pending", "paid", "failed"].includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid paymentStatus" });
    }

    // ✅ Validate collector
    const collector = await auth.findById(collectorId);
    if (!collector) return res.status(404).json({ success: false, message: "Collector not found" });
    if (collector.access !== "allowed")
      return res.status(403).json({ success: false, message: "Access denied. Collector not verified." });

    // ✅ Update booking
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { paymentStatus: paymentStatus.toLowerCase(), collectorType, collectorId },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // ✅ Generate QR Code
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

    // ✅ Email with inline + attachment QR
    await resend.emails.send({
      from: "MovieZone 🎬 <noreply@tamilmovie.no>",
      to: booking.email,
      subject: `🎟️ Ticket Confirmed – ${booking.movieName}`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; background: #0b0b0b; color: #fff; padding: 30px; border-radius: 14px;">
          <h2 style="color: #21e065; text-align: center; margin-bottom: 10px;">
            ✅ Payment ${paymentStatus.toUpperCase()}!
          </h2>

          <p style="text-align: center; color: #b5b5b5; font-size: 15px;">
            Your booking is confirmed! Get ready for an amazing cinema experience 🍿
          </p>

          <div style="background: linear-gradient(145deg, #1b1b1b, #0f0f0f); border: 2px solid #e50914; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: center;">
            <h3 style="color: #e50914;">🎟️ Movie Ticket</h3>
            <img src="cid:qrcode" alt="QR Code" style="margin: 15px 0; border-radius: 10px; width: 160px; height: 160px;" />
            <p><strong>🎬 Movie:</strong> ${booking.movieName}</p>
            <p><strong>📅 Date:</strong> ${formatDate(booking.date)}</p>
            <p><strong>⏰ Time:</strong> ${formatTime(booking.timing)}</p>
            <p><strong>💺 Seats:</strong> ${booking.seatNumbers.join(", ")}</p>
            <p><strong>💰 Total:</strong> SEK ${booking.totalAmount}</p>
            <p><strong>💳 Payment:</strong> ${paymentStatus.toUpperCase()}</p>
            <p><strong>📦 Mode:</strong> ${booking.ticketType}</p>
          </div>

          <p style="text-align: center; color: #bbb; margin-top: 20px; font-size: 14px;">
            Show this QR code at the theatre entrance.  
            <br><br>
            <span style="font-style: italic; color: #e50914;">
              “Relax, laugh, and live the movie — Sweden style 🇸🇪✨”
            </span>
          </p>

          <hr style="border: 0; border-top: 1px solid #444; margin: 25px 0;" />

          <p style="text-align: center; color: #999;">
            Thank you for booking with <strong style="color: #e50914;">MovieZone</strong>!  
            <br>See you at the big screen 🎥
          </p>
        </div>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: base64QR,
          content_id: "qrcode", // for inline display
          disposition: "inline",
        },
        {
          filename: "Your_Movie_Ticket_QR.png",
          content: base64QR,
          disposition: "attachment", // downloadable
        },
      ],
    });

    // ✅ Respond
    res.json({
      success: true,
      message: `Payment updated and confirmation email sent.`,
      data: booking,
    });
  } catch (error) {
    console.error("❌ Error in updatePaymentStatus:", error);
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
