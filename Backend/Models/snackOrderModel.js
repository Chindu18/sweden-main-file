import mongoose from "mongoose";

const snackOrderSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    userPhone: { type: String, default: "" },
    bookingId: { type: String, required: true, trim: true },
    Seats: [{ type: String, default: [] }], // store seat numbers as array
    movieName: { type: String, default: "" },
    showdate: { type: String, default: "" },
    showTime: { type: String, default: "" },

    items: [
      {
        snackId: { type: mongoose.Schema.Types.ObjectId, ref: "Snack", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        lineTotal: { type: Number, required: true },
        Image: { type: String, default: "" },
      },
    ],

    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    collectorType: { type: String, default: "" },
    collectorId: { type: String, default: "" },

    // optional object to hold all booking details
    userdetails: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("SnackOrder", snackOrderSchema);
