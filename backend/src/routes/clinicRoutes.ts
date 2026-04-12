import express from "express";
import { registerClinic, getAllClinics, getClinicById } from "../controllers/clinicController.js";

const router = express.Router();

router.post("/register", registerClinic);
router.get("/", getAllClinics);
router.get("/:id", getClinicById);

export default router;
