import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';

export default function SiteFooter() {
  return (
    <footer className="cjir-site-footer">
      <div className="cjir-site-container cjir-footer-grid">
        <div className="cjir-footer-brand">
          <Link className="cjir-footer-logo" to="/"><img src={BRAND.logo} alt={BRAND.name} /></Link>
          <p>Helping drivers navigate motor vehicle accident claims with clear guidance and hands-on document support — no upfront fees.</p>
          <nav className="cjir-footer-socials" aria-label="Social media">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2V10H7.4v3h2.7v8z" /></svg>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.8 2h6.5l4.4 6.8zm-1.1 18h1.7L7.3 3.9H5.5z" /></svg>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="cjir-social-icon-dot" cx="17.5" cy="6.8" r="1" /></svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 8.5H2V21h3.4V8.5zM3.7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM22 13.1c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.8 2V8.5h-3.4V21h3.4v-6.2c0-1.6.3-3.2 2.3-3.2s2 1.9 2 3.3V21h3.4l.8-7.9z" /></svg>
            </a>
          </nav>
        </div>
        <div className="cjir-footer-links"><h2>Explore</h2><Link to="/">Home</Link><Link to="/about-us">About Us</Link><Link to="/faq">FAQ</Link><Link to="/contact-us">Contact Us</Link></div>
        <div className="cjir-footer-links"><h2>Get Started</h2><Link to="/get-a-quote">Get a Quote</Link><Link to="/track">Track Lead ID</Link></div>
        <div className="cjir-footer-contact">
          <h2>Talk to our team</h2>
          <a href="tel:+14348496895">434-849-6895</a>
          <a href="mailto:Info@thecollisionjustice.com">Info@thecollisionjustice.com</a>
          <span>310 Oakley Avenue<br />Lynchburg, VA 24501</span>
        </div>
      </div>
      <div className="cjir-site-container cjir-footer-bottom">
        <span>© {new Date().getFullYear()} The Collision Justice</span>
        <span>{BRAND.disclosure}</span>
        <span className="cjir-footer-attribution">
          Car visual based on <a href="https://sketchfab.com/3d-models/honda-civic-2022-free-download-d5ca29a5d2f341b691118ffb5560b19b" target="_blank" rel="noreferrer">Honda Civic 2022 by Ricy on Sketchfab</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>; paint recolored.
        </span>
      </div>
    </footer>
  );
}
