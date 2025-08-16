import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { senderEmail, senderPassword, receiverEmail, subject, text } = req.body;

    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: subject || "Shared Summary",
      text,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default router;
