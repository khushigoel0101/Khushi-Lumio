import axios from "axios";

const API = axios.create({
  baseURL:import.meta.env.VITE_API_URL, 
});

// AI Summary
export const generateSummary = async (text, prompt) => {
  const res = await API.post("/api/ai/summarize", { text, prompt });
  return res.data;
};

// Email Sender
export const sendEmail = async ({ to, subject, text, html }) => {
  const res = await API.post("/api/email/send", { to, subject, text, html });
  return res.data;
};

export default API;
