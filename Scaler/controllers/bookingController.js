const prisma = require("../config/database");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const { generateAvailableSlots, isTimeWithinAvailability } = require("../utils/slotGenerator");
const { sendBookingConfirmation, sendBookingCancellation } = require("../utils/emailService");

/**
 * @route   POST /api/bookings
 * @desc    Create a booking after validating availability and preventing double-booking
 */
const createBooking = async (req, res, next) => {
  try {
    const { eventTypeId, name, email, date, time, answers } = req.body;

    // 1. Verify event type exists
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });
    if (!eventType) {
      return sendError(res, {
        statusCode: 404,
        message: "Event type not found",
      });
    }

    // 2. Determine the day of week from the requested date
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getUTCDay(); // 0 = Sunday

    // 3. Check for date-specific override first
    const dateOverride = await prisma.dateOverride.findFirst({
      where: { date: bookingDate, scheduleId: eventType.scheduleId },
    });

    // 4. Fetch availability for that day (if no override)
    let availabilities = [];
    if (!dateOverride) {
      availabilities = await prisma.availability.findMany({
        where: { dayOfWeek, scheduleId: eventType.scheduleId },
      });
      if (availabilities.length === 0) {
        return sendError(res, {
          statusCode: 400,
          message: `No availability set for ${getDayName(dayOfWeek)}`,
        });
      }
    }

    // 5. Slot validation
    if (!isTimeWithinAvailability(time, availabilities, dateOverride)) {
      return sendError(res, {
        statusCode: 400,
        message: "Requested time is outside of available hours",
      });
    }

    // 6. Prevent double booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        time,
        status: "confirmed",
      },
    });
    if (existingBooking) {
      return sendError(res, {
        statusCode: 409,
        message: "This time slot is already booked. Please choose a different time.",
      });
    }

    // 7. Create the booking
    const booking = await prisma.booking.create({
      data: {
        eventTypeId,
        name,
        email,
        date: bookingDate,
        time,
        answers: answers ? JSON.stringify(answers) : null,
      },
      include: {
        eventType: true,
      },
    });

    // 8. Send confirmation email (non-blocking)
    sendBookingConfirmation(booking).catch((err) =>
      console.error("Email send failed:", err.message)
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings
 * @desc    List all bookings, optionally filtered by date or event_type_id
 */
const getAllBookings = async (req, res, next) => {
  try {
    const { date, eventTypeId } = req.query;
    const where = {};

    if (date) {
      where.date = new Date(date);
    }
    if (eventTypeId) {
      where.eventTypeId = parseInt(eventTypeId);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        eventType: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return sendSuccess(res, {
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/slots
 * @desc    Get available time slots for a given event type and date
 */
const getAvailableSlots = async (req, res, next) => {
  try {
    const { eventTypeId, date } = req.query;

    if (!eventTypeId || !date) {
      return sendError(res, {
        statusCode: 400,
        message: "eventTypeId and date query params are required",
      });
    }

    // 1. Verify event type
    const eventType = await prisma.eventType.findUnique({
      where: { id: parseInt(eventTypeId) },
    });
    if (!eventType) {
      return sendError(res, {
        statusCode: 404,
        message: "Event type not found",
      });
    }

    // 2. Determine the day of week
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getUTCDay();

    // 3. Check for date-specific override
    const dateOverride = await prisma.dateOverride.findFirst({
      where: { date: bookingDate, scheduleId: eventType.scheduleId },
    });

    // 4. Get availability for that day
    const availabilities = await prisma.availability.findMany({
      where: { dayOfWeek, scheduleId: eventType.scheduleId },
    });

    // 5. Get existing bookings for that date
    const existingBookings = await prisma.booking.findMany({
      where: { date: bookingDate },
    });

    // 6. Generate available slots with buffer time
    const slots = generateAvailableSlots(
      availabilities,
      existingBookings,
      eventType.duration,
      eventType.bufferBefore || 0,
      eventType.bufferAfter || 0,
      dateOverride || null
    );

    return sendSuccess(res, {
      message: "Available slots retrieved successfully",
      data: {
        date,
        dayOfWeek,
        eventType: eventType.name,
        duration: eventType.duration,
        bufferBefore: eventType.bufferBefore,
        bufferAfter: eventType.bufferAfter,
        availableSlots: slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking by ID
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { eventType: true },
    });
    if (!existing) {
      return sendError(res, {
        statusCode: 404,
        message: "Booking not found",
      });
    }

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "cancelled" },
      include: { eventType: true },
    });

    // Send cancellation email (non-blocking)
    sendBookingCancellation(updated).catch((err) =>
      console.error("Cancellation email failed:", err.message)
    );

    return sendSuccess(res, {
      message: "Booking cancelled successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/bookings/:id/reschedule
 * @desc    Reschedule a booking to a new date/time
 */
const rescheduleBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    // 1. Find the original booking
    const original = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { eventType: true },
    });
    if (!original) {
      return sendError(res, {
        statusCode: 404,
        message: "Booking not found",
      });
    }
    if (original.status === "cancelled") {
      return sendError(res, {
        statusCode: 400,
        message: "Cannot reschedule a cancelled booking",
      });
    }

    // 2. Validate new date/time availability
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getUTCDay();

    const dateOverride = await prisma.dateOverride.findFirst({
      where: { date: bookingDate, scheduleId: original.eventType.scheduleId },
    });

    const availabilities = await prisma.availability.findMany({
      where: { dayOfWeek, scheduleId: original.eventType.scheduleId },
    });

    if (!dateOverride && availabilities.length === 0) {
      return sendError(res, {
        statusCode: 400,
        message: `No availability for ${getDayName(dayOfWeek)}`,
      });
    }

    if (!isTimeWithinAvailability(time, availabilities, dateOverride)) {
      return sendError(res, {
        statusCode: 400,
        message: "Requested time is outside of available hours",
      });
    }

    // 3. Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        time,
        status: "confirmed",
        id: { not: parseInt(id) },
      },
    });
    if (conflict) {
      return sendError(res, {
        statusCode: 409,
        message: "This time slot is already booked",
      });
    }

    // 4. Mark original as rescheduled and create new booking
    await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "rescheduled" },
    });

    const newBooking = await prisma.booking.create({
      data: {
        eventTypeId: original.eventTypeId,
        name: original.name,
        email: original.email,
        date: bookingDate,
        time,
        answers: original.answers,
        rescheduledFrom: original.id,
      },
      include: { eventType: true },
    });

    // Send confirmation email for rescheduled booking
    sendBookingConfirmation(newBooking, true).catch((err) =>
      console.error("Reschedule email failed:", err.message)
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Booking rescheduled successfully",
      data: newBooking,
    });
  } catch (error) {
    next(error);
  }
};

// Helper
const getDayName = (day) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day] || "Unknown";
};

module.exports = { createBooking, getAllBookings, getAvailableSlots, cancelBooking, rescheduleBooking };
