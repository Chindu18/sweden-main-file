import express from "express";
import {
  getCollectors,
  addCollector,
  updateCollector,
  deleteCollector,
  changecollector,
  previewCollectorChange, // ✅ Import preview API
} from "../controller/collectorController.js";

const collectorRouter = express.Router();

// ✅ Get all collectors (frontend/public)
collectorRouter.get("/getcollectors", getCollectors);

// ✅ Add new collector (admin)
collectorRouter.post("/addcollectors", addCollector);

// ✅ Update collector (admin)
collectorRouter.put("/updatecollector/:id", updateCollector);

// ✅ Delete collector (admin)
collectorRouter.delete("/deletecollector/:id", deleteCollector);

// ✅ Preview collector change (for QR scanner)
collectorRouter.get("/previewchange", previewCollectorChange);

// ✅ Change collector (confirm change)
collectorRouter.put("/changecollector", changecollector);

export default collectorRouter;
