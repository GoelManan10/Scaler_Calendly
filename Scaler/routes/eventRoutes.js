const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Validation rules
const eventValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters"),
  body("duration")
    .isInt({ min: 5, max: 480 })
    .withMessage("Duration must be an integer between 5 and 480 minutes"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),
];

const idParamValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

// Routes
router.post("/", eventValidation, validate, createEvent);
router.get("/", getAllEvents);
router.put("/:id", [...idParamValidation, ...eventValidation], validate, updateEvent);
router.delete("/:id", idParamValidation, validate, deleteEvent);

module.exports = router;
