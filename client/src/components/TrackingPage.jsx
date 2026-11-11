import { useState } from 'react';
import api from '../api.js';
import { BRAND } from '../brand.js';

export default function TrackingPage() {
  const [leadId, setLeadId] = useState(new URLSearchParams(window.location.search).get('lead_id') || '');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(event) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setMessage('');
    try {
      const { data } = await api.post('/track', { lead_id: leadId.trim() });
      setResult(data);
    } catch (error) {
      setMessage(error.response?.status === 404
        ? 'No request was found for that Lead ID. Check the ID and try again.'
        : error.response?.data?.message || 'We could not check this request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cjir-wrap cjir-track-wrap">
      <section className="cjir-card">
        <header className="cjir-heading">
          <span className="cjir-kicker">REQUEST TRACKING</span>
          <h1>Check Your Request</h1>
          <p>Enter the Lead ID provided after submission.</p>
        </header>
        <form className="cjir-track-form" onSubmit={lookup}>
          <label className="cjir-field">
            <span>Lead ID</span>
            <input value={leadId} onChange={(event) => setLeadId(event.target.value)} placeholder="TCJ-YYYYMMDD-XXXXXXXXXXXXXXXXXXXX" required />
          </label>
          <button className="cjir-submit" type="submit" disabled={loading}>{loading ? 'Checking…' : 'Check My Request'}</button>
        </form>
        {message && <div className="cjir-track-result cjir-error-box" role="alert">{message}</div>}
        {result && (
          <div className="cjir-track-result">
            <h2>Request Found</h2>
            <p><strong>Lead ID:</strong> {result.lead_id}</p>
            <p><strong>Submission date:</strong> {result.submitted_at}</p>
            <p><strong>Request status:</strong> <span className="cjir-status">{result.status}</span></p>
          </div>
        )}
        <p className="cjir-disclosure">{BRAND.disclosure}</p>
      </section>
    </main>
  );
}
