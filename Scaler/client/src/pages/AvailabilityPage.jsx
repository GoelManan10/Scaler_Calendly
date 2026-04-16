import { useState, useEffect, useCallback } from 'react';
import { getAvailability, setAvailability, getSchedules, createSchedule, getDateOverrides, createDateOverride, deleteDateOverride } from '../services/api';
import { DAYS, TIMEZONES } from '../constants';
import useToast from '../hooks/useToast';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState([]);
  const [activeScheduleId, setActiveScheduleId] = useState(null);
  const [dateOverridesState, setDateOverridesState] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [timezone, setTimezone] = useState('America/New_York');

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideDate, setOverrideDate] = useState('');
  const [overrideAvailable, setOverrideAvailable] = useState(true);
  const [overrideStart, setOverrideStart] = useState('09:00');
  const [overrideEnd, setOverrideEnd] = useState('17:00');

  const { toast, showToast, clearToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const schedRes = await getSchedules();
      const scheds = schedRes.data.data;
      setSchedules(scheds);
      
      let currentId = activeScheduleId;
      if (!currentId && scheds.length > 0) {
        currentId = scheds[0].id;
        setActiveScheduleId(currentId);
      }
      
      if (currentId) {
        const [availRes, overridesRes] = await Promise.all([
          getAvailability(undefined, currentId),
          getDateOverrides(currentId),
        ]);
        
        const avails = availRes.data.data;
        if (avails.length > 0) {
          setSelectedDays(avails.map((a) => a.dayOfWeek));
          setStartTime(avails[0].startTime || '09:00');
          setEndTime(avails[0].endTime || '17:00');
          setTimezone(avails[0].timezone);
        } else {
          setSelectedDays([]);
        }
        
        setDateOverridesState(overridesRes.data.data);
      }
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeScheduleId, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSaveAvailability = async () => {
    if (!activeScheduleId) return;
    if (startTime >= endTime) { showToast('Start time must be before end time', 'error'); return; }
    if (selectedDays.length === 0) { showToast('Select at least one day', 'error'); return; }
    
    setSaving(true);
    try {
      for (const day of selectedDays) {
        await setAvailability({ dayOfWeek: day, startTime, endTime, timezone, scheduleId: activeScheduleId });
      }
      showToast('Weekly hours saved!');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!newScheduleName.trim()) return;
    setSaving(true);
    try {
      const res = await createSchedule({ name: newScheduleName, timezone });
      showToast('Schedule created');
      setActiveScheduleId(res.data.data.id);
      setShowScheduleModal(false);
      setNewScheduleName('');
    } catch {
      showToast('Failed to create schedule', 'error');
    } finally {
      setSaving(false);
      fetchData();
    }
  };

  const handleCreateOverride = async (e) => {
    e.preventDefault();
    if (!overrideDate || !activeScheduleId) return;
    if (overrideAvailable && overrideStart >= overrideEnd) {
      showToast('Start time must be before end time', 'error');
      return;
    }
    setSaving(true);
    try {
      await createDateOverride({
        date: overrideDate,
        startTime: overrideAvailable ? overrideStart : null,
        endTime: overrideAvailable ? overrideEnd : null,
        scheduleId: activeScheduleId
      });
      showToast('Date override saved');
      setShowOverrideModal(false);
      fetchData();
    } catch {
      showToast('Failed to save date override', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOverride = async (id) => {
    try {
      await deleteDateOverride(id);
      showToast('Override deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const activeSchedule = schedules.find(s => s.id === activeScheduleId);

  if (loading && !schedules.length) return <Loader text="Loading availability..." />;

  return (
    <div className="page-content">
      {toast && <Toast {...toast} onClose={clearToast} />}

      <h1 className="avail-page-title">Availability</h1>

      <div className="avail-card">
        {/* Schedule Selection */}
        <div className="avail-schedule-header">
          <div className="avail-schedule-selector">
            <span className="avail-schedule-label">Schedule:</span>
            <select
              value={activeScheduleId || ''}
              onChange={(e) => setActiveScheduleId(Number(e.target.value))}
              className="avail-schedule-select"
            >
              {schedules.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowScheduleModal(true)} className="create-btn">
            + New Schedule
          </button>
        </div>

        {activeSchedule && (
          <>
            {/* Weekly Hours Header */}
            <div className="avail-section-header">
              <div>
                <h2 className="avail-section-title">Weekly hours</h2>
                <p className="avail-section-subtitle">Set when you are typically available</p>
              </div>
            </div>

            {/* Day Rows */}
            <div className="avail-day-list">
              {DAYS.map(({ key, short, label }) => {
                const isActive = selectedDays.includes(key);
                return (
                  <div className="avail-day-row" key={key}>
                    <button
                      className={`avail-day-badge ${isActive ? 'active' : ''}`}
                      onClick={() => toggleDay(key)}
                      title={label}
                    >
                      {short}
                    </button>

                    {isActive ? (
                      <div className="avail-day-times">
                        <input type="time" className="avail-time-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        <span className="avail-time-separator">–</span>
                        <input type="time" className="avail-time-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                      </div>
                    ) : (
                      <span className="avail-day-unavailable">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Date Overrides Section */}
            <div className="avail-override-section">
              <div className="avail-section-header">
                <div>
                  <h2 className="avail-section-title">Date-specific hours</h2>
                  <p className="avail-section-subtitle">Override availability for specific days</p>
                </div>
                <button className="create-btn" onClick={() => setShowOverrideModal(true)}>
                  + Add Date Override
                </button>
              </div>

              <div className="avail-override-list">
                {dateOverridesState.length === 0 ? (
                  <p className="avail-override-empty">No date-specific hours set.</p>
                ) : (
                  dateOverridesState.map(ov => (
                    <div key={ov.id} className="avail-override-card">
                      <div>
                        <strong className="avail-override-date">{new Date(ov.date).toLocaleDateString()}</strong>
                        <span className="avail-override-time">
                          {ov.startTime && ov.endTime ? `${ov.startTime} – ${ov.endTime}` : 'Unavailable'}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteOverride(ov.id)} className="avail-override-delete">Delete</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="avail-save-row">
              <button onClick={handleSaveAvailability} disabled={saving} className="create-btn">
                {saving ? 'Saving...' : 'Save Weekly Hours'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* New Schedule Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="New Schedule">
        <form onSubmit={handleCreateSchedule} className="modal-form">
          <div className="form-group">
            <label className="form-label">Schedule Name</label>
            <input type="text" value={newScheduleName} onChange={e => setNewScheduleName(e.target.value)} required className="form-input" placeholder="e.g. Weekend Hours" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowScheduleModal(false)} className="form-btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="form-btn-primary">{saving ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* New Override Modal */}
      <Modal isOpen={showOverrideModal} onClose={() => setShowOverrideModal(false)} title="Date-specific hours">
        <form onSubmit={handleCreateOverride} className="modal-form">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" value={overrideDate} onChange={e => setOverrideDate(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group-inline">
            <input type="checkbox" checked={overrideAvailable} onChange={e => setOverrideAvailable(e.target.checked)} id="ov-avail" className="form-checkbox" />
            <label htmlFor="ov-avail" className="form-label-inline">Available on this day?</label>
          </div>
          {overrideAvailable && (
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Start time</label>
                <input type="time" value={overrideStart} onChange={e => setOverrideStart(e.target.value)} className="form-input" required />
              </div>
              <span className="form-time-separator">to</span>
              <div className="form-group">
                <label className="form-label">End time</label>
                <input type="time" value={overrideEnd} onChange={e => setOverrideEnd(e.target.value)} className="form-input" required />
              </div>
            </div>
          )}
          <div className="form-actions">
            <button type="button" onClick={() => setShowOverrideModal(false)} className="form-btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="form-btn-primary">{saving ? 'Saving...' : 'Save Override'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
