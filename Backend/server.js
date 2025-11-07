import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import database_connection from './DataBase/db.js';
import userRouter from './Routes/user.js';
import movieRouter from './Routes/movie.js';
import dashboardRouter from './Routes/dashboard.js';
import otprouter from './Routes/otp.js';
import emailRouter from './Routes/email.js';
import blockRouter from './Routes/block.js';
import authrouter from './Routes/auth.js';
import collectorRouter from './Routes/collector.js';
import snackrouter from './Routes/snackRoutes.js';
import orderRouter from './Routes/snackOrderRoutes.js';
import { startAutoReminder, manualTriggerAutoReminder } from './middlewares/autoReminder.js';
import Campaignrouter from './Routes/campaignStatusRoute.js';
import snackRevenuerouter from './Routes/snacksRevenue.js';
import snackdistrubuterouter from './controller/snacksdistrubute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8004;

// ✅ Middleware setup
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ Static file serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads/movies')));
app.use("/uploads", express.static("uploads"));

// ✅ Routers
app.use('/snacks', snackrouter);
app.use('/snackdistrubute', snackdistrubuterouter);
app.use('/api', userRouter);
app.use('/movie', movieRouter);
app.use('/dashboard', dashboardRouter);
app.use('/auth', authrouter);
app.use('/otp', otprouter);
app.use('/booking', emailRouter);
app.use('/seats', blockRouter);
app.use('/collectors', collectorRouter);
app.use('/campaignmail', Campaignrouter);
app.use('/snacksorder', orderRouter);
app.use('/snacks-revenue', snackRevenuerouter);

// ✅ Start background jobs
startAutoReminder();

// ✅ Test route
app.get("/", (req, res) => res.send("Backend server running"));

// ✅ Manual trigger route
app.get("/test-reminder", async (req, res) => {
  try {
    await manualTriggerAutoReminder();
    res.send("✅ Test reminder job executed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Test reminder failed");
  }
});

// ✅ Connect database
database_connection();

// ✅ Start server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
