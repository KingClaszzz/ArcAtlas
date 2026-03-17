import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger";
import projectsRouter from "./routes/projects";
import networkRouter from "./routes/network";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

import path from "path";
const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1); // Diperlukan untuk Railway load balancer

app.set("trust proxy", 1); // Necessary for Railway load balancer

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true // Required for SIWE/Sessions
}));
app.use(express.json());
app.use(session({
  name: "arc_showcase_session",
  secret: process.env.SESSION_SECRET || "arc-showcase-v1-secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: isProd, // Required for HTTPS in production
    sameSite: isProd ? "none" : "lax", // Cross-domain session support
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));
app.use(logger);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/user", userRouter);
app.use("/api/network", networkRouter);

// Recommendations fallback
app.get("/api/projects/recommend", async (req, res) => {
  const { prisma } = await import("./lib/prisma");
  const count = parseInt(req.query.count as string) || 3;
  const projects = await prisma.project.findMany({ take: count, include: { _count: { select: { votes: true } } } });
  res.json({ success: true, data: projects });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Arc Explorer API running at http://localhost:${PORT}`);
  console.log(`   GET /api/projects`);
  console.log(`   GET /api/projects/featured`);
  console.log(`   GET /api/projects/recommend?count=3`);
  console.log(`   GET /api/network\n`);
});

export default app;
