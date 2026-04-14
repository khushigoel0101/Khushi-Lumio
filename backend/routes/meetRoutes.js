import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../services/meetingService.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, createMeeting);
router.get("/", authenticateToken, getMeetings);
router.get("/:id", authenticateToken, getMeetingById);
router.put("/:id", authenticateToken, updateMeeting);
router.delete("/:id", authenticateToken, deleteMeeting);

export default router;