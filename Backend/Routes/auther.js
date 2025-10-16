import Booking from "../Models/Booking.js";
import auth from "../Models/users.js"

// Get summary per collector

export const getCollectorSummary = async (req, res) => {
  try {
    const { collectorId } = req.params;

    // Ensure collectorId is provided
    if (!collectorId) {
      return res.status(400).json({ success: false, message: "Collector ID is required" });
    }

    // Aggregate bookings by movieName and date, summing totalAmount for 'paid' status
    const stats = await Booking.aggregate([
      {
        $match: {
          collectorId,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            movieName: "$movieName",
            date: "$date",
          },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          movieName: "$_id.movieName",
          date: "$_id.date",
          totalAmount: 1,
        },
      },
      {
        $sort: { date: 1 }, // Optional: Sort by date ascending
      },
    ]);

    // Return the aggregated statistics
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all collectors and total count
export const getCollectors = async (req, res) => {
  try {
    // Fetch all collectors
    const collectors = await auth.find({ collectorType: { $exists: true } });

    // Total collectors
    const totalCollectors = collectors.length;

    res.status(200).json({
      success: true,
      totalCollectors,
      collectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};