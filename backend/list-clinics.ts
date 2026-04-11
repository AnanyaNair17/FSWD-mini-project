import { prisma } from "./src/lib/prisma.js";

async function listClinics() {
  try {
    const clinics = await prisma.clinic.findMany();
    console.log("Clinics in DB:", clinics.map(c => ({ id: c.id, name: c.name })));
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

listClinics();
