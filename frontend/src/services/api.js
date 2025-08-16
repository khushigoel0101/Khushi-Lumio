import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

// AI Summary
export const generateSummary = async (text, prompt) => {
  const res = await API.post("/ai/summarize", { text, prompt });
  return res.data;
};

// Email Sender
export const sendEmail = async (to, subject, text, html) => {
  const res = await API.post("/email/send", { to, subject, text, html });
  return res.data;
};

export default API;
