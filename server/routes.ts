import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file upload
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
import { subscriptions, notifications } from "@db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { addMonths, addYears, subDays } from "date-fns";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Get all subscriptions
  app.get("/api/subscriptions", async (req, res) => {
    const subs = await db.query.subscriptions.findMany({
      orderBy: [asc(subscriptions.name)]
    });
    res.json(subs);
  });

  // Create subscription
  app.post("/api/subscriptions", upload.array("files"), async (req, res) => {
    const data = req.body;
    const uploadedFiles = (req.files as Express.Multer.File[])?.map(file => file.filename) || [];
    data.files = uploadedFiles;
    
    // Parse dates and format them correctly for PostgreSQL
    const startDate = new Date(data.startDate);
    const renewalDate = data.cycleType === "monthly" 
      ? addMonths(startDate, 1)
      : addYears(startDate, 1);

    const sub = await db.insert(subscriptions).values({
      ...data,
      startDate: startDate.toISOString().split('T')[0],
      renewalDate: renewalDate.toISOString().split('T')[0],
    }).returning();
    res.json(sub[0]);
  });

  // Update subscription
  app.put("/api/subscriptions/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const sub = await db.update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, parseInt(id)))
      .returning();
    res.json(sub[0]);
  });

  // Get notifications
  app.get("/api/notifications", async (req, res) => {
    const notifs = await db.query.notifications.findMany({
      orderBy: [desc(notifications.createdAt)]
    });
    res.json(notifs);
  });

  // Mark notification as read
  app.put("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    const notif = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, parseInt(id)))
      .returning();
    res.json(notif[0]);
  });

  // Check for upcoming renewals
  setInterval(async () => {
    const sevenDaysFromNow = new Date();
    const subs = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.active, true),
        eq(subscriptions.renewalDate, subDays(sevenDaysFromNow, 7))
      )
    });

    for (const sub of subs) {
      await db.insert(notifications).values({
        subscriptionId: sub.id,
        message: `${sub.name} subscription will renew in 7 days`
      });
    }
  }, 1000 * 60 * 60); // Check every hour

  return httpServer;
}
