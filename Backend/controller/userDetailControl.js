import Booking from "../Models/Booking.js";
import multer from "multer";
import Movie from "../Models/Movies.js";


import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import QRCode from "qrcode";

cloudinary.config({
    cloud_name:'dfom7glyl',
    api_key:process.env.api_key,
    api_secret:process.env.api_pass,
});

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// Add a booking
// Controllers/yourController.js

import { v4 as uuidv4 } from 'uuid'; 

// export const addBooking = async (req, res) => {
//   try {
//     const { date, timing, seatNumbers ,data} = req.body;

//     // Check if seats are already booked
//     const existingBookings = await Booking.find({ date, timing });
//     const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);

//     const overlap = seatNumbers.some(seat => bookedSeats.includes(seat));
//     if (overlap) {
//       return res.status(400).json({ message: "Some seats are already booked", success: false });
//     }

//     // 👇 generate a bookingId here
//     const bookingId = "BKG-" +  uuidv4().split("-")[0];


//     //qr genreating
// const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
//   bookingId,
//   name: req.body.name,
//   email: req.body.email,
//   movieName: req.body.movieName,
//   date: req.body.date,
//   timing: req.body.timing,
//   seatNumbers: req.body.seatNumbers,
//   totalAmount: req.body.totalAmount,
// }), {
//   errorCorrectionLevel: "H",
//   type: "image/png",
//   scale: 10,
//   margin: 2,
// });


//     // Save booking with bookingId
//     const booking = new Booking({
//       ...req.body,
//       bookingId
//     });
//     await booking.save();
   

//   try {
//     await resend.emails.send({
//       from: "MovieZone <onboarding@resend.dev>",
//       to: email,
//       subject: `🎟️ Your Booking QR - ${bookingId}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
//           <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
//           <p>Hi,</p>
//           <p>Here’s your QR code and ticket details.</p>
//           <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px;">
//             <p><strong>Movie:</strong> ${qrData.movieName}</p>
//             <p><strong>Date:</strong> ${qrData.date}</p>
//             <p><strong>Time:</strong> ${qrData.timing}</p>
//             <p><strong>Seats:</strong> ${qrData.seatNumbers.join(", ")}</p>
//             <p><strong>Total Amount:</strong> ₹${qrData.totalAmount}</p>
//             <p><strong>Payment:</strong> ${qrData.paymentStatus}</p>
//             <img src="data:image/png;base64,${qrData.qrBase64}" 
//                  alt="QR Code" 
//                  style="margin-top: 15px; border: 2px solid #e50914; border-radius: 10px;" />
//           </div>
//           <p style="margin-top: 20px;">Show this QR at the theater entrance 🎟️</p>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: "QR email sent successfully!" });
//   } catch (err) {
//     console.error("❌ Error sending mail:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

//     res.status(201).json({ 
//       message: "Booking saved successfully",
//       success: true,
//       data:booking,
//       qrCode: qrDataUrl,
//       bookingId 
//     });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ message: error.message, success: false });
//   }
// };



// export const addBooking = async (req, res) => {
//   try {
//     const { name, email, date, timing, seatNumbers, movieName, totalAmount, paymentStatus } = req.body;

//     // Check if seats are already booked
//     const existingBookings = await Booking.find({ date, timing });
//     const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);

//     const overlap = seatNumbers.some(seat => bookedSeats.includes(seat));
//     if (overlap) {
//       return res.status(400).json({ message: "Some seats are already booked", success: false });
//     }

//     // Generate bookingId
//     const bookingId = "BKG-" + uuidv4().split("-")[0];

//     // Generate QR code
//     const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
//       bookingId,
//       name,
//       email,
//       movieName,
//       date,
//       timing,
//       seatNumbers,
//       totalAmount,
//       paymentStatus
//     }), {
//       errorCorrectionLevel: "H",
//       type: "image/png",
//       scale: 10,
//       margin: 2,
//     });

//     // Save booking
//     const booking = new Booking({
//       ...req.body,
//       bookingId
//     });
//     await booking.save();

//     // Send email
//     try {
//       await resend.emails.send({
//         from: "MovieZone <onboarding@resend.dev>",
//         to: email,
//         subject: `🎟️ Your Booking QR - ${bookingId}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
//             <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
//             <p>Hi ${name},</p>
//             <p>Here’s your QR code and ticket details.</p>
//             <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px;">
//               <p><strong>Movie:</strong> ${movieName}</p>
//               <p><strong>Date:</strong> ${date}</p>
//               <p><strong>Time:</strong> ${timing}</p>
//               <p><strong>Seats:</strong> ${seatNumbers.join(", ")}</p>
//               <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
//               <p><strong>Payment:</strong> ${paymentStatus}</p>
//               <img src="${qrDataUrl}" 
//                    alt="QR Code" 
//                    style="margin-top: 15px; border: 2px solid #e50914; border-radius: 10px;" />
//             </div>
//             <p style="margin-top: 20px;">Show this QR at the theater entrance 🎟️</p>
//           </div>
//         `,
//       });
//     } catch (err) {
//       console.error("❌ Error sending mail:", err.message);
//       return res.status(500).json({ success: false, message: "Booking saved but email failed: " + err.message });
//     }

//     // ✅ Send single response
//     res.status(201).json({ 
//       message: "Booking saved and email sent successfully",
//       success: true,
//       data: booking,
//       qrCode: qrDataUrl,
//       bookingId
//     });

//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ message: error.message, success: false });
//   }
// };
export const addBooking = async (req, res) => {
  try {
    const { name, email, date, timing, seatNumbers, movieName, totalAmount, paymentStatus } = req.body;

    // Check if seats are already booked
    const existingBookings = await Booking.find({ date, timing });
    const bookedSeats = existingBookings.flatMap(b => b.seatNumbers);

    const overlap = seatNumbers.some(seat => bookedSeats.includes(seat));
    if (overlap) {
      return res.status(400).json({ message: "Some seats are already booked", success: false });
    }

    // Generate bookingId
    const bookingId = "BKG-" + uuidv4().split("-")[0];

    // Generate QR code as base64
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
      bookingId,
      name,
      email,
      movieName,
      date,
      timing,
      seatNumbers,
      totalAmount,
      paymentStatus
    }));

    // Extract base64 data
    const base64QR = qrDataUrl.split(",")[1];

    // Save booking
    const booking = new Booking({
      ...req.body,
      bookingId,
    });
    await booking.save();

    // Send email with embedded image (cid)
    try {
      await resend.emails.send({
        from: "MovieZone <onboarding@resend.dev>",
        to: email,
        subject: `🎟️ Your Booking QR - ${bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
            <h2 style="color: #e50914;">🎬 Booking Confirmation</h2>
            <p>Hi ${name},</p>
            <p>Here’s your QR code and ticket details.</p>
            <div style="background-color: #2c2c2c; padding: 15px; border-radius: 8px;">
              <p><strong>Movie:</strong> ${movieName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${timing}</p>
              <p><strong>Seats:</strong> ${seatNumbers.join(", ")}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p><strong>Payment:</strong> ${paymentStatus}</p>
              <img src="cid:qrcode" 
                   alt="QR Code" 
                   style="margin-top: 15px; border: 2px solid #e50914; border-radius: 10px; width: 180px;" />
            </div>
            <p style="margin-top: 20px;">Show this QR at the theater entrance 🎟️</p>
          </div>
        `,
        attachments: [
          {
            filename: "qrcode.png",
            content: base64QR,
            content_id: "qrcode",
          },
        ],
      });
    } catch (err) {
      console.error("❌ Error sending mail:", err.message);
      return res.status(500).json({ success: false, message: "Booking saved but email failed: " + err.message });
    }

    // ✅ Response
    res.status(201).json({
      message: "Booking saved and email sent successfully",
      success: true,
      data: booking,
      qrCode: qrDataUrl,
      bookingId,
    });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};




// Get booked seats for a date & timing
export const getBookedSeats = async (req, res) => {
  const { date, timing } = req.query;
  try {
    const bookings = await Booking.find({ date, timing });
    const seats = bookings.flatMap(b => b.seatNumbers);
    res.json({success:true,
      message:"fetchehed seat successfully",
      data:seats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






// ---------------------- Multer Storage ----------------------







// ---------------------- Add Movie Controller ----------------------

// Controllers/userDetailControl.js


// ---------------------- Multer Local Storage ----------------------


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "movies/posters",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
export const upload = multer({ storage });


// ---------------------- Add Movie Controller ----------------------



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
    } = req.body;

    // ✅ Direct Cloudinary URLs from multer-storage-cloudinary
    const uploadedPosters = req.files.map((file) => file.path);

    // ✅ Parse show timings
    let shows = [];
    try {
      shows = showTimings ? JSON.parse(showTimings) : [];
    } catch {
      shows = [];
    }

    // ✅ Create and save movie
    const newMovie = new Movie({
      title,
      cast: {
        actor: hero,
        actress: heroine,
        villan: villain,
        supporting: supportArtists,
      },
      crew: {
        director,
        producer,
        musicDirector,
        cinematographer,
      },
      posters: uploadedPosters, // ✅ Cloudinary URLs auto stored
      shows,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ success: true, message: "Movie added successfully", data: savedMovie });
  } catch (error) {
    console.error("Error in addMovie:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
