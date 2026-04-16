/**
 * Shared constants used across the application
 */

// Day definitions for availability scheduling
export const DAYS = [
  { key: 0, short: 'S', label: 'Sunday' },
  { key: 1, short: 'M', label: 'Monday' },
  { key: 2, short: 'T', label: 'Tuesday' },
  { key: 3, short: 'W', label: 'Wednesday' },
  { key: 4, short: 'T', label: 'Thursday' },
  { key: 5, short: 'F', label: 'Friday' },
  { key: 6, short: 'S', label: 'Saturday' },
];

// Timezone options for schedule configuration
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time - US & Canada' },
  { value: 'America/Chicago', label: 'Central Time - US & Canada' },
  { value: 'America/Denver', label: 'Mountain Time - US & Canada' },
  { value: 'America/Los_Angeles', label: 'Pacific Time - US & Canada' },
  { value: 'Asia/Kolkata', label: 'India Standard Time' },
  { value: 'Europe/London', label: 'London Time - UK' },
  { value: 'Europe/Berlin', label: 'Central European Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' },
  { value: 'UTC', label: 'UTC' },
];

// Color palette for event type cards
export const EVENT_COLORS = [
  '#7B61FF', // purple
  '#006BFF', // blue
  '#00BCD4', // teal
  '#FF7043', // orange
  '#E91E63', // pink
  '#2D9F3F', // green
];

// Default form state for creating a new event type
export const INITIAL_EVENT_FORM = {
  name: '',
  duration: 30,
  slug: '',
  bufferBefore: 0,
  bufferAfter: 0,
  questions: [],
  scheduleId: 1,
};

// Duration options for event types (in minutes)
export const DURATION_OPTIONS = [15, 30, 45, 60];

// Buffer time options (in minutes)
export const BUFFER_OPTIONS = [0, 5, 10, 15, 30];
