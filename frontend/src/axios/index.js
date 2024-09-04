import axios from "axios";
import store from "@/store";

const API_URL = import.meta.env.VITE_API;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

function refreshJWTPrepare() {
  const fetchRefresh = () =>
    axios.get(`${API_URL}/user/refresh`, {
      withCredentials: true,
    });

  let isFetching = false;
  let reqFetch = null;

  return function () {
    if (isFetching === false) {
      reqFetch = fetchRefresh().then((value) => {
        isFetching = false;
        return value;
      });
      isFetching = true;
    }

    return reqFetch;
  };
}

const refreshJWT = refreshJWTPrepare();

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
        const response = await refreshJWT();
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        store.dispatch("auth/logout");
      }
    }
    throw error;
  }
);

export default $api;
