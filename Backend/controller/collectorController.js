import Booking from "../Models/Booking.js";
import Collector from "../Models/Collector.js";

export const getCollectors = async (req, res) => {
  try {
    const collectors = await Collector.find().select("name description");
    res.status(200).json({ collectors }); // frontend expects this key
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch collectors" });
  }
};
// ✅ Add a new collector
export const addCollector = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Collector name required" });

    const exists = await Collector.findOne({ name });
    if (exists) return res.status(400).json({ message: "Collector already exists" });

    const newCollector = await Collector.create({ name, description });
    res.status(201).json({ message: "Collector added", collector: newCollector });
  } catch (error) {
    res.status(500).json({ message: "Error adding collector" });
  }
};

// ✏️ Update collector
export const updateCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const collector = await Collector.findById(id);
    if (!collector) return res.status(404).json({ message: "Collector not found" });

    // Update fields
    collector.name = name || collector.name;
    collector.description = description || collector.description;

    await collector.save();
    res.status(200).json({ message: "Collector updated", collector });
  } catch (error) {
    res.status(500).json({ message: "Error updating collector" });
  }
};

// ❌ Delete collector
export const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;

    const collector = await Collector.findByIdAndDelete(id);
    if (!collector) return res.status(404).json({ message: "Collector not found" });

    res.status(200).json({ message: "Collector deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collector" });
  }
};


import Movie from "../Models/Movies.js";



export const changecollector = async (req, res) => {
  try {
    const { bookingid, collector } = req.body; // e.g. collector = "online" | "videoSpeed" | "nike"

    // 1️⃣ Find booking using bookingId (not _id)
    const booking = await Booking.findOne({ bookingId: bookingid });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Find movie by title
    const movie = await Movie.findOne({ title: booking.movieName });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // 3️⃣ Find the correct show (match date + time)
    const show = movie.shows.find(
      (s) =>
        new Date(s.date).toDateString() === new Date(booking.date).toDateString() &&
        s.time === booking.timing
    );
    if (!show) return res.status(404).json({ message: "Show not found" });

    // 4️⃣ Initialize variables
    let adultPrice = 0;
    let kidsPrice = 0;
    let collectorType = "";

    // 5️⃣ Detect type of collector
    if (collector === "online" || collector === "videoSpeed") {
      // => From show.prices
      adultPrice = show.prices[collector].adult;
      kidsPrice = show.prices[collector].kids;
      collectorType = collector;
    } else {
      // => From show.collectors array
      const foundCollector = show.collectors.find(
        (c) => c.collectorName === collector
      );
      if (!foundCollector) {
        return res.status(404).json({ message: "Collector not found in this show" });
      }
      adultPrice = foundCollector.adult;
      kidsPrice = foundCollector.kids;
      collectorType = foundCollector.collectorName;
    }

    // 6️⃣ Recalculate total
    const totalAmount = booking.adult * adultPrice + booking.kids * kidsPrice;

    // 7️⃣ Update booking fields
 
    booking.ticketType = collectorType; // ✅ also change ticket type
    booking.totalAmount = totalAmount;

    await booking.save();

    // 8️⃣ Send back updated details
    res.status(200).json({
      message: "Collector type and ticket type changed successfully",
      updatedBooking: {
        bookingId: booking.bookingId,
        movieName: booking.movieName,
        date: booking.date,
        time: booking.timing,
        collectorType,
        ticketType: booking.ticketType,
        adultPrice,
        kidsPrice,
        totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error changing collector:", error);
    res.status(500).json({ message: "Error changing collector" });
  }
};



