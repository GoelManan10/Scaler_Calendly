require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");

// Route imports
const eventRoutes = require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dateOverrideRoutes = require("./routes/dateOverrideRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Global Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ──────────────────────────────────────────────────────
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/date-overrides", dateOverrideRoutes);
app.use("/api/schedules", scheduleRoutes);

// ─── Health Check ────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Calendly API is running 🚀",
    version: "1.0.0",
  });
});

// ─── Serve Frontend (React Build) ────────────────────────────────────
const __dirnameResolved = path.resolve();

// Static files (React build)
app.use(express.static(path.join(__dirnameResolved, "client/dist")));

// React routing fix (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirnameResolved, "client/dist/index.html"));
});

// ─── Error-Handling Middleware ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🗓️  Calendly Fullstack App`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}\n`);
});

// Graceful shutdown (pro level 🔥)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;