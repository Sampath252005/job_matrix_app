import axios from "axios";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof window === "undefined"
    ? "http://localhost:2000"
    : `${window.location.protocol}//${window.location.hostname}:2000`);

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/auth/login"
    ) {
      localStorage.removeItem("User");

      const redirect = `${window.location.pathname}${window.location.search}`;
      const loginUrl = new URL("/auth/login", window.location.origin);
      loginUrl.searchParams.set("redirect", redirect);
      window.location.replace(loginUrl.toString());
    }

    return Promise.reject(error);
  },
);
