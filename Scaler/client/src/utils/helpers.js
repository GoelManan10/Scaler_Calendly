/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time from "HH:mm" to "h:mm AM/PM"
 */
export const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

/**
 * Format date to YYYY-MM-DD for API calls
 */
export const toISODate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Get day name from index
 */
export const getDayName = (index) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[index];
};

/**
 * Check if a date is in the past
 */
export const isPast = (dateStr, timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d < new Date();
};

/**
 * Slugify a string
 */
export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
