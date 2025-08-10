import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Protected route example
router.get("/protected", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  res.json({ 
    message: "This is a protected route", 
    user: req.user 
  });
});

export default router;