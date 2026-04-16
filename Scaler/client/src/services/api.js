import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Schedules ────────────────────────────────────────────────
export const getSchedules = () => API.get('/schedules');
export const createSchedule = (data) => API.post('/schedules', data);

// ─── Event Types ──────────────────────────────────────────────
export const getEvents = () => API.get('/events');
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ─── Availability ─────────────────────────────────────────────
export const getAvailability = (dayOfWeek, scheduleId) => {
  const params = {};
  if (dayOfWeek !== undefined) params.dayOfWeek = dayOfWeek;
  if (scheduleId !== undefined) params.scheduleId = scheduleId;
  return API.get('/availability', { params });
};
export const setAvailability = (data) => API.post('/availability', data);

// ─── Date Overrides ───────────────────────────────────────────
export const getDateOverrides = (scheduleId) => {
  const params = scheduleId !== undefined ? { scheduleId } : {};
  return API.get('/date-overrides', { params });
};
export const createDateOverride = (data) => API.post('/date-overrides', data);
export const deleteDateOverride = (id) => API.delete(`/date-overrides/${id}`);

// ─── Bookings ─────────────────────────────────────────────────
export const getBookings = (params) => API.get('/bookings', { params });
export const createBooking = (data) => API.post('/bookings', data);
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
export const rescheduleBooking = (id, data) => API.put(`/bookings/${id}/reschedule`, data);
export const getAvailableSlots = (eventTypeId, date) =>
  API.get('/bookings/slots', { params: { eventTypeId, date } });

export default API;
