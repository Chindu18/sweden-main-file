// import nodemailer from "nodemailer";

// let otpStore = {}; // Temporary in-memory store

// // ✅ Send OTP
// export const sendOTP = async (req, res) => {
//   const { email } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[email] = otp;

//   const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.email_name,
//     pass: process.env.email_pass,
//   },
// });


//   const mailOptions = {
//     from: process.env.email_name,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}: ${otp}`);
//     res.json({ success: true, message: "OTP sent successfully!" });

//     // Auto-delete OTP after 2 minutes
//     setTimeout(() => delete otpStore[email], 120000);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send OTP",error });
//   }
// };

// // ✅ Verify OTP
// export const verifyOTP = (req, res) => {
//   const { email, otp } = req.body;

//   if (otpStore[email] && otpStore[email] == otp) {
//     delete otpStore[email];
//     return res.json({ success:true, message: "OTP verified successfully!" });
//   }

//   res.json({ success: false, message: "Invalid or expired OTP" });
// };



// //booking confirmation mail

// export const confirmMail=async(req,res)=>{

  
//   const { email } = req.body;
 

//   const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.email_name,
//     pass: process.env.email_pass,
//   },
// });

// const mailOptions = {
//   from: process.env.email_name,
//   to: email,
//   subject: "Your Movie Confirmation",
//   html: `
//     <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
//       <h2 style="color: #e50914;">🎬 Movie Ticket Confirmation</h2>
//       <p>Hi,</p>
//       <p>Your payment was successful and your movie ticket has been booked!</p>

//       <div style="background-color: #2c2c2c; border-radius: 10px; padding: 15px; margin-top: 20px; text-align: center;">
//         <h3 style="color: #e50914;">Your Ticket</h3>
//         <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket12345" alt="QR Code" style="margin: 15px 0;" />
//         <p><strong>Movie:</strong> Avengers: Endgame</p>
//         <p><strong>Date:</strong> 12 Oct 2025</p>
//         <p><strong>Time:</strong> 7:30 PM</p>
//         <p><strong>Seat:</strong> D12</p>
//         <p><strong>Booking ID:</strong> #Ticket12345</p>
//       </div>

//       <p>Show this QR code at the theater entrance.</p>
//     </div>
//   `,
// };


//   try {
//     await transporter.sendMail(mailOptions);
    
//     res.json({ success: true, message: "movie booking confirmation mail sended!" });

    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send email for confirmation" });
//   }
// }

// export const holdingConfirm=async(req,res)=>{}








  

//   import formData from "form-data";
// import Mailgun from "mailgun.js";

// ;

// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: "api",
//   key: process.env.MAILGUN_API_KEY,
// });

// let otpStore = {}; // In-memory store

// // ✅ Send OTP
// export const sendOTP = async (req, res) => {
//   const { email } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[email] = otp;

//   try {
//     await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from: "MovieApp <mail@yourdomain.com>", // Must be a verified sender
//       to: [email], // Must be verified in sandbox
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
//     });

//     console.log(`✅ OTP sent to ${email}: ${otp}`);
//     res.json({ success: true, message: "OTP sent successfully!" });

//     setTimeout(() => delete otpStore[email], 120000);
//   } catch (error) {
//     console.error("❌ Mailgun error:", error);
//     res.status(500).json({ success: false, message: "Failed to send OTP", error });
//   }
// };


// // ✅ Verify OTP
// export const verifyOTP = (req, res) => {
//   const { email, otp } = req.body;

//   if (otpStore[email] && otpStore[email] == otp) {
//     delete otpStore[email];
//     return res.json({ success: true, message: "OTP verified successfully!" });
//   }

//   res.json({ success: false, message: "Invalid or expired OTP" });
// };

// // ✅ Booking confirmation mail
// export const confirmMail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from: "MovieApp <mail@yourdomain.com>",
//       to: [email],
//       subject: "🎬 Movie Ticket Confirmation",
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
//           <h2 style="color: #e50914;">🎬 Movie Ticket Confirmation</h2>
//           <p>Hi,</p>
//           <p>Your payment was successful and your movie ticket has been booked!</p>

//           <div style="background-color: #2c2c2c; border-radius: 10px; padding: 15px; margin-top: 20px; text-align: center;">
//             <h3 style="color: #e50914;">Your Ticket</h3>
//             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket12345" alt="QR Code" style="margin: 15px 0;" />
//             <p><strong>Movie:</strong> Avengers: Endgame</p>
//             <p><strong>Date:</strong> 12 Oct 2025</p>
//             <p><strong>Time:</strong> 7:30 PM</p>
//             <p><strong>Seat:</strong> D12</p>
//             <p><strong>Booking ID:</strong> #Ticket12345</p>
//           </div>

//           <p>Show this QR code at the theater entrance.</p>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: "Movie booking confirmation mail sent!" });
//   } catch (error) {
//     console.error("❌ Mailgun error:", error);
//     res.status(500).json({ success: false, message: "Failed to send confirmation email", error });
//   }
// };

// export const holdingConfirm = async (req, res) => {};






//for resend.com

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
let otpStore = {}; // Temporary in-memory store

// ✅ Send OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    await resend.emails.send({
      from: "Your App Name <onboarding@resend.dev>", // Or your verified domain
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully!" });

    // Auto-delete OTP after 2 minutes
    setTimeout(() => delete otpStore[email], 120000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error });
  }
};

// ✅ Verify OTP
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully!" });
  }

  res.json({ success: false, message: "Invalid or expired OTP" });
};

// ✅ Resend OTP
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({
      success: false,
      message: "No OTP found. Please request a new OTP first.",
    });
  }

  try {
    await resend.emails.send({
      from: "Your App Name <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code (Resent)",
      text: `Your OTP is ${otpStore[email]}. It will expire in 2 minutes.`,
    });

    console.log(`Resent OTP to ${email}: ${otpStore[email]}`);
    res.json({ success: true, message: "OTP resent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to resend OTP", error });
  }
};

// ✅ Movie Booking Confirmation Mail
export const confirmMail = async (req, res) => {
  const { email } = req.body;

  try {
    await resend.emails.send({
      from: "MovieZone <onboarding@resend.dev>",
      to: email,
      subject: "🎬 Movie Ticket Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
          <h2 style="color: #e50914;">🎬 Movie Ticket Confirmation</h2>
          <p>Hi,</p>
          <p>Your payment was successful and your movie ticket has been booked!</p>

          <div style="background-color: #2c2c2c; border-radius: 10px; padding: 15px; margin-top: 20px; text-align: center;">
            <h3 style="color: #e50914;">Your Ticket</h3>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket12345" alt="QR Code" style="margin: 15px 0;" />
            <p><strong>Movie:</strong> Avengers: Endgame</p>
            <p><strong>Date:</strong> 12 Oct 2025</p>
            <p><strong>Time:</strong> 7:30 PM</p>
            <p><strong>Seat:</strong> D12</p>
            <p><strong>Booking ID:</strong> #Ticket12345</p>
          </div>

          <p>Show this QR code at the theater entrance.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Movie booking confirmation mail sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send confirmation email", error });
  }
};


// POST /send-qr-email


