import { useState } from 'react';
import api from '../api.js';
import Brand from './Brand.jsx';

export default function LoginPage({ onLogin }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const { data } = await api.post('/login', {
        email: form.get('email'),
        password: form.get('password'),
      });
      onLogin(data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to sign in. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cjir-wrap cjir-admin-wrap">
      <section className="cjir-card">
        <Brand />
        <header className="cjir-heading">
          <span className="cjir-kicker">ADMINISTRATION</span>
          <h1>Sign In</h1>
        </header>
        <form className="cjir-admin-login" onSubmit={login}>
          <label className="cjir-field"><span>Email Address</span><input name="email" type="email" autoComplete="username" required maxLength={190} /></label>
          <label className="cjir-field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
          {message && <div className="cjir-form-message" role="alert">{message}</div>}
          <button className="cjir-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </section>
    </main>
  );
}
