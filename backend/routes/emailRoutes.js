// /routes/emailRoutes.js
import express from "express";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || (!text && !html)) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await sendEmail({ to, subject, text, html });
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default router;
