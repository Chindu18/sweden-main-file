import Booking from "../Models/Booking.js";
import Movie from "../Models/Movies.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import QRCode from "qrcode";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import MovieGroup from "../Models/currentMovie.js";
import Blockedseats from "../Models/blocked.js";
import auth from "../Models/users.js"

const resend = new Resend(process.env.RESEND_API_KEY);

// ============= Cloudinary Configuration =============
cloudinary.config({
  cloud_name: "dfom7glyl",
  api_key: process.env.api_key,
  api_secret: process.env.api_pass,
});

// ============= Multer Storage Setup (Cloudinary) =============
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "photos") {
      return {
        folder: "movies/posters",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      };
    }
  },
});

export const uploadMovieFiles = multer({ storage }).array("photos", 3);

// ====================================================
// ================= Booking Controllers ===============
// ====================================================

// ---------------- Add Booking ----------------

// export const addBooking = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       date,
//       timing,
//       seatNumbers,
//       movieName,
//       kids,
//       adult,
//       totalAmount,
//       paymentStatus,
//       phone,
//       totalSeatsSelected,
//       ticketType,
//       seatLayoutSets,
//     } = req.body;

//     if (!seatLayoutSets || !Array.isArray(seatLayoutSets)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Seat layout not provided" });
//     }

//     // 1️⃣ Get existing bookings for this show
//     const existingBookings = await Booking.find({ date, timing });
//     const bookedSeats = existingBookings.flatMap((b) => b.seatNumbers);

//     // 2️⃣ Get blocked seats
//     const blockedDocs = await Blockedseats.find();
//     const blockedSeats = blockedDocs.flatMap((doc) => doc.blockedseats);

//     const unavailableSeats = [...bookedSeats, ...blockedSeats];

//     // 3️⃣ Check seat overlap
//     // Normalize seatNumbers if they are objects
// const selectedSeatNumbers = seatNumbers.map((s) =>
//   typeof s === "object" ? s.seat : s
// );

// // Check overlap again properly
// const overlap = selectedSeatNumbers.some((seat) =>
//   unavailableSeats.includes(seat)
// );

// if (overlap) {
//   return res.status(400).json({
//     success: false,
//     message: "❌ Booking failed — Some of your selected seats were just booked!",
//   });
// }


//     // 4️⃣ Generate Booking ID
//     const bookingId = "BKG-" + uuidv4().split("-")[0].toUpperCase();

//     // 5️⃣ Build seatDetails with row mapping
//     let seatCounter = 1;
//     const seatDetails = [];
//     seatLayoutSets.forEach((row, rowIndex) => {
//       const totalSeatsInRow = row[0];
//       for (let i = 0; i < totalSeatsInRow; i++) {
//         if (seatNumbers.includes(seatCounter)) {
//           seatDetails.push({ row: rowIndex + 1, seat: seatCounter });
//         }
//         seatCounter++;
//       }
//     });

//     // 6️⃣ Generate QR
//     const qrPayload = {
//       bookingId,
//       name,
//       email,
//       movieName,
//       date,
//       timing,
//       seatDetails,
//       totalAmount,
//       paymentStatus,
//       ticketType,
//     };
//     const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
//     const base64QR = qrDataUrl.split(",")[1];

//     // 7️⃣ Save booking
//     const booking = new Booking({
//       bookingId,
//       name,
//       email,
//       phone,
//       date,
//       timing,
//       movieName,
//       seatNumbers,
//       seatDetails,
//       kids,
//       adult,
//       totalAmount,
//       totalSeatsSelected: totalSeatsSelected || selectedSeatNumbers.length,
//       ticketType,
//       paymentStatus,
//     });
//     await booking.save();

//     // 8️⃣ Send email
//     await resend.emails.send({
//       from: "MovieZone <noreply@tamilmovie.no>",
//       to: email,
//       subject: `🎟️ Booking Confirmed — ${bookingId}`,
//       html: `
//         <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; padding: 20px;">
//           <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
//             <div style="background-color: #e50914; padding: 15px 25px; text-align: center;">
//               <h2 style="color: #fff; margin: 0;">🎬 MovieZone Booking Confirmed!</h2>
//             </div>
//             <div style="padding: 25px;">
//               <p>Hi <strong>${name}</strong>,</p>
//               <p>Your booking for <strong>${movieName}</strong> has been confirmed.</p>
//               <div style="background: #f1f3f5; border-radius: 8px; padding: 15px 20px; margin: 20px 0;">
//                 <p><strong>📅 Date:</strong> ${date}</p>
//                 <p><strong>⏰ Time:</strong> ${timing}</p>
//                 <p><strong>💺 Seats:</strong> ${seatNumbers.join(", ")}</p>
//                 <p><strong>💰 Total:</strong> SEK ${totalAmount}</p>
//                 <p><strong>🎟️ Ticket Type:</strong> ${ticketType}</p>
//               </div>
//               <div style="text-align: center; margin-top: 25px;">
//                 <img src="cid:qrcode" alt="QR Code" style="width: 180px; border: 2px solid #eee; border-radius: 10px;" />
//                 <p style="font-size: 14px; color: #777;">Scan this QR at the entrance</p>
//               </div>
//             </div>
//           </div>
//         </div>`,
//       attachments: [{ filename: "qrcode.png", content: base64QR, content_id: "qrcode" }],
//     });

//     // ✅ 9️⃣ Respond
//     return res.status(201).json({
//       success: true,
//       message: "Booking successful and email sent.",
//       data: booking,
//       bookingId,
//       qrCode: qrDataUrl,
//     });
//   } catch (error) {
//     console.error("❌ Booking error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Booking failed — " + error.message,
//     });
//   }
// };
export const addBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      date,
      timing,
      seatNumbers,
      movieName,
      kids,
      adult,
      totalAmount,
      paymentStatus,
      phone,
      totalSeatsSelected,
      ticketType,
      seatLayoutSets,
    } = req.body;

    if (!seatLayoutSets || !Array.isArray(seatLayoutSets)) {
      return res
        .status(400)
        .json({ success: false, message: "Seat layout not provided" });
    }

    // 1️⃣ Fetch existing bookings for this show
    const existingBookings = await Booking.find({ date, timing });
    const bookedSeats = existingBookings.flatMap((b) => b.seatNumbers);

    // 2️⃣ Get blocked seats
    const blockedDocs = await Blockedseats.find();
    const blockedSeats = blockedDocs.flatMap((doc) => doc.blockedseats);

    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    // 3️⃣ Normalize and check seat overlap
    const selectedSeatNumbers = seatNumbers.map((s) =>
      typeof s === "object" ? s.seat : s
    );

    const overlap = selectedSeatNumbers.some((seat) =>
      unavailableSeats.includes(seat)
    );

    if (overlap) {
      return res.status(400).json({
        success: false,
        message:
          "❌ Booking failed — Some of your selected seats were just booked!",
      });
    }

    // 4️⃣ Generate booking ID
    const bookingId = "BKG-" + uuidv4().split("-")[0].toUpperCase();

    // 5️⃣ Map seat details
    let seatCounter = 1;
    const seatDetails = [];
    seatLayoutSets.forEach((row, rowIndex) => {
      const totalSeatsInRow = row[0];
      for (let i = 0; i < totalSeatsInRow; i++) {
        if (selectedSeatNumbers.includes(seatCounter)) {
          seatDetails.push({ row: rowIndex + 1, seat: seatCounter });
        }
        seatCounter++;
      }
    });

    // Format seat display for email
    const formattedSeats = seatNumbers
      .map((s) => `R${s.row}-S${s.seat}`)
      .join(", ");

    // 6️⃣ Generate QR
    const qrPayload = {
      bookingId,
      name,
      movieName,
      date,
      timing,
      seatDetails,
      totalAmount,
      paymentStatus,
      ticketType,
    };
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
    const base64QR = qrDataUrl.split(",")[1];

    // 7️⃣ Save booking
    const booking = new Booking({
      bookingId,
      name,
      email,
      phone,
      date,
      timing,
      movieName,
      seatNumbers,
      seatDetails,
      kids,
      adult,
      totalAmount,
      totalSeatsSelected: totalSeatsSelected || selectedSeatNumbers.length,
      ticketType,
      paymentStatus,
    });
    await booking.save();

    // 8️⃣ Send stylish confirmation email
    await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
      to: email,
      subject: `🎬 Your MovieZone Booking Confirmation — ${bookingId}`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f5f6fa; padding: 20px;">
          <div style="max-width: 620px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #e50914; padding: 20px; text-align: center;">
              <h2 style="color: #fff; margin: 0;">🎟️ Your Ticket is Confirmed!</h2>
              <p style="color: #ffd700; font-style: italic; margin-top: 5px;">“Lights, Camera, and pure Entertainment await!”</p>
            </div>

            <!-- Body -->
            <div style="padding: 25px;">
              <p>Hey <strong>${name}</strong>,</p>
              <p>Thank you for choosing <strong>MovieZone</strong>! Your booking for <strong>${movieName}</strong> is successfully confirmed. Get ready for a cinematic experience!</p>

              <div style="background: #f9fafc; border-radius: 10px; padding: 15px 20px; margin: 20px 0;">
                <p><strong>🎬 Movie:</strong> ${movieName}</p>
                <p><strong>📅 Date:</strong> ${date}</p>
                <p><strong>⏰ Time:</strong> ${timing}</p>
                <p><strong>💺 Seats:</strong> ${formattedSeats}</p>
                <p><strong>👨 Adults:</strong> ${adult || 0} &nbsp; | &nbsp; 👦 Kids: ${kids || 0}</p>
                <p><strong>💰 Total Paid:</strong> SEK ${totalAmount}</p>
                <p><strong>🎟️ Ticket Type:</strong> ${ticketType}</p>
                <p><strong>📞 Contact:</strong> ${phone}</p>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <img src="cid:qrcode" alt="QR Code" style="width: 180px; border: 3px solid #eee; border-radius: 10px;" />
                <p style="font-size: 14px; color: #555; margin-top: 8px;">Show this QR code at the theatre entrance</p>
              </div>

              <hr style="border: none; border-top: 1px dashed #ddd; margin: 25px 0;">

              <div style="text-align: center;">
                <p style="font-size: 13px; color: #777; margin-bottom: 10px;">🍿 “The best stories are told on the big screen — see you at the movies!”</p>
                <p style="font-size: 12px; color: #999;">Booking ID: <strong>${bookingId}</strong></p>
              </div>
            </div>
          </div>
        </div>
      `,
      attachments: [
        { filename: "qrcode.png", content: base64QR, content_id: "qrcode" },
      ],
    });

    // ✅ Respond
    return res.status(201).json({
      success: true,
      message: "Booking successful and email sent.",
      data: booking,
      bookingId,
      qrCode: qrDataUrl,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Booking failed — " + error.message,
    });
  }
};




// ---------------- Get Booked Seats ----------------
export const getBookedSeats = async (req, res) => {
  const { date, timing } = req.query;
  try {
    const bookings = await Booking.find({ date, timing });
    const bookedSeats = bookings.flatMap((b) => b.seatNumbers);

    const blockedDocs = await Blockedseats.find();
    const blockedSeats = blockedDocs.flatMap((doc) => doc.blockedseats);

    const unavailableSeats = [...bookedSeats, ...blockedSeats];

    res.json({
      success: true,
      message: "Fetched unavailable seats successfully",
      data: unavailableSeats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====================================================
// ================= Movie Controllers =================
// ====================================================

// ---------------- Add Movie ----------------
export const addMovie = async (req, res) => {
  try {
    const {
      title,
      hero,
      heroine,
      villain,
      supportArtists,
      director,
      producer,
      musicDirector,
      cinematographer,
      showTimings,
      moviePosition,
      trailer,
    } = req.body;

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "Posters are required" });

    const uploadedPosters = req.files.map((file) => file.path);
    const shows = showTimings ? JSON.parse(showTimings) : [];

    const newMovie = new Movie({
      title,
      cast: { actor: hero, actress: heroine, villan: villain, supporting: supportArtists },
      crew: { director, producer, musicDirector, cinematographer },
      posters: uploadedPosters,
      trailer,
      shows,
    });

    const savedMovie = await newMovie.save();

    let movieGroup = (await MovieGroup.findOne()) || new MovieGroup();

    if (moviePosition === "1") movieGroup.movie1 = savedMovie._id;
    else if (moviePosition === "2") movieGroup.movie2 = savedMovie._id;
    else if (moviePosition === "3") movieGroup.movie3 = savedMovie._id;
    else return res.status(400).json({ success: false, message: "Invalid moviePosition" });

    const savedGroup = await movieGroup.save();

    res.status(201).json({
      success: true,
      message: "Movie saved successfully",
      data: { singleMovie: savedMovie, group: savedGroup },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update Movie ----------------
export const updatemovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hero,
      heroine,
      villain,
      supportArtists,
      director,
      producer,
      musicDirector,
      cinematographer,
      trailer,
      showTimings,
    } = req.body;

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // ✅ Update cast, crew, trailer
    movie.cast = { actor: hero, actress: heroine, villan: villain, supporting: supportArtists };
    movie.crew = { director, producer, musicDirector, cinematographer };
    movie.trailer = trailer;

    // ✅ Add new shows only
    const newShows = JSON.parse(showTimings || "[]");
    newShows.forEach((show) => {
      if (show.isNew) movie.shows.push(show);
    });

    // ✅ Update photos if new ones uploaded
    if (req.files && req.files.length > 0) {
      const uploadedPosters = req.files.map((f) => f.path);
      movie.posters = uploadedPosters;
    }

    await movie.save();
    res.json({ success: true, message: "Movie updated successfully", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Add Show ----------------
export const addShow = async (req, res) => {
  try {
    const { title, showTimings } = req.body;

    if (!title)
      return res.status(400).json({ success: false, message: "Movie ID is required" });

    const shows = typeof showTimings === "string" ? JSON.parse(showTimings) : showTimings;

    const movie = await Movie.findById(title);
    if (!movie)
      return res.status(404).json({ success: false, message: "Movie not found" });

    movie.shows = [...movie.shows, ...shows];

    const updatedMovie = await movie.save();
    res.status(200).json({
      success: true,
      message: "Show timings added successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error in addShow:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








// ✅ Update collector access (allow or deny)
export const updateCollectorAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { access } = req.body;

    if (!["allowed", "denied"].includes(access)) {
      return res.status(400).json({ success: false, message: "Invalid access type" });
    }

    const collector = await auth.findByIdAndUpdate(id, { access }, { new: true });
    if (!collector)
      return res.status(404).json({ success: false, message: "Collector not found" });

    res.status(200).json({ success: true, message: `Collector access set to ${access}`, collector });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete collector
export const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await auth.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Collector not found" });

    res.status(200).json({ success: true, message: "Collector deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};