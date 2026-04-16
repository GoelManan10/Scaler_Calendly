const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const {
  createBooking,
  getAllBookings,
  getAvailableSlots,
  cancelBooking,
  rescheduleBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// Validation rules
const bookingValidation = [
  body("eventTypeId")
    .isInt({ min: 1 })
    .withMessage("eventTypeId must be a positive integer"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("date")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in HH:mm format (24-hour)"),
  body("answers")
    .optional()
    .isArray()
    .withMessage("Answers must be an array"),
];

const idParamValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

const rescheduleValidation = [
  ...idParamValidation,
  body("date")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in HH:mm format (24-hour)"),
];

// Routes
router.post("/", bookingValidation, validate, createBooking);
router.get("/", getAllBookings);
router.get("/slots", getAvailableSlots);
router.delete("/:id", idParamValidation, validate, cancelBooking);
router.put("/:id/reschedule", rescheduleValidation, validate, rescheduleBooking);

module.exports = router;
