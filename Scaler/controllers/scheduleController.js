const prisma = require("../config/database");
const { sendSuccess, sendError } = require("../utils/responseHelper");

/**
 * @route   GET /api/schedules
 * @desc    Get all schedules
 */
const getSchedules = async (req, res, next) => {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { id: "asc" },
    });

    return sendSuccess(res, {
      message: "Schedules retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/schedules
 * @desc    Create a new schedule
 */
const createSchedule = async (req, res, next) => {
  try {
    const { name, timezone } = req.body;

    if (!name) {
      return sendError(res, {
        statusCode: 400,
        message: "Schedule name is required",
      });
    }

    const schedule = await prisma.schedule.create({
      data: {
        name,
        timezone: timezone || "UTC",
        isDefault: false,
      },
    });

    // Optionally create empty availability (or auto-populate them in frontend)

    return sendSuccess(res, {
      statusCode: 201,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSchedules, createSchedule };
