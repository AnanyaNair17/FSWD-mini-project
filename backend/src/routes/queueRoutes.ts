import express from "express";
import { 
  getQueueStatus, 
  updateQueueStatus, 
  joinQueue, 
  callNext, 
  updateEntryStatus, 
  getPatientStatus,
  getPatientHistory,
  getClinicHistory,
  leaveQueue,
  deleteHistoryEntry
} from "../controllers/queueController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status/:clinicId", getQueueStatus);
router.get("/patient-status", authenticate, getPatientStatus);
router.get("/history", authenticate, getPatientHistory);
router.get("/history/:clinicId", getClinicHistory);
router.patch("/control", updateQueueStatus);
router.post("/join", authenticate, joinQueue);
router.post("/next", callNext);
router.patch("/entry/:id", updateEntryStatus);
router.delete("/leave", authenticate, leaveQueue);
router.delete("/entry/:id", authenticate, deleteHistoryEntry);

export default router;
