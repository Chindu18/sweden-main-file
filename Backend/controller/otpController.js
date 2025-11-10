// backend/controllers/emailController.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary in-memory store for OTPs
let otpStore = {};

// -------------------- SEND OTP --------------------
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    await resend.emails.send({
      from: "Sweden Tamil Flim <noreply@tamilmovie.no>",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully!" });

    // Auto-delete OTP after 2 minutes
    setTimeout(() => delete otpStore[email], 120000);
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error });
  }
};

// -------------------- VERIFY OTP --------------------
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully!" });
  }

  res.status(400).json({ success: false, message: "Invalid or expired OTP" });
};

// -------------------- RESEND OTP --------------------
export const resendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "No OTP found. Please request a new OTP first." });
  }

  try {
    await resend.emails.send({
      from: "Sweden Tamil Flim <noreply@tamilmovie.no>",
      to: email,
      subject: "Your OTP Code (Resent)",
      text: `Your OTP is ${otpStore[email]}. It will expire in 2 minutes.`,
    });

    console.log(`✅ Resent OTP to ${email}: ${otpStore[email]}`);
    res.json({ success: true, message: "OTP resent successfully!" });
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP", error });
  }
};

// -------------------- BOOKING CONFIRMATION --------------------
export const confirmMail = async (req, res) => {
  const { email, movie, date, time, seat, bookingId } = req.body;
  if (!email || !movie || !date || !time || !seat || !bookingId) {
    return res
      .status(400)
      .json({ success: false, message: "All booking fields are required" });
  }

  try {
    await resend.emails.send({
      from: "Sweden Tamil Flim <noreply@tamilmovie.no>",
      to: email,
      subject: "🎬 Your Movie Ticket is Confirmed! 🍿",
      html: `
        <div style="font-family: 'Poppins', sans-serif; background: linear-gradient(145deg, #0d0d0d, #1a1a1a); color: #fff; padding: 30px; border-radius: 10px;">
          <div style="text-align: center;">
            <h1 style="color: #e50914; font-size: 28px; margin-bottom: 5px;">🎟️ Booking Confirmed!</h1>
            <p style="font-size: 16px; color: #bbb;">Your ticket is ready — get ready for an amazing showtime!</p>
          </div>

          <div style="background: #111; border: 1px solid #e50914; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: center; box-shadow: 0 0 15px #e5091466;">
            <h2 style="color: #ff4545; margin-bottom: 10px;">🎬 ${movie}</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}" 
                 alt="QR Code" 
                 style="border-radius: 10px; margin: 15px auto; display: block; border: 2px solid #e50914;" />
            
            <div style="text-align: left; color: #ddd; line-height: 1.6; font-size: 15px; margin-top: 10px;">
              <p><strong>🎞 Movie:</strong> ${movie}</p>
              <p><strong>📅 Date:</strong> ${date}</p>
              <p><strong>⏰ Time:</strong> ${time}</p>
              <p><strong>💺 Seat:</strong> ${seat}</p>
              <p><strong>🆔 Booking ID:</strong> #${bookingId}</p>
            </div>
          </div>

          <div style="margin-top: 25px; text-align: center; font-size: 14px; color: #aaa;">
            <p>🎉 Your booking has been successfully confirmed.</p>
            <p>Show this QR code at the theater entrance for a smooth entry.</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;" />
            <p style="font-style: italic; color: #f5f5f5;">
              “Sit back, relax, and enjoy the magic on the big screen — straight from MovieZone to your heart.” 💫
            </p>
            <p style="margin-top: 8px; color: #999;">— The MovieZone Team 🎥</p>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">Enjoy the show in Sweden 🇸🇪</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Booking confirmation sent to ${email}`);
    res.json({ success: true, message: "Booking confirmation email sent!" });
  } catch (error) {
    console.error("❌ Resend booking mail error:", error);
    res.status(500).json({ success: false, message: "Failed to send confirmation email", error });
  }
};

