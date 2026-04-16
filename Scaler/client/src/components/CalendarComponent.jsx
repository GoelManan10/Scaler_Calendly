import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent({ value, onChange, minDate }) {
  return (
    <div className="animate-fade-in">
      <Calendar
        onChange={onChange}
        value={value}
        minDate={minDate || new Date()}
        locale="en-US"
        next2Label={null}
        prev2Label={null}
        calendarType="iso8601"
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
        }
      />
    </div>
  );
}
