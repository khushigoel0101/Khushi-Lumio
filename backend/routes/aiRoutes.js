import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  summarizeText,
  summarizeUploadedFile,
} from "../controllers/aiController.js";
import { uploadSingleTextFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Existing copy-paste text flow
router.post("/summarize", authenticateToken, summarizeText);

// New upload text-file flow
router.post(
  "/summarize-file",
  authenticateToken,
  uploadSingleTextFile,
  summarizeUploadedFile
);

export default router;