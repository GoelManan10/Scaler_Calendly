import { useState, useEffect, useCallback } from 'react';
import { getBookings, cancelBooking, rescheduleBooking, getAvailableSlots } from '../services/api';
import useToast from '../hooks/useToast';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { formatDate, formatTime, isPast, toISODate } from '../utils/helpers';
import CalendarComponent from '../components/CalendarComponent';

export default function MeetingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  // Reschedule state
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleBookingData, setRescheduleBookingData] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleTime, setRescheduleTime] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  // ─── Data Fetching ───────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await getBookings();
      setBookings(data.data);
    } catch {
      showToast('Failed to load meetings', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ─── Cancel Handler ──────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      showToast('Meeting cancelled successfully');
      fetchBookings();
    } catch {
      showToast('Failed to cancel meeting', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  // ─── Reschedule Flow ─────────────────────────────────────────
  const openReschedule = (booking) => {
    setRescheduleBookingData(booking);
    setRescheduleDate(null);
    setRescheduleSlots([]);
    setRescheduleTime(null);
    setRescheduleModal(true);
  };

  const handleRescheduleDateChange = async (date) => {
    setRescheduleDate(date);
    setRescheduleTime(null);
    if (!rescheduleBookingData) return;
    setLoadingSlots(true);
    try {
      const { data } = await getAvailableSlots(rescheduleBookingData.eventTypeId, toISODate(date));
      setRescheduleSlots(data.data.availableSlots || []);
    } catch {
      showToast('Failed to load slots', 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleDate || !rescheduleTime) return;
    setRescheduling(true);
    try {
      await rescheduleBooking(rescheduleBookingData.id, {
        date: toISODate(rescheduleDate),
        time: rescheduleTime,
      });
      showToast('Meeting rescheduled successfully');
      setRescheduleModal(false);
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reschedule', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  // ─── Derived State ───────────────────────────────────────────
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && !isPast(b.date, b.time));
  const past = bookings.filter((b) => b.status !== 'confirmed' || isPast(b.date, b.time));
  const displayed = tab === 'upcoming' ? upcoming : past;

  // ─── Meeting Status Helpers ──────────────────────────────────
  const getStatusInfo = (booking) => {
    const isOld = isPast(booking.date, booking.time);
    if (booking.status === 'cancelled') return { colorClass: 'cancelled', badge: 'Cancelled' };
    if (booking.status === 'rescheduled') return { colorClass: 'rescheduled', badge: 'Rescheduled' };
    if (isOld) return { colorClass: 'past', badge: 'Completed' };
    return { colorClass: 'upcoming', badge: 'Confirmed', showActions: true };
  };

  if (loading) return <Loader text="Loading scheduled events..." />;

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="page-content">
      {toast && <Toast {...toast} onClose={clearToast} />}

      <div className="scheduling-header">
        <h1 className="scheduling-title">Meetings</h1>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { key: 'past', label: 'Past', count: past.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)} className={`tab ${tab === key ? 'active' : ''}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Content */}
      {displayed.length === 0 ? (
        <EmptyState
          icon={tab === 'upcoming' ? '📅' : '📋'}
          title={`No ${tab} events`}
          message={tab === 'upcoming'
            ? 'No upcoming events scheduled. Share your booking link to get started.'
            : 'No past events to display.'}
        />
      ) : (
        <div className="meetings-list">
          {displayed.map((booking, i) => {
            const status = getStatusInfo(booking);
            const isCancelling = cancellingId === booking.id;

            return (
              <div key={booking.id} className="meeting-card animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="meeting-card-inner">
                  <div className={`meeting-color-bar ${status.colorClass}`} />
                  <div className="meeting-body">
                    <div className="meeting-content">
                      <div>
                        <p className="meeting-time-label">{formatTime(booking.time)} – {formatDate(booking.date)}</p>
                        <h3 className="meeting-title">{booking.eventType?.name || 'Meeting'}</h3>
                        <div className="meeting-details">
                          <span className="meeting-detail-item">
                            <svg className="meeting-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {booking.name}
                          </span>
                          <span className="meeting-detail-item">
                            <svg className="meeting-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {booking.email}
                          </span>
                        </div>
                      </div>

                      <div className="meeting-actions">
                        <span className={`meeting-badge ${status.colorClass}`}>{status.badge}</span>
                        {status.showActions && (
                          <>
                            <button className="meeting-reschedule-btn" onClick={() => openReschedule(booking)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Reschedule
                            </button>
                            <button onClick={() => handleCancel(booking.id)} disabled={isCancelling} className="meeting-cancel-btn">
                              {isCancelling ? (
                                <><span className="spinner-sm" /> Cancelling...</>
                              ) : (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal isOpen={rescheduleModal} onClose={() => setRescheduleModal(false)} title="Reschedule Meeting">
        <div className="reschedule-modal-content">
          {rescheduleBookingData && (
            <p className="reschedule-info">
              Rescheduling <strong>{rescheduleBookingData.eventType?.name}</strong> with <strong>{rescheduleBookingData.name}</strong>
            </p>
          )}

          <div className="reschedule-calendar">
            <CalendarComponent onChange={handleRescheduleDateChange} value={rescheduleDate} minDate={new Date()} />
          </div>

          {rescheduleDate && (
            <div className="reschedule-slots">
              <h4 className="reschedule-slots-title">Available times for {formatDate(rescheduleDate)}</h4>
              {loadingSlots ? (
                <p className="reschedule-slots-empty">Loading slots...</p>
              ) : rescheduleSlots.length === 0 ? (
                <p className="reschedule-slots-empty">No slots available for this date.</p>
              ) : (
                <div className="reschedule-slots-grid">
                  {rescheduleSlots.map((slot) => (
                    <button key={slot} className={`reschedule-slot ${rescheduleTime === slot ? 'active' : ''}`} onClick={() => setRescheduleTime(slot)}>
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button onClick={() => setRescheduleModal(false)} className="form-btn-secondary">Cancel</button>
            <button onClick={handleRescheduleSubmit} disabled={!rescheduleDate || !rescheduleTime || rescheduling} className="form-btn-primary">
              {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
