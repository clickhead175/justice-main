import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '../brand.js';
import SiteIcon from './SiteIcon.jsx';

const links = [
  ['Home', '/'],
  ['About', '/about-us'],
  ['FAQ', '/faq'],
  ['Contact Us', '/contact-us'],
  ['Get a Quote', '/get-a-quote'],
  ['Track Lead ID', '/track'],
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  return (
    <header
      className="cjir-site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="cjir-topbar">
        <div className="cjir-site-container cjir-topbar-inner">
          <a href="https://maps.google.com/?q=310+Oakley+Avenue+Lynchburg+VA+24501"><SiteIcon className="cjir-topbar-icon" name="location" />310 Oakley Avenue Lynchburg, VA 24501</a>
          <div>
            <a href="mailto:Info@thecollisionjustice.com"><SiteIcon className="cjir-topbar-icon" name="email" />Info@thecollisionjustice.com</a>
            <a href="tel:+14348496895"><SiteIcon className="cjir-topbar-icon" name="phone" />434-849-6895</a>
          </div>
          <nav className="cjir-topbar-socials" aria-label="Social media">
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
      </div>
      <div className="cjir-main-header">
        <div className="cjir-site-container cjir-main-header-inner">
          <Link className="cjir-main-logo" to="/" aria-label={`${BRAND.name} home`}>
            <img src={BRAND.logo} alt={BRAND.name} />
          </Link>
          <button
            ref={menuButtonRef}
            className="cjir-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="cjir-main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav id="cjir-main-nav" className={`cjir-main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {links.map(([label, path]) => (
              <NavLink key={path} to={path} end={path === '/'} onClick={() => setMenuOpen(false)}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
