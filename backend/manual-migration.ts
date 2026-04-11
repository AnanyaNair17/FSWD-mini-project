import { prisma } from "./src/lib/prisma.js";

async function runManualMigration() {
  try {
    console.log("Adding userId column to QueueEntry...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "QueueEntry" ADD COLUMN "userId" INTEGER`);
    console.log("Adding foreign key constraint...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    console.log("Manual migration SUCCESSFUL!");
  } catch (err) {
    console.error("Manual migration FAILED (it might already exist):", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runManualMigration();
