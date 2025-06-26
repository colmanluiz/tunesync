import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_URL || "http://127.0.0.1:3001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default api;

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
}

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};