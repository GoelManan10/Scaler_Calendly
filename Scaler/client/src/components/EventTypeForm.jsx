import { DURATION_OPTIONS, BUFFER_OPTIONS } from '../constants';

/**
 * Reusable form for creating/editing an event type.
 * Used inside a Modal in EventsPage.
 *
 * @param {{ form, setForm, schedules, onSubmit, onCancel, saving, isEditing, onNameChange }} props
 */
export default function EventTypeForm({
  form,
  setForm,
  schedules,
  onSubmit,
  onCancel,
  saving,
  isEditing,
  onNameChange,
}) {
  return (
    <form onSubmit={onSubmit} className="modal-form">
      {/* Event Name */}
      <div className="form-group">
        <label className="form-label">Event name</label>
        <input
          type="text"
          value={form.name}
          onChange={onNameChange}
          placeholder="e.g. 30 Minute Meeting"
          required
          className="form-input"
        />
      </div>

      {/* Duration */}
      <div className="form-group">
        <label className="form-label">Duration</label>
        <div className="duration-picker">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm((f) => ({ ...f, duration: d }))}
              className={`duration-option ${form.duration === d ? 'active' : ''}`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* URL Slug */}
      <div className="form-group">
        <label className="form-label">URL slug</label>
        <div className="slug-input-wrapper">
          <span className="slug-prefix">calendly.com/</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
            className="slug-input"
          />
        </div>
      </div>

      {/* Buffer Time */}
      <div className="form-group">
        <label className="form-label">Buffer time</label>
        <div className="form-group-row">
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              Before (min)
            </label>
            <select
              value={form.bufferBefore}
              onChange={(e) => setForm((f) => ({ ...f, bufferBefore: parseInt(e.target.value) }))}
              className="form-input"
            >
              {BUFFER_OPTIONS.map((v) => (
                <option key={v} value={v}>{v} min</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              After (min)
            </label>
            <select
              value={form.bufferAfter}
              onChange={(e) => setForm((f) => ({ ...f, bufferAfter: parseInt(e.target.value) }))}
              className="form-input"
            >
              {BUFFER_OPTIONS.map((v) => (
                <option key={v} value={v}>{v} min</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Selection */}
      <div className="form-group">
        <label className="form-label">Schedule</label>
        <select
          value={form.scheduleId}
          onChange={(e) => setForm((f) => ({ ...f, scheduleId: parseInt(e.target.value) }))}
          className="form-input"
        >
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({s.timezone})</option>
          ))}
        </select>
      </div>

      {/* Custom Questions */}
      <div className="form-group">
        <label className="form-label">Invitee questions</label>
        {form.questions.map((q, idx) => (
          <div key={idx} className="question-row">
            <input
              type="text"
              value={q}
              onChange={(e) => {
                const updated = [...form.questions];
                updated[idx] = e.target.value;
                setForm((f) => ({ ...f, questions: updated }));
              }}
              placeholder="e.g. What is your company name?"
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }))}
              className="question-remove-btn"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, questions: [...f.questions, ''] }))}
          className="question-add-btn"
        >
          + Add question
        </button>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="form-btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="form-btn-primary">
          {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
