import axios from "axios";

export const api = axios.create({
  // Requests go through Next.js so auth cookies are issued for the frontend
  // domain. The route guard can then read them on Vercel.
  baseURL: "/api",
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
