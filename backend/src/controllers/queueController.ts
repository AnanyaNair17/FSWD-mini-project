import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

// Helper to get or create queue for a clinic
const getOrCreateQueue = async (clinicId: number) => {
  let queue = await prisma.queue.findUnique({
    where: { clinicId },
    include: { entries: { where: { status: { in: ["WAITING", "IN_PROGRESS"] } }, orderBy: { tokenNumber: "asc" } } }
  });

  if (!queue) {
    queue = await prisma.queue.create({
      data: { clinicId, status: "CLOSED" },
      include: { entries: true }
    });
  }
  return queue;
};

export const getQueueStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clinicId } = req.params;
    const cid = parseInt(clinicId);

    let queue = await prisma.queue.findUnique({
      where: { clinicId: cid },
      include: {
        entries: {
          orderBy: { tokenNumber: "asc" }
        }
      }
    });

    // Lazy initialization of queue if not found
    if (!queue) {
      queue = await prisma.queue.create({
        data: { clinicId: cid, status: "CLOSED" },
        include: { entries: true }
      });
    }

    const waiting = queue.entries.filter(e => e.status === "WAITING");
    const inProgress = queue.entries.find(e => e.status === "IN_PROGRESS");
    
    // Only count patients completed TODAY (since midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = queue.entries.filter(e => 
      e.status === "COMPLETED" && e.completedAt && new Date(e.completedAt) >= today
    ).length;

    // Simple estimated wait time: 10 mins per waiting patient
    const estimatedWaitTime = waiting.length * 10;

    res.json({
      status: queue.status,
      lastToken: queue.lastToken,
      currentToken: inProgress?.tokenNumber || 0,
      totalWaiting: waiting.length,
      completedToday,
      estimatedWaitTime,
      activePatient: inProgress || null,
      waitlist: waiting
    });
  } catch (error) {
    console.error("Get queue status error:", error);
    res.status(500).json({ error: "Failed to fetch queue status" });
  }
};

export const updateQueueStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clinicId, status } = req.body;
    const queue = await prisma.queue.upsert({
      where: { clinicId: parseInt(clinicId) },
      update: { 
        status,
        ...(status === "CLOSED" ? { lastToken: 0 } : {})
      },
      create: { 
        clinicId: parseInt(clinicId), 
        status,
        ...(status === "CLOSED" ? { lastToken: 0 } : {})
      }
    });

    // If closing, we should also clean up any WAITING or IN_PROGRESS entries for this queue
    if (status === "CLOSED") {
      await prisma.queueEntry.updateMany({
        where: { queueId: queue.id, status: { in: ["WAITING", "IN_PROGRESS"] } },
        data: { status: "SKIPPED" }
      });
    }

    res.json({ message: `Queue status updated to ${status}`, status: queue.status });
  } catch (error) {
    console.error("Update queue status error:", error);
    res.status(500).json({ error: "Failed to update queue status" });
  }
};

export const joinQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clinicId, patientName } = req.body;
    const cid = parseInt(clinicId);

    // Verify clinic exists
    const clinic = await prisma.clinic.findUnique({ where: { id: cid } });
    if (!clinic) {
      res.status(404).json({ error: `Clinic with ID ${cid} not found in database. Please run the seeding script.` });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const queue = await tx.queue.upsert({
        where: { clinicId: cid },
        update: { lastToken: { increment: 1 } },
        create: { clinicId: cid, lastToken: 1, status: "OPEN" }
      });

      const entry = await tx.queueEntry.create({
        data: {
          queueId: queue.id,
          tokenNumber: queue.lastToken,
          patientName,
          userId: (req as any).userId || null,
          status: "WAITING"
        }
      });
      return entry;
    });

    res.status(201).json({ message: "Joined queue", entry: result });
  } catch (error: any) {
    console.error("Join queue error:", error);
    res.status(500).json({ error: "Failed to join queue", details: error.message });
  }
};

export const callNext = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clinicId } = req.body;

    const queue = await prisma.queue.findUnique({
      where: { clinicId: parseInt(clinicId) },
      include: { entries: { where: { status: "WAITING" }, orderBy: { tokenNumber: "asc" }, take: 1 } }
    });

    if (!queue || queue.entries.length === 0) {
      res.status(400).json({ error: "No patients in waitlist" });
      return;
    }

    const nextEntry = queue.entries[0];

    await prisma.$transaction([
      prisma.queueEntry.updateMany({
        where: { queueId: queue.id, status: "IN_PROGRESS" },
        data: { status: "SKIPPED" } // Auto-skip current if calling next
      }),
      prisma.queueEntry.update({
        where: { id: nextEntry.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() }
      })
    ]);

    res.json({ message: "Called next patient", entry: nextEntry });
  } catch (error) {
    console.error("Call next error:", error);
    res.status(500).json({ error: "Failed to call next patient" });
  }
};

export const updateEntryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // COMPLETED or SKIPPED

    const entry = await prisma.queueEntry.update({
      where: { id: parseInt(id) },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null
      }
    });

    res.json({ message: `Patient marked as ${status}`, entry });
  } catch (error) {
    console.error("Update entry error:", error);
    res.status(500).json({ error: "Failed to update patient status" });
  }
};

export const getPatientStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Find the latest active entry for this user
    // Note: We need to match patient name or link User to QueueEntry.
    // Since currently QueueEntry only has patientName, we might need to link it to User ID in the schema.
    // However, for now let's assume registration name matches or add a userId field to QueueEntry.
    
    // Check if QueueEntry has userId. Looking at schema... it doesn't.
    // I should update the schema to include userId in QueueEntry for better tracking.
    
    const entry = await prisma.queueEntry.findFirst({
      where: {
        userId: userId,
        status: { in: ["WAITING", "IN_PROGRESS"] }
      },
      orderBy: { joinedAt: "desc" },
      include: {
        queue: {
          include: {
            clinic: true,
            entries: {
              where: { status: { in: ["WAITING", "IN_PROGRESS"] } },
              orderBy: { tokenNumber: "asc" }
            }
          }
        }
      }
    });

    res.json({ entry });
  } catch (error) {
    console.error("Get patient status error:", error);
    res.status(500).json({ error: "Failed to fetch patient status" });
  }
};
export const getPatientHistory = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const history = await prisma.queueEntry.findMany({
      where: {
        userId: userId,
        status: { in: ["COMPLETED", "SKIPPED"] }
      },
      orderBy: { completedAt: "desc" },
      include: {
        queue: {
          include: {
            clinic: true
          }
        }
      }
    });

    res.json({ history });
  } catch (error) {
    console.error("Get patient history error:", error);
    res.status(500).json({ error: "Failed to fetch patient history" });
  }
};

export const getClinicHistory = async (req: any, res: Response): Promise<void> => {
  try {
    const { clinicId } = req.params;
    const history = await prisma.queueEntry.findMany({
      where: {
        queue: { clinicId: parseInt(clinicId) },
        status: { in: ["COMPLETED", "SKIPPED"] }
      },
      orderBy: { joinedAt: "desc" },
      include: {
        user: true
      }
    });

    res.json({ history });
  } catch (error) {
    console.error("Get clinic history error:", error);
    res.status(500).json({ error: "Failed to fetch clinic history" });
  }
};

export const leaveQueue = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const result = await prisma.queueEntry.updateMany({
      where: {
        userId: userId,
        status: { in: ["WAITING", "IN_PROGRESS"] }
      },
      data: {
        status: "SKIPPED"
      }
    });

    if (result.count === 0) {
      res.status(400).json({ error: "No active queue participation found" });
      return;
    }

    res.json({ message: "Left queue successfully" });
  } catch (error) {
    console.error("Leave queue error:", error);
    res.status(500).json({ error: "Failed to leave queue" });
  }
};

export const deleteHistoryEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.queueEntry.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "History entry deleted successfully" });
  } catch (error) {
    console.error("Delete entry error:", error);
    res.status(500).json({ error: "Failed to delete history entry" });
  }
};

