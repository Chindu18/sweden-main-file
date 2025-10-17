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
      from: "MovieZone <noreply@tamilmovie.no>",
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
      from: "MovieZone <noreply@tamilmovie.no>",
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
    return res.status(400).json({ success: false, message: "All booking fields are required" });
  }

  try {
    await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
      to: email,
      subject: "🎬 Movie Ticket Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1c1c1c; color: #fff; padding: 20px;">
          <h2 style="color: #e50914;">🎬 Movie Ticket Confirmation</h2>
          <p>Hi,</p>
          <p>Your payment was successful and your movie ticket has been booked!</p>

          <div style="background-color: #2c2c2c; border-radius: 10px; padding: 15px; margin-top: 20px; text-align: center;">
            <h3 style="color: #e50914;">Your Ticket</h3>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}" alt="QR Code" style="margin: 15px 0;" />
            <p><strong>Movie:</strong> ${movie}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Seat:</strong> ${seat}</p>
            <p><strong>Booking ID:</strong> #${bookingId}</p>
          </div>

          <p>Show this QR code at the theater entrance.</p>
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
