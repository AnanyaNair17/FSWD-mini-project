import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export const registerClinic = async (req: Request, res: Response): Promise<void> => {
  console.log("Incoming Clinic Registration Request:", req.body);
  
  try {
    const {
      clinicName,
      doctorName,
      specialization,
      address,
      area,
      phone,
      username,
      password,
      workingDays,
      openingTime,
      closingTime
    } = req.body;

    // Validation
    if (!clinicName || !doctorName || !username || !password) {
      console.warn("Validation failed: Missing required fields");
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.warn(`Registration failed: Username '${username}' already taken`);
      res.status(400).json({ error: "Username already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User and Clinic in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          name: doctorName,
          email: `${username}@waitless.com`, // Placeholder email
          role: "NGO"
        }
      });

      const clinic = await tx.clinic.create({
        data: {
          name: clinicName,
          doctorName,
          specialization,
          address,
          area,
          phone,
          workingDays,
          openingTime,
          closingTime,
          adminId: user.id
        }
      });

      return { user, clinic };
    });

    console.log("Clinic registered successfully:", result.clinic.id);
    res.status(201).json({
      message: "Clinic registered successfully",
      clinic: result.clinic,
      user: { id: result.user.id, username: result.user.username }
    });
  } catch (error: any) {
    console.error("Clinic registration error details:", error.message || error);
    if (error.code) console.error("Prisma error code:", error.code);
    if (error.meta) console.error("Prisma meta:", JSON.stringify(error.meta));
    res.status(500).json({ error: "Failed to register clinic", details: error.message });
  }
};

export const getAllClinics = async (req: Request, res: Response): Promise<void> => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        queue: {
          include: {
            entries: {
              where: { status: { in: ["WAITING", "IN_PROGRESS"] } }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Transform to match frontend ClinicCard shape
    const result = clinics.map(clinic => ({
      id: String(clinic.id),
      name: clinic.name,
      doctor: clinic.doctorName,
      specialty: clinic.specialization,
      location: clinic.area,
      rating: 4.5,        // Default rating for new clinics
      reviewCount: 0,
      verified: true,
      waiting: clinic.queue?.entries.filter(e => e.status === "WAITING").length || 0,
      queueStatus: (clinic.queue?.status === "OPEN" ? "open" : "open") as "open" | "closed",
      workingDays: clinic.workingDays
    }));

    res.json(result);
  } catch (error: any) {
    console.error("Get all clinics error:", error.message);
    res.status(500).json({ error: "Failed to fetch clinics" });
  }
};
