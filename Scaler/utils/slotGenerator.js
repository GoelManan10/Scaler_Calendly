/**
 * @desc Generate available time slots based on availability windows and event duration.
 *       Supports buffer time before/after meetings and date-specific overrides.
 *
 * @param {Array} availabilities  - Availability records for the target day
 * @param {Array} existingBookings - Bookings already made on the target date
 * @param {number} durationMinutes - Duration of the event in minutes
 * @param {number} bufferBefore    - Buffer time in minutes before meeting (default 0)
 * @param {number} bufferAfter     - Buffer time in minutes after meeting (default 0)
 * @param {Object|null} dateOverride - Optional date-specific override
 * @returns {Array<string>} Available time slots in "HH:mm" format
 */
const generateAvailableSlots = (
  availabilities,
  existingBookings,
  durationMinutes,
  bufferBefore = 0,
  bufferAfter = 0,
  dateOverride = null
) => {
  const slots = [];

  // If there's a date override, use that instead of regular availability
  let windows = availabilities;
  if (dateOverride) {
    if (!dateOverride.startTime || !dateOverride.endTime) {
      // Date is marked as unavailable
      return [];
    }
    windows = [{ startTime: dateOverride.startTime, endTime: dateOverride.endTime }];
  }

  // Total time needed per slot including buffers
  const totalSlotTime = durationMinutes;

  for (const availability of windows) {
    const [startHour, startMin] = availability.startTime.split(":").map(Number);
    const [endHour, endMin] = availability.endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    // Generate slots — each slot needs duration + bufferAfter spacing, but the slot
    // itself starts after any bufferBefore from the window start
    for (
      let minutes = startTotalMinutes;
      minutes + totalSlotTime <= endTotalMinutes;
      minutes += totalSlotTime + bufferAfter
    ) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      slots.push(timeStr);
    }
  }

  // Filter out already-booked slots (considering buffer time conflicts)
  const bookedTimes = existingBookings
    .filter((b) => b.status !== "cancelled")
    .map((b) => b.time);

  const bookedMinutes = bookedTimes.map((t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  });

  return slots.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + durationMinutes;

    // Check if this slot conflicts with any existing booking (including buffers)
    for (const bookedStart of bookedMinutes) {
      const bookedEnd = bookedStart + durationMinutes;
      const bufferedBookedStart = bookedStart - bufferBefore;
      const bufferedBookedEnd = bookedEnd + bufferAfter;

      // Check overlap
      if (slotStart < bufferedBookedEnd && slotEnd > bufferedBookedStart) {
        return false;
      }
    }
    return true;
  });
};

/**
 * @desc Check if a given time string falls within any availability window
 *       or a date override
 */
const isTimeWithinAvailability = (time, availabilities, dateOverride = null) => {
  const [hour, min] = time.split(":").map(Number);
  const timeInMinutes = hour * 60 + min;

  // If date override exists, check against that
  if (dateOverride) {
    if (!dateOverride.startTime || !dateOverride.endTime) return false;
    const [startH, startM] = dateOverride.startTime.split(":").map(Number);
    const [endH, endM] = dateOverride.endTime.split(":").map(Number);
    return timeInMinutes >= startH * 60 + startM && timeInMinutes < endH * 60 + endM;
  }

  return availabilities.some((a) => {
    const [startH, startM] = a.startTime.split(":").map(Number);
    const [endH, endM] = a.endTime.split(":").map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    return timeInMinutes >= start && timeInMinutes < end;
  });
};

module.exports = { generateAvailableSlots, isTimeWithinAvailability };
