const prisma = require("../config/database");
const { sendSuccess, sendError } = require("../utils/responseHelper");

/**
 * @route   POST /api/date-overrides
 * @desc    Create a date-specific hour override
 */
const createDateOverride = async (req, res, next) => {
  try {
    const { date, startTime, endTime, scheduleId } = req.body;

    // Validate times if provided (null means unavailable)
    if (startTime && endTime && startTime >= endTime) {
      return sendError(res, {
        statusCode: 400,
        message: "start_time must be before end_time",
      });
    }

    // Check for existing override on this date
    const existing = await prisma.dateOverride.findFirst({
      where: {
        date: new Date(date),
        scheduleId: scheduleId || 1,
      },
    });

    if (existing) {
      // Update existing override
      const updated = await prisma.dateOverride.update({
        where: { id: existing.id },
        data: { startTime: startTime || null, endTime: endTime || null },
      });
      return sendSuccess(res, {
        message: "Date override updated successfully",
        data: updated,
      });
    }

    const override = await prisma.dateOverride.create({
      data: {
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        scheduleId: scheduleId || 1,
      },
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Date override created successfully",
      data: override,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/date-overrides
 * @desc    Get all date overrides
 */
const getDateOverrides = async (req, res, next) => {
  try {
    const { scheduleId } = req.query;
    const where = {};
    if (scheduleId !== undefined) {
      where.scheduleId = parseInt(scheduleId);
    }
    const overrides = await prisma.dateOverride.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return sendSuccess(res, {
      message: "Date overrides retrieved successfully",
      data: overrides,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/date-overrides/:id
 * @desc    Delete a date override
 */
const deleteDateOverride = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.dateOverride.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return sendError(res, {
        statusCode: 404,
        message: "Date override not found",
      });
    }

    await prisma.dateOverride.delete({ where: { id: parseInt(id) } });

    return sendSuccess(res, {
      message: "Date override deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDateOverride, getDateOverrides, deleteDateOverride };
