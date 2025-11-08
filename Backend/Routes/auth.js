import express from "express";
import bcrypt from "bcryptjs";
import auth from "../Models/users.js";

const authrouter = express.Router();

// 🔹 REGISTER
authrouter.post("/register", async (req, res) => {
  try {
    let { username, password, phone, email, address, collectorType } = req.body;

    // 🧩 Normalize collectorType
    if (!collectorType) {
      return res.status(400).json({ message: "Collector type is required" });
    }

    const type = collectorType.toLowerCase().replace(/\s+/g, ""); // remove spaces

    // 🧩 Map to consistent format
    if (type === "videospeed" || type === "video") {
      collectorType = "videoSpeed";
    } else {
      collectorType = collectorType.trim(); // keep as is for other types
    }

    // 🧩 Validate required fields
    if (!username || !password || !phone || !email || !address || !collectorType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await auth.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new auth({
      username,
      password: hashedPassword,
      phone,
      email,
      address,
      collectorType,
      access: "denied",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 LOGIN (no JWT)
authrouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await auth.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    // ✅ Send success + user data
    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      collectorType: user.collectorType,
      access:user.access
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";
const SCANNER_PASS = process.env.SCANNER_PASSWORD || "scan123";

authrouter.post("/logins", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password required" });
    }

    if (password === ADMIN_PASS) {
      return res.status(200).json({
        success: true,
        role: "admin",
        message: "✅ Admin access granted",
      });
    }

    if (password === SCANNER_PASS) {
      return res.status(200).json({
        success: true,
        role: "scanner",
        message: "🔍 Scanner access granted",
      });
    }

    return res.status(401).json({
      success: false,
      message: "❌ Invalid password",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default authrouter;
