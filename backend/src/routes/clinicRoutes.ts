import express from "express";
import { registerClinic, getAllClinics } from "../controllers/clinicController.js";

const router = express.Router();

router.post("/register", registerClinic);
router.get("/", getAllClinics);

export default router;
