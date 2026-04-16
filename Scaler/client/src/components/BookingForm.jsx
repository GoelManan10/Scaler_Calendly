import { useState } from 'react';

export default function BookingForm({ onSubmit, loading, onBack, questions = [] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState(questions.map(() => ''));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';

    // Validate required custom questions
    questions.forEach((q, i) => {
      if (q && !answers[i]?.trim()) {
        errs[`q${i}`] = 'This field is required';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const customAnswers = questions.map((q, i) => ({
        question: q,
        answer: answers[i]?.trim() || '',
      }));
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        answers: customAnswers.length > 0 ? customAnswers : undefined,
      });
    }
  };

  const updateAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up">
      <h2 className="text-xl font-bold text-text-primary mb-6">Enter Details</h2>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-danger focus:ring-danger/20'
                : 'border-border focus:ring-primary-ring focus:border-primary'
            }`}
          />
          {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-danger focus:ring-danger/20'
                : 'border-border focus:ring-primary-ring focus:border-primary'
            }`}
          />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
        </div>

        {/* Custom Questions */}
        {questions.map((question, idx) => (
          <div key={idx}>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              {question} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={answers[idx] || ''}
              onChange={(e) => updateAnswer(idx, e.target.value)}
              placeholder="Your answer"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors[`q${idx}`]
                  ? 'border-danger focus:ring-danger/20'
                  : 'border-border focus:ring-primary-ring focus:border-primary'
              }`}
            />
            {errors[`q${idx}`] && <p className="mt-1.5 text-xs text-danger">{errors[`q${idx}`]}</p>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Scheduling...
            </span>
          ) : (
            'Schedule Event'
          )}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
}
