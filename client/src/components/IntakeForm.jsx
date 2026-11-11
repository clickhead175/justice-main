import { useState } from 'react';
import api from '../api.js';
import { BRAND, STATES, TIMEFRAMES } from '../brand.js';

const requiredQuestions = [
  ['at_fault', 'Were you at fault?'],
  ['has_attorney', 'Do you currently have an attorney?'],
  ['insured', 'Was either party insured?'],
  ['injuries', 'Did you suffer physical injuries?'],
];

function Field({ name, label, type = 'text', placeholder, children, max, error, defaultValue }) {
  return (
    <label className={`cjir-field${error ? ' cjir-invalid' : ''}`}>
      <span>{label} <b>*</b></span>
      {children || (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={max}
          defaultValue={defaultValue}
          max={type === 'date' ? new Date().toISOString().slice(0, 10) : undefined}
          required
        />
      )}
      <small className="cjir-error">{error || ''}</small>
    </label>
  );
}

function validate(values) {
  const errors = {};
  const required = [
    'first_name', 'last_name', 'dob', 'email', 'phone', 'street', 'city',
    'state', 'zip', 'timeframe', 'accident_year', 'accident_month', 'accident_day',
  ];
  required.forEach((key) => {
    if (!String(values[key] || '').trim()) errors[key] = 'This field is required.';
  });
  requiredQuestions.forEach(([key]) => {
    if (!values[key]) errors[key] = 'Please select Yes or No.';
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) errors.email = 'Enter a valid email address.';
  const digits = (values.phone || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) errors.phone = 'Enter a valid phone number.';
  if (!/^\d{5}(-\d{4})?$/.test(values.zip || '')) errors.zip = 'Use 12345 or 12345-6789.';
  if (values.dob && values.dob > new Date().toISOString().slice(0, 10)) errors.dob = 'Date of birth cannot be in the future.';
  const year = Number(values.accident_year);
  const month = Number(values.accident_month);
  const day = Number(values.accident_day);
  if (year && month && day && new Date(year, month - 1, day).getDate() !== day) {
    errors.accident_day = 'Enter a valid accident date.';
  }
  if (!values.consent) errors.consent = 'Consent is required.';
  return errors;
}

export default function IntakeForm() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const zipFromHome = new URLSearchParams(window.location.search).get('zip') || '';

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length) {
      setMessage('Please review the highlighted fields and try again.');
      form.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await api.get('/csrf');
      const { data } = await api.post('/intakes', values);
      setReceipt(data);
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) {
        setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]])));
      }
      setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  }

  if (receipt) {
    return (
      <main className="cjir-wrap">
        <section className="cjir-card cjir-success">
          <span className="cjir-kicker">SUBMISSION RECEIVED</span>
          <h2>Thank You!</h2>
          {receipt.notification_sent ? (
            <p>Your intake was submitted and sent to our team.</p>
          ) : (
            <p role="status">Your intake was saved, but we could not email our team. Please call <a href="tel:+14348496895">434-849-6895</a> and provide your Lead ID.</p>
          )}
          <div className="cjir-lead-code">{receipt.lead_id}</div>
          <div className="cjir-actions">
            <button type="button" onClick={() => navigator.clipboard?.writeText(receipt.lead_id)}>Copy Lead ID</button>
            <a href={receipt.pdf_url} target="_blank" rel="noreferrer">Download PDF</a>
            <a className="secondary" href={`/track?lead_id=${encodeURIComponent(receipt.lead_id)}`}>Check My Request</a>
            <a className="secondary" href="/">Back to Home</a>
          </div>
          <p className="cjir-disclosure">{BRAND.disclosure}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="cjir-wrap">
      <section className="cjir-card">
        <header className="cjir-heading">
          <span className="cjir-kicker">SECURE INTAKE</span>
          <h1>Tell Us About Your Accident</h1>
          <p>Complete the form below so your inquiry can be reviewed.</p>
        </header>
        <form className="cjir-form" onSubmit={submit} noValidate>
          <div className="cjir-honeypot" aria-hidden="true">
            <label>Leave this field empty<input name="company_website" tabIndex="-1" autoComplete="off" /></label>
          </div>
          <section className="cjir-section">
            <h2>Contact Information</h2>
            <div className="cjir-grid">
              <Field name="first_name" label="First Name" max={100} error={errors.first_name} />
              <Field name="last_name" label="Last Name" max={100} error={errors.last_name} />
              <Field name="dob" label="Date of Birth" type="date" error={errors.dob} />
              <Field name="email" label="Email Address" type="email" max={190} error={errors.email} />
              <Field name="phone" label="Phone Number" type="tel" max={40} error={errors.phone} />
              <Field name="street" label="Street Address" max={255} error={errors.street} />
              <Field name="city" label="City" max={120} error={errors.city} />
              <Field name="state" label="State" error={errors.state}>
                <select name="state" required defaultValue="">
                  <option value="">Select state</option>
                  {STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </Field>
              <Field name="zip" label="ZIP Code" placeholder="12345 or 12345-6789" max={10} error={errors.zip} defaultValue={zipFromHome} />
            </div>
          </section>
          <section className="cjir-section">
            <h2>Accident Questions</h2>
            <div className="cjir-grid">
              {requiredQuestions.map(([name, label]) => (
                <fieldset className="cjir-field cjir-choice" key={name}>
                  <legend>{label} <b>*</b></legend>
                  <div>
                    {['Yes', 'No'].map((answer) => (
                      <label key={answer}><input type="radio" name={name} value={answer} /> {answer}</label>
                    ))}
                  </div>
                  <small className="cjir-error">{errors[name] || ''}</small>
                </fieldset>
              ))}
              <fieldset className="cjir-field cjir-choice">
                <legend>Have you received medical care?</legend>
                <div>
                  {['Yes', 'No'].map((answer) => (
                    <label key={answer}><input type="radio" name="medical_care" value={answer} /> {answer}</label>
                  ))}
                </div>
              </fieldset>
              <Field name="timeframe" label="Accident timeframe" error={errors.timeframe}>
                <select name="timeframe" required defaultValue="">
                  <option value="">Select timeframe</option>
                  {TIMEFRAMES.map((timeframe) => <option key={timeframe}>{timeframe}</option>)}
                </select>
              </Field>
            </div>
          </section>
          <section className="cjir-section">
            <h2>Accident Date</h2>
            <div className="cjir-grid cjir-date-grid">
              <Field name="accident_year" label="Year" error={errors.accident_year}>
                <select name="accident_year" required defaultValue="">
                  <option value="">Year</option>
                  {Array.from({ length: 8 }, (_, index) => 2026 - index).map((year) => <option key={year}>{year}</option>)}
                </select>
              </Field>
              <Field name="accident_month" label="Month" error={errors.accident_month}>
                <select name="accident_month" required defaultValue="">
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month}>{new Date(2026, month - 1).toLocaleString('en-US', { month: 'long' })}</option>
                  ))}
                </select>
              </Field>
              <Field name="accident_day" label="Day" error={errors.accident_day}>
                <select name="accident_day" required defaultValue="">
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => <option key={day}>{day}</option>)}
                </select>
              </Field>
            </div>
            <p className="cjir-note">We can verify the precise date later.</p>
          </section>
          <div className={`cjir-consent${errors.consent ? ' cjir-invalid' : ''}`}>
            <label><input type="checkbox" name="consent" value="1" /><span>{BRAND.consent}</span></label>
            <small className="cjir-error">{errors.consent || ''}</small>
          </div>
          <p className="cjir-disclosure">{BRAND.disclosure}</p>
          <div className="cjir-form-message" role="alert" aria-live="polite">
            {message}
          </div>
          <button className="cjir-submit" type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : <>Submit Intake <span aria-hidden="true">→</span></>}
          </button>
        </form>
      </section>
    </main>
  );
}
