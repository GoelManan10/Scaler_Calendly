require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const eventRoutes = require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dateOverrideRoutes = require("./routes/dateOverrideRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
    message: "Calendly API is running",
    version: "1.0.0",
  });
});

// ─── Serve React Frontend in Production ──────────────────────────────
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "dist");
  app.use(express.static(clientBuildPath));

  // Any route that doesn't match /api/* gets the React index.html (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Calendly API is running 🚀 (development)",
      endpoints: {
        events: "/api/events",
        availability: "/api/availability",
        bookings: "/api/bookings",
        dateOverrides: "/api/date-overrides",
        schedules: "/api/schedules",
      },
    });
  });
}

// ─── 404 Handler (API only) ──────────────────────────────────────────
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🗓️  Calendly Backend API`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}\n`);
});

module.exports = app;
