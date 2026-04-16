const express = require("express");
const router = express.Router();
const { getSchedules, createSchedule } = require("../controllers/scheduleController");

router.get("/", getSchedules);
router.post("/", createSchedule);

module.exports = router;
