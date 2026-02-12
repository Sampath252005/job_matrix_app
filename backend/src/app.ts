// app.ts
import "dotenv/config"; // MUST be first
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
 app.use("/api/recruiter", recruiterRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export default app;
