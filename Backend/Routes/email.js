import express from "express";
import { confirmMail} from "../controller/otpController.js";

const emailRouter = express.Router();


emailRouter.post("/paid",confirmMail );

export default emailRouter;
