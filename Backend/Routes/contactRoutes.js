import express from "express";
import { sendContactEmail } from "../controller/contactController.js";

const contactrouter = express.Router();

contactrouter.post("/contactemail", sendContactEmail);

export default contactrouter;
