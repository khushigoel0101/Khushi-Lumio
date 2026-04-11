import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = async ({ email, password }) => {
  const res = await API.post("/api/auth/register", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await API.post("/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const validateToken = async () => {
  const res = await API.get("/api/auth/validate");
  return res.data.valid;
};

export const logout = () => {
  localStorage.removeItem("token");
};

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
