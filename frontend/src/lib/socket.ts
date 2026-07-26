import { io } from "socket.io-client";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof window === "undefined"
    ? "http://localhost:2000"
    : `${window.location.protocol}//${window.location.hostname}:2000`);

export const socket = io(backendUrl, {
  autoConnect: false,
  withCredentials: true,
});
