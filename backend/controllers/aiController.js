import { generateAIResponse } from "../services/aiService.js";

const DEFAULT_PROMPT = `
You are a meeting assistant.

Strictly extract only from the provided content.
Do not hallucinate.
Do not add assumptions.

Return the result in this format:

Summary:
...

Action Items:
- ...

Decisions:
- ...

If any section is missing, write "Not mentioned".
`.trim();

export const summarizeText = async (req, res) => {
  try {
    const { text, prompt } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Text is required." });
    }

    const raw = await generateAIResponse(
      String(text),
      prompt?.trim() || DEFAULT_PROMPT
    );

    const summaryMatch = raw.match(/Summary:(.*?)(Action Items:|Decisions:|$)/s);
    const actionsMatch = raw.match(/Action Items:(.*?)(Decisions:|$)/s);
    const decisionsMatch = raw.match(/Decisions:(.*)/s);

    const summary = summaryMatch ? summaryMatch[1].trim() : raw.trim();

    const actionItems = actionsMatch
      ? actionsMatch[1]
          .split("\n")
          .map((a) => a.replace(/^\s*(\d+\.|-)\s*/, "").trim())
          .filter(Boolean)
          .filter((a) => a.toLowerCase() !== "not mentioned")
      : [];

    const decisions = decisionsMatch
      ? decisionsMatch[1]
          .split("\n")
          .map((d) => d.replace(/^\s*(\d+\.|-)\s*/, "").trim())
          .filter(Boolean)
          .filter((d) => d.toLowerCase() !== "not mentioned")
      : [];

    res.json({
      success: true,
      source: "text",
      summary,
      actionItems,
      decisions,
    });
  } catch (err) {
    console.error("Summarize text error:", err);
    res.status(500).json({
      error: "AI generation failed",
      details: err.message,
    });
  }
};

export const summarizeUploadedFile = async (req, res) => {
  try {
    const prompt = req.body?.prompt?.trim() || DEFAULT_PROMPT;

    if (!req.file) {
      return res.status(400).json({ error: "File is required." });
    }

    const fileText = req.file.buffer.toString("utf-8").trim();

    if (!fileText) {
      return res.status(400).json({ error: "Uploaded file is empty." });
    }

    const raw = await generateAIResponse(fileText, prompt);

    const summaryMatch = raw.match(/Summary:(.*?)(Action Items:|Decisions:|$)/s);
    const actionsMatch = raw.match(/Action Items:(.*?)(Decisions:|$)/s);
    const decisionsMatch = raw.match(/Decisions:(.*)/s);

    const summary = summaryMatch ? summaryMatch[1].trim() : raw.trim();

    const actionItems = actionsMatch
      ? actionsMatch[1]
          .split("\n")
          .map((a) => a.replace(/^\s*(\d+\.|-)\s*/, "").trim())
          .filter(Boolean)
          .filter((a) => a.toLowerCase() !== "not mentioned")
      : [];

    const decisions = decisionsMatch
      ? decisionsMatch[1]
          .split("\n")
          .map((d) => d.replace(/^\s*(\d+\.|-)\s*/, "").trim())
          .filter(Boolean)
          .filter((d) => d.toLowerCase() !== "not mentioned")
      : [];

    res.json({
      success: true,
      source: "file",
      fileName: req.file.originalname,
      summary,
      actionItems,
      decisions,
    });
  } catch (err) {
    console.error("Summarize file error:", err);
    res.status(500).json({
      error: "File summarization failed",
      details: err.message,
    });
  }
};