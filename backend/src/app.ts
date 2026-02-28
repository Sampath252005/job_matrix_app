// app.ts
import "dotenv/config"; // MUST be first
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cors from "cors"
// import recruiterRoutes from "./routes/recruiter.routes.js";
// import candidateRoutes from "./routes/candidate.routes.js"
import profileRoutes from "./modules/profiles/profile.routes.js";
import jobsRoutes from "./modules/jobs/jobs.routes.js";
import applicationRoutes from "./modules/applications/applications.routes.js";
import dashboardroutes from "./modules/dashboard/dashboard.routes.js";
const app = express();

// CORS FIRST
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardroutes);
// app.use("/api/candidate", candidateRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export default app;
