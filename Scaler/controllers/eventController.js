const prisma = require("../config/database");
const { sendSuccess, sendError } = require("../utils/responseHelper");

/**
 * @route   POST /api/events
 * @desc    Create a new event type
 */
const createEvent = async (req, res, next) => {
  try {
    const { name, duration, slug, bufferBefore, bufferAfter, questions, scheduleId } = req.body;

    const existing = await prisma.eventType.findUnique({ where: { slug } });
    if (existing) {
      return sendError(res, {
        statusCode: 409,
        message: `An event type with slug "${slug}" already exists.`,
      });
    }

    const eventType = await prisma.eventType.create({
      data: {
        name,
        duration,
        slug,
        bufferBefore: bufferBefore || 0,
        bufferAfter: bufferAfter || 0,
        scheduleId: scheduleId || 1,
        questions: questions ? JSON.stringify(questions) : null,
      },
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Event type created successfully",
      data: eventType,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events
 * @desc    Get all event types
 */
const getAllEvents = async (req, res, next) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, {
      message: "Event types retrieved successfully",
      data: eventTypes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event type by ID
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, duration, slug, bufferBefore, bufferAfter, questions, scheduleId } = req.body;

    // Check if event exists
    const existing = await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return sendError(res, {
        statusCode: 404,
        message: "Event type not found",
      });
    }

    // If slug is being changed, check uniqueness
    if (slug && slug !== existing.slug) {
      const slugTaken = await prisma.eventType.findUnique({ where: { slug } });
      if (slugTaken) {
        return sendError(res, {
          statusCode: 409,
          message: `An event type with slug "${slug}" already exists.`,
        });
      }
    }

    const data = { name, duration, slug };
    if (bufferBefore !== undefined) data.bufferBefore = bufferBefore;
    if (bufferAfter !== undefined) data.bufferAfter = bufferAfter;
    if (scheduleId !== undefined) data.scheduleId = scheduleId;
    if (questions !== undefined) data.questions = questions ? JSON.stringify(questions) : null;

    const updatedEvent = await prisma.eventType.update({
      where: { id: parseInt(id) },
      data,
    });

    return sendSuccess(res, {
      message: "Event type updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event type by ID
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.eventType.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      return sendError(res, {
        statusCode: 404,
        message: "Event type not found",
      });
    }

    await prisma.eventType.delete({ where: { id: parseInt(id) } });

    return sendSuccess(res, {
      message: "Event type deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent };
