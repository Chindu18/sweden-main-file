import express from 'express'
import Booking from '../Models/Booking.js';
import { getTotalSeats,updatePaymentStatus,pendingMoney,getTotalShows,getBookingById} from '../controller/dashBoardController.js';

const dashboardRouter = express.Router()

dashboardRouter.get('/seats',getTotalSeats);
dashboardRouter.get('/pending',pendingMoney)
dashboardRouter.put('/booking/:bookingId/status', updatePaymentStatus);
dashboardRouter.get('/totalshow',getTotalShows)
dashboardRouter.get('/bookingdetails/:bookingId',getBookingById)


dashboardRouter.get("/yearrevenue", async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    const bookings = await Booking.find({});

    const filteredBookings = bookings.filter(
      (b) => new Date(b.date).getFullYear() === year
    );

    const totalRevenue = filteredBookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    res.json({
      year,
      totalRevenue,
      bookings: filteredBookings,
    });
  } catch (error) {
    console.error("Error fetching year revenue:", error);
    res.status(500).json({ message: "Server error" });
  }
});



       

export default dashboardRouter;