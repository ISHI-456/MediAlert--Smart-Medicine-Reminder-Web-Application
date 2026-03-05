

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    //http header that tells type of sending data
    "Content-Type": "application/json",
  },
});

// Add JWT token if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token saved on login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
