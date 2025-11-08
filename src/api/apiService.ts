import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

export const publicApiService = axios.create({
  baseURL: BASE_URL,
});

export const privateApiService = axios.create({
  baseURL: BASE_URL,
});

privateApiService.interceptors.request.use((config) => {
  const persistAuth = localStorage.getItem("persist:auth");
  if (persistAuth) {
    try {
      const authState = JSON.parse(persistAuth);
      const token = JSON.parse(authState.token);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error("Failed to parse token", err);
    }
  }
  return config;
});

privateApiService.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error, please check connection",
      });
    }

    const { status, data } = error.response;
    switch (status) {
      case 401:
      case 403:
        localStorage.removeItem("persist:auth");
        window.location.href = "/login";
        break;
      default:
        console.error("API Error:", data.message || error.message);
    }
    return Promise.reject(data || error);
  }
);

publicApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error, please check your connection",
      });
    }
    return Promise.reject(error.response.data || error);
  }
);
