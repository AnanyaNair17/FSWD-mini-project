import { prisma } from "./src/lib/prisma.js";

async function testJoinQueue() {
  const clinicId = 1;
  const patientName = "Bug Hunter";
  const userId = null; // Test with null first

  try {
    console.log("Starting transaction...");
    const result = await prisma.$transaction(async (tx) => {
      console.log("Upserting queue for clinicId:", clinicId);
      const queue = await tx.queue.upsert({
        where: { clinicId: clinicId },
        update: { lastToken: { increment: 1 } },
        create: { clinicId: clinicId, lastToken: 1, status: "OPEN" }
      });
      console.log("Queue upserted, id:", queue.id);

      console.log("Creating queue entry...");
      const entry = await tx.queueEntry.create({
        data: {
          queueId: queue.id,
          tokenNumber: queue.lastToken,
          patientName,
          userId: userId,
          status: "WAITING"
        }
      });
      console.log("Entry created, id:", entry.id);
      return entry;
    });
    console.log("SUCCESS:", result);
  } catch (err: any) {
    console.error("FAILED with error message:", err.message);
    if (err.code) console.error("Prisma Error Code:", err.code);
    if (err.meta) console.error("Prisma Error Meta:", JSON.stringify(err.meta));
    console.error("Full Trace:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testJoinQueue();
