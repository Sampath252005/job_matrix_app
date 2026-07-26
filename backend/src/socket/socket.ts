import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { allowedFrontendOrigins } from "../config/cors.js";
import { getSupabase } from "../services/supabase.service.js";

let io: Server;

const getAccessToken = (cookieHeader?: string) => {
  const accessTokenCookie = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("access_token="));

  if (!accessTokenCookie) return null;

  return decodeURIComponent(accessTokenCookie.slice("access_token=".length));
};

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedFrontendOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const accessToken = getAccessToken(socket.handshake.headers.cookie);
      if (!accessToken) {
        return next(new Error("Unauthorized"));
      }

      const { data, error } = await getSupabase().auth.getUser(accessToken);
      if (error || !data.user) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = data.user.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined user:${userId}`);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
