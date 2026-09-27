import Meeting from "../models/Meeting.js";

export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      transcript,
      summary,
      keyPoints,
      actionItems,
      decisions,
      speakerBreakdown,
      participants,
      meetingDate,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Meeting title is required",
      });
    }

    const meeting = await Meeting.create({
      user: req.user._id,
      title,
      transcript: transcript || "",
      summary: summary || "",
      keyPoints: keyPoints || [],
      actionItems: actionItems || [],
      decisions: decisions || [],
      speakerBreakdown: speakerBreakdown || [],
      participants: participants || [],
      meetingDate: meetingDate || Date.now(),
      status: status || (summary ? "completed" : "draft"),
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error("createMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating meeting",
    });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const {cursor} = req.query;
    const limit = 5;
    const query = { user: req.user._id };
    if(cursor){
      query.createdAt = {$lt: new Date(cursor)};
    }
    const results = await Meeting.find(query).sort({
      createdAt: -1,
    }).limit(limit + 1);

    const hasMore = results.length > limit;
    const meetings = hasMore ? results.slice(0, limit) : results;
    const nextCursor = hasMore ? meetings[meetings.length - 1].createdAt : null;

    res.status(200).json({
      success: true,
      meetings,
      nextCursor
    });
  } catch (error) {
    console.error("getMeetings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching meetings",
    });
  }
};

export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("getMeetingById error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching meeting",
    });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const allowedFields = [
      "title",
      "transcript",
      "summary",
      "keyPoints",
      "actionItems",
      "decisions",
      "speakerBreakdown",
      "participants",
      "meetingDate",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        meeting[field] = req.body[field];
      }
    });

    const updatedMeeting = await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error("updateMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating meeting",
    });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("deleteMeeting error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting meeting",
    });
  }
};