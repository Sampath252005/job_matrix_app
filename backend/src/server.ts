// server.ts
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 2000;
const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
