import express from "express";
import { 
  getQueueStatus, 
  updateQueueStatus, 
  joinQueue, 
  callNext, 
  updateEntryStatus, 
  getPatientStatus 
} from "../controllers/queueController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status/:clinicId", getQueueStatus);
router.get("/patient-status", authenticate, getPatientStatus);
router.patch("/control", updateQueueStatus);
router.post("/join", authenticate, joinQueue);
router.post("/next", callNext);
router.patch("/entry/:id", updateEntryStatus);

export default router;
