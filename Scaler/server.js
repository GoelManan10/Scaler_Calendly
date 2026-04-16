require("dotenv").config();

const express = require("express");
const cors = require("cors");
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Calendly API is running 🚀",
    version: "1.0.0",
    endpoints: {
      events: "/api/events",
      availability: "/api/availability",
      bookings: "/api/bookings",
      dateOverrides: "/api/date-overrides",
      availableSlots: "/api/bookings/slots?eventTypeId=<id>&date=<YYYY-MM-DD>",
      reschedule: "/api/bookings/:id/reschedule",
    },
  });
});

// ─── API Routes ──────────────────────────────────────────────────────
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/date-overrides", dateOverrideRoutes);
app.use("/api/schedules", scheduleRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Error-Handling Middleware ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🗓️  Calendly Backend API`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   URL         : http://localhost:${PORT}\n`);
});

module.exports = app;
