// Models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },  // 👈 new field
  name: { type: String, required: true },
phone: { type: String, required: true },

  email: { type: String, required: true },
  date: { type: String, required: true },
  timing: { type: String, required: true },
  seatNumbers: { type: [Number], required: true },
  adult: { type: Number, required: true },
  kids: { type: Number, required: true },
  ticketType: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  totalSeatsSelected: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' } ,
  movieName:{type:String,required:true},
  collectorType:{type:String,default: ''},
  collectorId:{type:String,default: ''}
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
