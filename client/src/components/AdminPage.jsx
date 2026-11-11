import { useEffect, useState } from 'react';
import api from '../api.js';

const STATUSES = ['New', 'In Review', 'Contacted', 'Qualified', 'Closed'];

export default function AdminPage({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadLeads(nextPage = page) {
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.get('/admin/leads', { params: { page: nextPage, search, status } });
      setLeads(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeads(1); }, [search, status]);

  async function openLead(leadId) {
    setMessage('');
    try {
      const { data } = await api.get(`/admin/leads/${encodeURIComponent(leadId)}`);
      setSelected(data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load this lead.');
    }
  }

  async function updateStatus(event) {
    event.preventDefault();
    try {
      await api.patch(`/admin/leads/${encodeURIComponent(selected.lead_id)}`, { status: selected.status });
      setMessage('Lead status updated.');
      await loadLeads();
      await openLead(selected.lead_id);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update lead status.');
    }
  }

  async function downloadCsv() {
    try {
      const response = await api.get('/admin/export', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'collision-justice-leads.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to export leads.');
    }
  }

  async function logout() {
    try {
      await api.post('/logout');
      onLogout();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to sign out.');
    }
  }

  return (
    <main className="cjir-admin-shell">
      <header className="cjir-admin-header">
        <div><span className="cjir-kicker">COLLISION JUSTICE</span><h1>Leads</h1></div>
        <button className="cjir-admin-button" type="button" onClick={logout}>Sign Out</button>
      </header>
      {message && <p className="cjir-admin-message" role="status">{message}</p>}
      <section className="cjir-admin-card">
        <div className="cjir-admin-toolbar">
          <label className="cjir-field"><span>Search Lead ID</span><input value={search} onChange={(event) => setSearch(event.target.value)} maxLength={40} /></label>
          <label className="cjir-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button type="button" className="cjir-admin-button" onClick={downloadCsv}>Export CSV</button>
        </div>
        <div className="cjir-table-scroll">
          <table className="cjir-admin-table">
            <thead><tr><th>Lead ID</th><th>Submitted</th><th>Status</th><th>View</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.lead_id}>
                  <td>{lead.lead_id}</td><td>{lead.submitted_at}</td><td>{lead.status}</td>
                  <td><button className="cjir-text-button" type="button" onClick={() => openLead(lead.lead_id)}>View details</button></td>
                </tr>
              ))}
              {!loading && leads.length === 0 && <tr><td colSpan="4">No leads found.</td></tr>}
              {loading && <tr><td colSpan="4">Loading…</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="cjir-pagination">
          <button className="cjir-admin-button" type="button" disabled={page <= 1 || loading} onClick={() => loadLeads(page - 1)}>Previous</button>
          <span>Page {page} of {lastPage}</span>
          <button className="cjir-admin-button" type="button" disabled={page >= lastPage || loading} onClick={() => loadLeads(page + 1)}>Next</button>
        </div>
      </section>
      {selected && (
        <section className="cjir-admin-card cjir-lead-detail">
          <div className="cjir-detail-heading"><h2>Lead: {selected.lead_id}</h2><button className="cjir-text-button" type="button" onClick={() => setSelected(null)}>Close</button></div>
          <form className="cjir-status-form" onSubmit={updateStatus}>
            <label className="cjir-field"><span>Status</span><select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value })}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button className="cjir-admin-button primary" type="submit">Update Status</button>
          </form>
          <h3>Submitted Information</h3>
          <p><a className="cjir-admin-button primary" href={selected.pdf_url}>Download PDF</a></p>
          <dl className="cjir-detail-grid">
            {Object.entries(selected.data).map(([key, value]) => (
              <div key={key}><dt>{key.replaceAll('_', ' ')}</dt><dd>{String(value ?? '')}</dd></div>
            ))}
            <div><dt>Submission date/time</dt><dd>{selected.submitted_at}</dd></div>
          </dl>
        </section>
      )}
    </main>
  );
}
