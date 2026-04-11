import { prisma } from "./src/lib/prisma.js";

async function checkDb() {
  try {
    await prisma.$connect();
    console.log("Database connection OK");
    const users = await prisma.user.findMany({ take: 1 });
    console.log("User count check:", users.length >= 0 ? "SUCCESS" : "FAIL");
  } catch (err) {
    console.error("Database connection FAILED:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
