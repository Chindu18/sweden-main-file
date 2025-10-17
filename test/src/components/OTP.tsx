import { useState } from "react";
import axios from "axios";

interface OTPProps {
  email: string;
  setEmail: (email: string) => void;
  onVerified: () => void; // callback to notify BookTicket that OTP is verified
}

const backendURL = "https://swedenn-backend.onrender.com"; // your backend URL

const OTP: React.FC<OTPProps> = ({ email, setEmail, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    if (!email) return setMessage("Enter your email first!");
    try {
      const res = await axios.post(`${backendURL}/send-otp`, { email });
      setMessage(res.data.message || "OTP sent successfully");
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setMessage("Enter OTP first!");
    try {
      const res = await axios.post(`${backendURL}/verify-otp`, { email, otp });
      if (res.data.success) {
        setVerified(true);
        setMessage("✅ OTP verified!");
        onVerified(); // notify parent
      } else {
        setMessage("❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("OTP verification failed");
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2 rounded w-full"
        disabled={verified}
      />
      <button
        onClick={sendOtp}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={verified}
      >
        Send OTP
      </button>
      {!verified && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verify OTP
          </button>
        </div>
      )}
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
};

export default OTP;
