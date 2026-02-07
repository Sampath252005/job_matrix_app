import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

console.log("ENV TEST >>>", process.env.TEST_ENV);
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

export default app;
