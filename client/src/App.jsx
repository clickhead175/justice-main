import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import api from './api.js';
import AdminPage from './components/AdminPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import BackToTopButton from './components/BackToTopButton.jsx';
import ContactPage from './components/ContactPage.jsx';
import FaqPage from './components/FaqPage.jsx';
import HomePage from './components/HomePage.jsx';
import IntakeForm from './components/IntakeForm.jsx';
import LoginPage from './components/LoginPage.jsx';
import MotionEffects from './components/MotionEffects.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import TrackingPage from './components/TrackingPage.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!isAdminRoute);

  useEffect(() => {
    if (!isAdminRoute) {
      setAuthReady(true);
      return;
    }

    setAuthReady(false);
    api.get('/csrf').then(() => api.get('/me'))
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthReady(true));
  }, [isAdminRoute]);

  if (!authReady) return <main className="cjir-loading" aria-live="polite">Loading…</main>;

  return (
    <>
      <MotionEffects pathname={pathname} enabled={!isAdminRoute} />
      {!isAdminRoute && <SiteHeader />}
      {!isAdminRoute && <BackToTopButton />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="/get-a-quote" element={<IntakeForm />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/admin/login" element={user ? <Navigate to="/admin" replace /> : <LoginPage onLogin={setUser} />} />
        <Route path="/admin/*" element={user ? <AdminPage onLogout={() => setUser(null)} /> : <Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminRoute && <SiteFooter />}
    </>
  );
}
