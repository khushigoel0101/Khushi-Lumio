import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
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

const parseAIResponse = (raw) => {
  const summaryMatch = raw.match(/Summary:(.*?)(Action Items:|Decisions:|$)/is);
  const actionsMatch = raw.match(/Action Items:(.*?)(Decisions:|$)/is);
  const decisionsMatch = raw.match(/Decisions:(.*)/is);

  const cleanList = (text = "") =>
    text
      .split("\n")
      .map((item) => item.replace(/^\s*(\d+\.|-|\*)\s*/, "").trim())
      .filter(Boolean)
      .filter((item) => item.toLowerCase() !== "not mentioned");

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : raw.trim(),
    actionItems: actionsMatch ? cleanList(actionsMatch[1]) : [],
    decisions: decisionsMatch ? cleanList(decisionsMatch[1]) : [],
  };
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