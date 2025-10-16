import Booking from "../Models/Booking.js";

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

