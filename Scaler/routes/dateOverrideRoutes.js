const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const {
  createDateOverride,
  getDateOverrides,
  deleteDateOverride,
} = require("../controllers/dateOverrideController");

const router = express.Router();

// Validation rules
const dateOverrideValidation = [
  body("date")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("startTime")
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("startTime must be in HH:mm format (24-hour)"),
  body("endTime")
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("endTime must be in HH:mm format (24-hour)"),
];

const idParamValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

// Routes
router.post("/", dateOverrideValidation, validate, createDateOverride);
router.get("/", getDateOverrides);
router.delete("/:id", idParamValidation, validate, deleteDateOverride);

module.exports = router;
