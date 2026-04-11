import { prisma } from "./src/lib/prisma.js";

async function checkSchema() {
  try {
    const tableInfo = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'QueueEntry'`;
    console.log("QueueEntry columns:", tableInfo);
  } catch (err) {
    console.error("Schema check FAILED:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
