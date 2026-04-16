import { useState, useEffect, useCallback } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, getSchedules } from '../services/api';
import { EVENT_COLORS, INITIAL_EVENT_FORM } from '../constants';
import useToast from '../hooks/useToast';
import useClickOutside from '../hooks/useClickOutside';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import DropdownMenu from '../components/DropdownMenu';
import EventTypeForm from '../components/EventTypeForm';
import { slugify } from '../utils/helpers';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(INITIAL_EVENT_FORM);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('event-types');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const { toast, showToast, clearToast } = useToast();
  const menuRef = useClickOutside(() => setOpenMenuId(null), openMenuId !== null);

  // ─── Data Fetching ───────────────────────────────────────────
  const fetchEventsAndSchedules = useCallback(async () => {
    try {
      const [eventsRes, schedulesRes] = await Promise.all([getEvents(), getSchedules()]);
      setEvents(eventsRes.data.data);
      setSchedules(schedulesRes.data.data);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchEventsAndSchedules(); }, [fetchEventsAndSchedules]);

  // ─── Modal Handlers ──────────────────────────────────────────
  const openCreate = () => {
    setEditingEvent(null);
    setForm(INITIAL_EVENT_FORM);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    const questions = event.questions ? JSON.parse(event.questions) : [];
    setForm({
      name: event.name, duration: event.duration, slug: event.slug,
      bufferBefore: event.bufferBefore || 0, bufferAfter: event.bufferAfter || 0,
      scheduleId: event.scheduleId || 1, questions,
    });
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Listen for Sidebar "Create" button
  useEffect(() => {
    const handleOpenCreate = () => openCreate();
    window.addEventListener('open-create-modal', handleOpenCreate);
    if (new URLSearchParams(window.location.search).get('action') === 'create') {
      openCreate();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return () => window.removeEventListener('open-create-modal', handleOpenCreate);
  }, []);

  // ─── CRUD Handlers ───────────────────────────────────────────
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: editingEvent ? f.slug : slugify(name) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, form);
        showToast('Event updated successfully');
      } else {
        await createEvent(form);
        showToast('Event created successfully');
      }
      setShowModal(false);
      fetchEventsAndSchedules();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setOpenMenuId(null);
    if (!window.confirm('Are you sure you want to delete this event type?')) return;
    try {
      await deleteEvent(id);
      showToast('Event deleted');
      fetchEventsAndSchedules();
    } catch {
      showToast('Failed to delete event', 'error');
    }
  };

  const handleCopyLink = (event) => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${event.slug}`);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Dropdown Menu Items (per event) ─────────────────────────
  const getMenuItems = (event) => [
    {
      label: 'Edit',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      onClick: () => openEdit(event),
    },
    {
      label: 'Copy booking link',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
      onClick: () => { handleCopyLink(event); setOpenMenuId(null); },
    },
    {
      label: 'View booking page',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
      href: `/book/${event.slug}`,
      onClick: () => setOpenMenuId(null),
    },
    { divider: true },
    {
      label: 'Delete',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: () => handleDelete(event.id),
      danger: true,
    },
  ];

  // ─── Derived State ───────────────────────────────────────────
  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading event types..." />;

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="page-content">
      {toast && <Toast {...toast} onClose={clearToast} />}

      {/* Header */}
      <div className="scheduling-header">
        <h1 className="scheduling-title" id="scheduling-title">
          Scheduling
          <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </h1>
        <button onClick={openCreate} className="create-btn" id="create-event-btn">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 1v12M1 7h12" strokeLinecap="round" />
          </svg>
          Create
          <svg className="chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 5l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container" id="scheduling-tabs">
        {[
          { key: 'event-types', label: 'Event types' },
          { key: 'single-use', label: 'Single-use links' },
          { key: 'polls', label: 'Meeting polls' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" id="search-events">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search event types"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User */}
      <div className="user-section" id="user-section">
        <div className="user-section-left">
          <div className="user-avatar">M</div>
          <span className="user-name">MANAN GOEL</span>
        </div>
        <div className="user-section-right">
          <button className="view-landing-page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View landing page
          </button>
          <button className="more-menu-btn" title="More options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Event List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No Event Types"
          message="Create your first event type to start accepting bookings from your contacts."
          action={<button onClick={openCreate} className="create-btn">+ New Event Type</button>}
        />
      ) : (
        <div id="events-list">
          {filteredEvents.map((event, i) => {
            const barColor = EVENT_COLORS[i % EVENT_COLORS.length];
            const durationLabel = event.duration >= 60
              ? `${event.duration / 60} hr`
              : `${event.duration} min`;

            return (
              <div className="event-list-item" key={event.id} id={`event-${event.id}`}>
                <div className="event-color-bar" style={{ background: barColor }} />
                <input type="checkbox" className="event-checkbox" aria-label={`Select ${event.name}`} />
                <div className="event-info">
                  <div className="event-name">{event.name}</div>
                  <div className="event-meta">{durationLabel} • Google Meet • One-on-One</div>
                  <div className="event-schedule">Weekdays, 9 am - 5 pm</div>
                </div>
                <div className="event-actions">
                  <button className="copy-link-btn" onClick={() => handleCopyLink(event)} id={`copy-link-${event.id}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {copiedId === event.id ? 'Copied!' : 'Copy link'}
                  </button>

                  <DropdownMenu
                    items={getMenuItems(event)}
                    isOpen={openMenuId === event.id}
                    onToggle={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                    menuRef={openMenuId === event.id ? menuRef : null}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingEvent ? 'Edit Event Type' : 'New Event Type'}>
        <EventTypeForm
          form={form}
          setForm={setForm}
          schedules={schedules}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          saving={saving}
          isEditing={!!editingEvent}
          onNameChange={handleNameChange}
        />
      </Modal>
    </div>
  );
}
