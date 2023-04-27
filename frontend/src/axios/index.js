import axios from "axios";
// eslint-disable-next-line no-unused-vars
import store from "@/store";

const API_URL = import.meta.env.VITE_API;

console.log("API", API_URL);

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url === "/user/refresh") {
      return error.response;
    }

    if (
      error.response?.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${API_URL}/user/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        // console.log("axios e", e);
        // store.dispatch("auth/logout");
      }
    }
    throw error;
  }
);

export default $api;
