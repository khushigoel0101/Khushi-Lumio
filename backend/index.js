import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import aiRoutes from "./routes/aiRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetRoutes.js";

dotenv.config({ path: "./config/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("Missing MONGODB_URI in config/.env");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/meetings", meetingRoutes);
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File is too large. Maximum allowed size is 2 MB.",
      });
    }

    return res.status(400).json({
      error: "File upload error.",
      details: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      error: err.message || "Something went wrong.",
    });
  }

  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
