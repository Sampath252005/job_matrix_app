// server.ts
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/socket.js";

const PORT = Number(process.env.PORT) || 2000;

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT: ${PORT}`);
});