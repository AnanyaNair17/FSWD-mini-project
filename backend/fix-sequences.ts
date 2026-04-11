import { PrismaClient } from "./prisma/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixSequence() {
  try {
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Clinic"', 'id'), (SELECT MAX(id) FROM "Clinic"))`);
    console.log("Clinic ID sequence fixed!");
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX(id) FROM "User"))`);
    console.log("User ID sequence fixed!");
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Queue"', 'id'), (SELECT MAX(id) FROM "Queue"))`);
    console.log("Queue ID sequence fixed!");
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"QueueEntry"', 'id'), (SELECT MAX(id) FROM "QueueEntry"))`);
    console.log("QueueEntry ID sequence fixed!");
  } catch (err: any) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

fixSequence();
