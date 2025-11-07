import express from "express";
import SnackOrder from "../Models/snackOrderModel.js";
import Booking from "../Models/Booking.js";

const snackdistrubuterouter = express.Router();

// ✅ Get today's snack orders grouped by movie and show time
snackdistrubuterouter.get("/snackOrders/today", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch all today's snack orders
    const orders = await SnackOrder.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ movieName: 1, showTime: 1 });

    // Enrich orders with seat details from Booking
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const booking = await Booking.findOne({ bookingId: order.bookingId });

        return {
          ...order.toObject(),
          seatNumbers: booking?.seatNumbers || [], // seat and row
          movieName: booking?.movieName || order.movieName || "Unknown Movie",
        };
      })
    );

    // ✅ Group by movie → showTime
    const groupedByMovie = {};
    enrichedOrders.forEach((order) => {
      const movie = order.movieName || "Unknown Movie";
      const show = order.showTime || "Unknown Show";

      if (!groupedByMovie[movie]) groupedByMovie[movie] = {};
      if (!groupedByMovie[movie][show]) groupedByMovie[movie][show] = [];

      groupedByMovie[movie][show].push(order);
    });

    res.json(groupedByMovie);
  } catch (err) {
    console.error("❌ Error fetching snack orders:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default snackdistrubuterouter;