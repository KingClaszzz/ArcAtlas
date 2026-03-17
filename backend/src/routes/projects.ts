import { Router } from "express";
import { prisma } from "../lib/prisma";
const router = Router();

// Auth middleware (Simplified: Trust the wallet address header for development)
const isAuthenticated = (req: any, res: any, next: any) => {
  const address = req.headers['x-wallet-address'];
  if (!address) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please connect wallet." });
  }
  req.session.siwe = { address };
  next();
};

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const { status } = req.query; // Optional filter (e.g., ?status=PENDING)

    // Fetch all projects with vote details
    const projects = await prisma.project.findMany({
      where: status ? { status: status as string } : {},
      include: {
        votes: true, // Needed to calculate net score in JS if needed, but we'll use count for now
        _count: { select: { votes: true } }
      },
    });

    // Calculate scores and sort (Total Up - Total Down)
    // Note: In a production app, we'd store the score directly in the Project model for efficiency.
    const projectsWithScores = projects.map(p => {
      const upvotes = p.votes.filter(v => v.isUpvote).length;
      const downvotes = p.votes.filter(v => !v.isUpvote).length;
      return { ...p, votes: undefined, upvotes, downvotes, netScore: upvotes - downvotes };
    }).sort((a, b) => b.netScore - a.netScore);

    res.json({ success: true, data: projectsWithScores });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
});

// GET /api/projects/featured
router.get("/featured", async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "APPROVED" },
      take: 6,
      include: {
        votes: true,
        _count: { select: { votes: true } }
      }
    });

    const projectsWithScores = projects.map(p => {
      const upvotes = p.votes.filter(v => v.isUpvote).length;
      const downvotes = p.votes.filter(v => !v.isUpvote).length;
      return { ...p, votes: undefined, upvotes, downvotes, netScore: upvotes - downvotes };
    }).sort((a, b) => b.netScore - a.netScore);

    res.json({ success: true, data: projectsWithScores });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch featured projects" });
  }
});

// GET /api/projects/recommend
router.get("/recommend", async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 3;
    const projects = await prisma.project.findMany({
      where: { status: "APPROVED" },
      take: count,
      include: {
        votes: true,
        _count: { select: { votes: true } }
      }
    });

    const projectsWithScores = projects.map(p => {
      const upvotes = p.votes.filter(v => v.isUpvote).length;
      const downvotes = p.votes.filter(v => !v.isUpvote).length;
      return { ...p, votes: undefined, upvotes, downvotes, netScore: upvotes - downvotes };
    }).sort((a, b) => b.netScore - a.netScore);

    res.json({ success: true, data: projectsWithScores });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch recommendations" });
  }
});

// POST /api/projects
router.post("/", isAuthenticated, async (req: any, res) => {
  try {
    const { name, description, websiteUrl, forumUrl, twitterUrl, imageUrl } = req.body;
    
    const project = await prisma.project.create({
      data: { 
        name, 
        description, 
        websiteUrl, 
        imageUrl: imageUrl || "/arc_logo.jpg", 
        forumUrl, 
        twitterUrl, 
        status: "PENDING" 
      }
    });
    res.json({ success: true, data: project });
  } catch (e) {
    res.status(400).json({ success: false, message: "Failed to create project" });
  }
});

// POST /api/projects/:id/vote
router.post("/:id/vote", isAuthenticated, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { isUpvote } = req.body;
    const address = req.session.siwe.address;

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { address } });
    if (!user) {
      user = await prisma.user.create({ data: { address } });
    }

    // Upsert the vote
    await prisma.vote.upsert({
      where: { userId_projectId: { userId: user.id, projectId: id } },
      update: { isUpvote },
      create: { userId: user.id, projectId: id, isUpvote }
    });

    // Check thresholds
    const allVotes = await prisma.vote.findMany({ where: { projectId: id } });
    const upCount = allVotes.filter(v => v.isUpvote).length;
    const downCount = allVotes.filter(v => !v.isUpvote).length;

    if (upCount >= 10) {
      await prisma.project.update({
        where: { id },
        data: { status: "APPROVED" }
      });
      return res.json({ success: true, message: "Project Approved!", status: "APPROVED" });
    }

    if (downCount >= 10) {
      await prisma.project.delete({ where: { id } });
      return res.json({ success: true, message: "Project Deleted!", status: "DELETED" });
    }

    res.json({ success: true, data: { upCount, downCount } });
  } catch (e) {
    res.status(400).json({ success: false, message: "Voting failed" });
  }
});

export default router;
