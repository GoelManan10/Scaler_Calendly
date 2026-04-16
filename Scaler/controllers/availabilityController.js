const prisma = require("../config/database");
const { sendSuccess, sendError } = require("../utils/responseHelper");

/**
 * @route   POST /api/availability
 * @desc    Set availability (create or update for a given day)
 */
const setAvailability = async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, timezone, scheduleId } = req.body;

    // Validate that startTime < endTime
    if (startTime >= endTime) {
      return sendError(res, {
        statusCode: 400,
        message: "start_time must be before end_time",
      });
    }

    const availability = await prisma.availability.create({
      data: { dayOfWeek, startTime, endTime, timezone: timezone || "UTC", scheduleId: scheduleId || 1 },
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Availability set successfully",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/availability
 * @desc    Get all availability records, optionally filtered by day_of_week
 */
const getAvailability = async (req, res, next) => {
  try {
    const { dayOfWeek, scheduleId } = req.query;
    const where = {};

    if (dayOfWeek !== undefined) {
      where.dayOfWeek = parseInt(dayOfWeek);
    }
    if (scheduleId !== undefined) {
      where.scheduleId = parseInt(scheduleId);
    }

    const availabilities = await prisma.availability.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return sendSuccess(res, {
      message: "Availability retrieved successfully",
      data: availabilities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { setAvailability, getAvailability };
