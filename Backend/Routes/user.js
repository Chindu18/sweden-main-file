import express from "express";
import {
  addBooking,
  getBookedSeats,
  addMovie,
  uploadMovieFiles,
  addShow,
  updatemovie,
  deleteCollector,
  updateCollectorAccess
} from "../controller/userDetailControl.js";
import { getBookingById } from "../controller/dashBoardController.js";
import { getCollectors, getCollectorSummary } from "./auther.js";

const userRouter = express.Router();

userRouter.post("/addBooking", addBooking);
userRouter.get("/bookedSeats", getBookedSeats);
userRouter.get("/bookingid/:bookingId", getBookingById);

// Movie routes
userRouter.post("/addDetails", uploadMovieFiles, addMovie);
userRouter.put("/update/:id", uploadMovieFiles, updatemovie);
userRouter.put("/addShow", addShow);

// Collector routes
userRouter.get("/collector/:collectorId", getCollectorSummary);
userRouter.get("/allcollector", getCollectors);

userRouter.put("/collector/access/:id", updateCollectorAccess);

// ✅ Delete collector
userRouter.delete("/collector/access/:id", deleteCollector);

export default userRouter;
