import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    keyPoints: [{
      type: String,
    }],
    actionItems: [{
      type: String,
    }],
    decisions: [{
      type: String,
    }],
    speakerBreakdown: [{
      speaker: String,
      content: String,
    }],
    participants: [{
      type: String,
    }],
    meetingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "completed", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);