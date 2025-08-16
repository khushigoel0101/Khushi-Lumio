import express from "express";
import { generateAIResponse } from "../services/aiService.js";

const router = express.Router();


router.post("/summarize", async (req, res) => {
  try {
    const { text, prompt } = req.body;
    const summary = await generateAIResponse(text, prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "AI generation failed", details: err.message });
  }
});

export default router;
