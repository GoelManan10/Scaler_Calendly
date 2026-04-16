import { useState, useEffect, useCallback } from 'react';
import { getBookings } from '../services/api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

// Generate avatar color from name
function getAvatarColor(name) {
  const colors = ['#006BFF', '#7B61FF', '#00BCD4', '#FF7043', '#E91E63', '#2D9F3F', '#F5A623'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Derive contacts from bookings (like Calendly auto-creates contacts from meetings)
  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await getBookings();
      const bookings = data.data || [];
      // Deduplicate by email
      const contactMap = new Map();
      bookings.forEach((b) => {
        if (!contactMap.has(b.email)) {
          contactMap.set(b.email, {
            id: b.id,
            name: b.name,
            email: b.email,
            jobTitle: '',
            lastMeeting: b.date,
          });
        }
      });
      setContacts(Array.from(contactMap.values()));
    } catch {
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  if (loading) return <Loader text="Loading contacts..." />;

  return (
    <div className="page-content">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="scheduling-header">
        <h1 className="scheduling-title">Contacts</h1>
        <button className="create-btn" id="add-contact-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 1v12M1 7h12" strokeLinecap="round" />
          </svg>
          Add contact
        </button>
      </div>

      {/* Main Content — split layout */}
      <div className="contacts-layout">
        {/* Left: Info section */}
        <div className="contacts-info">
          <h2 className="contacts-info-title">Stay organized as you build relationships</h2>
          <p className="contacts-info-desc">
            Contacts are automatically created and updated when a Calendly meeting is booked.
            View meeting history, access key details, and schedule your next conversation — all in
            one place.
          </p>
          <a href="#" className="contacts-learn-more">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn more
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h4M5.5 3l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="contacts-actions">
            <button className="contacts-add-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 1v12M1 7h12" strokeLinecap="round" />
              </svg>
              Add contact
            </button>
            <button className="contacts-book-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book your first meeting
            </button>
          </div>
        </div>

        {/* Right: Contacts table */}
        <div className="contacts-table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Job title</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <>
                  {/* Show sample placeholder data like Calendly does */}
                  {[
                    { name: 'Daniel Jones', email: 'daniel@magnolia.com' },
                    { name: 'Kathryn Irving', email: 'kathryn@magnolia.com' },
                    { name: 'Miguel Padilla', email: 'miguel@wooly.com' },
                    { name: 'Michael Mendez', email: 'michael@wooly.com' },
                  ].map((c, i) => (
                    <tr key={i} className="contacts-sample-row">
                      <td>
                        <div className="contacts-name-cell">
                          <div
                            className="contacts-avatar"
                            style={{ background: getAvatarColor(c.name) }}
                          >
                            {c.name.charAt(0)}
                          </div>
                          {c.name}
                        </div>
                      </td>
                      <td>{c.email}</td>
                      <td className="contacts-job-cell">—</td>
                    </tr>
                  ))}
                </>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="contacts-name-cell">
                        <div
                          className="contacts-avatar"
                          style={{ background: getAvatarColor(c.name) }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td className="contacts-job-cell">{c.jobTitle || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
