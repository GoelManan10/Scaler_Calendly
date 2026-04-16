import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvents, getAvailableSlots, createBooking } from '../services/api';
import CalendarComponent from '../components/CalendarComponent';
import TimeSlotButton from '../components/TimeSlotButton';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { toISODate, formatDate, formatTime } from '../utils/helpers';

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await getEvents();
        const found = data.data.find((e) => e.slug === slug);
        if (!found) showToast('Event not found', 'error');
        setEvent(found || null);
      } catch {
        showToast('Failed to load event', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const fetchSlots = useCallback(async (date) => {
    if (!event) return;
    setLoadingSlots(true);
    setSelectedTime(null);
    setShowForm(false);
    try {
      const { data } = await getAvailableSlots(event.id, toISODate(date));
      setSlots(data.data.availableSlots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [event]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleTimeConfirm = () => {
    setShowForm(true);
  };

  const handleBooking = async ({ name, email }) => {
    setSubmitting(true);
    try {
      await createBooking({
        eventTypeId: event.id,
        name, email,
        date: toISODate(selectedDate),
        time: selectedTime,
      });
      navigate('/confirmation', {
        state: { eventName: event.name, duration: event.duration, date: toISODate(selectedDate), time: selectedTime, name, email },
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading..." />;

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary mb-2">Event Not Found</h2>
          <p className="text-text-secondary text-sm">No event type with slug "/{slug}" exists.</p>
        </div>
      </div>
    );
  }

  /* ─── Calendly Booking Layout ─────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="bg-card rounded-xl shadow-lg border border-border-light w-full max-w-4xl overflow-hidden animate-scale-in">
        <div className="flex flex-col lg:flex-row min-h-[520px]">

          {/* ── Left Panel: Event Info ───────────────────────────── */}
          <div className={`border-b lg:border-b-0 lg:border-r border-border-light p-6 lg:p-8 ${showForm ? 'lg:w-[280px]' : 'lg:w-[300px]'} flex-shrink-0`}>
            {/* User avatar placeholder */}
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-4">
              {event.name.charAt(0)}
            </div>

            {showForm && (
              <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">
                Calendly
              </p>
            )}

            <h1 className="text-xl font-bold text-text-primary mb-4 leading-snug">
              {event.name}
            </h1>

            {/* Meta info with icons */}
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-text-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.duration} min
              </div>

              {showForm && selectedDate && selectedTime && (
                <>
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-text-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatTime(selectedTime)}, {formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-text-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    <span>India Standard Time</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Center: Calendar or Form ─────────────────────────── */}
          {showForm ? (
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <BookingForm
                onSubmit={handleBooking}
                loading={submitting}
                onBack={() => setShowForm(false)}
                questions={event.questions ? JSON.parse(event.questions) : []}
              />
            </div>
          ) : (
            <>
              {/* Calendar */}
              <div className="flex-1 p-6 lg:p-8">
                <h2 className="text-base font-bold text-text-primary mb-5">
                  Select a Date & Time
                </h2>
                <CalendarComponent
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                />

                {/* Timezone */}
                <div className="mt-5 pt-4 border-t border-border-light">
                  <p className="text-xs font-bold text-text-primary mb-1">Time zone</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    India Standard Time
                  </p>
                </div>
              </div>

              {/* ── Right: Time Slots (appears after date selection) ── */}
              {selectedDate && (
                <div className="lg:w-[220px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border-light p-5 overflow-y-auto animate-slide-right">
                  <h3 className="text-sm font-bold text-text-primary mb-4">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  {loadingSlots ? (
                    <Loader text="" />
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-text-tertiary text-center py-8">
                      No available times
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((time) => (
                        <TimeSlotButton
                          key={time}
                          time={time}
                          selected={selectedTime === time}
                          onClick={() => handleTimeSelect(time)}
                          onConfirm={handleTimeConfirm}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="text-center mt-4">
        <span className="text-xs text-text-tertiary">
          Cookie settings · Privacy Policy
        </span>
      </div>
    </div>
  );
}
