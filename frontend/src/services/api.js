import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth
export const register = async ({ fullName, email, password }) => {
  const res = await API.post("/api/auth/register", {
    fullName,
    email,
    password,
  });

  localStorage.setItem("authToken", res.data.token);

  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await API.post("/api/auth/login", { email, password });

  localStorage.setItem("authToken", res.data.token);

  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const googleLogin = async (credential) => {
  const res = await API.post("/api/auth/google", { credential });

  if (res.data.token) {
    localStorage.setItem("authToken", res.data.token);
  }

  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const validateToken = async () => {
  const res = await API.get("/api/auth/validate");
  return res.data.valid;
};

export const getCurrentUser = async () => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
    }
  }

  const res = await API.get("/api/auth/validate");

  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
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