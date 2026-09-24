import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { generateAIResponse } from "../services/aiService.js";

const DEFAULT_PROMPT = `
You are a meeting assistant.

Strictly extract only from the provided content.
Do not hallucinate.
Do not add assumptions.

Return the result STRICTLY as a valid JSON object in this exact shape:

{
  "summary": "string",
  "actionItems": ["string", "string"],
  "decisions": ["string", "string"]
}

If a section has nothing to report, use an empty string for summary or an empty array for actionItems/decisions.
Do not include any text outside the JSON object.
`.trim();

const parseAIResponse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
    };
  } catch (err) {
    console.error("Failed to parse AI JSON response:", err.message);
    return {
      summary: raw?.trim() || "",
      actionItems: [],
      decisions: [],
    };
  }
};

const extractTextFromFile = async (file) => {
  const fileType = file.mimetype;
  const fileName = file.originalname.toLowerCase();

  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
     const parser = new PDFParse({ data: file.buffer });
     const result = await parser.getText();

     return result.text.trim();
  }

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value.trim();
  }

  if (fileType === "application/msword" || fileName.endsWith(".doc")) {
    throw new Error(
      ".doc files are not supported. Please upload PDF, DOCX, TXT, MD, CSV, JSON, or XML."
    );
  }

  return file.buffer.toString("utf-8").trim();
};

export const summarizeText = async (req, res) => {
  try {
    const { text, prompt } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Text is required." });
    }

    const raw = await generateAIResponse(
      String(text).trim(),
      prompt?.trim() || DEFAULT_PROMPT
    );

    const parsed = parseAIResponse(raw);

    return res.json({
      success: true,
      source: "text",
      ...parsed,
    });
  } catch (err) {
    console.error("Summarize text error:", err);

    return res.status(500).json({
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

    const fileText = await extractTextFromFile(req.file);

    if (!fileText) {
      return res.status(400).json({ error: "Uploaded file is empty." });
    }

    const raw = await generateAIResponse(fileText, prompt);
    const parsed = parseAIResponse(raw);

    return res.json({
      success: true,
      source: "file",
      fileName: req.file.originalname,
      ...parsed,
    });
  } catch (err) {
    console.error("Summarize file error:", err);

    return res.status(500).json({
      error: "File summarization failed",
      details: err.message,
    });
  }
};