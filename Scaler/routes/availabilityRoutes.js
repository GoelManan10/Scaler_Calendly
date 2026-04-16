const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
  setAvailability,
  getAvailability,
} = require("../controllers/availabilityController");

const router = express.Router();

// Validation rules
const availabilityValidation = [
  body("dayOfWeek")
    .isInt({ min: 0, max: 6 })
    .withMessage("dayOfWeek must be an integer between 0 (Sunday) and 6 (Saturday)"),
  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("startTime must be in HH:mm format (24-hour)"),
  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("endTime must be in HH:mm format (24-hour)"),
  body("timezone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("timezone must be a non-empty string if provided"),
];

// Routes
router.post("/", availabilityValidation, validate, setAvailability);
router.get("/", getAvailability);

module.exports = router;
