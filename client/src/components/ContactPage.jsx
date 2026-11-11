import { Link } from 'react-router-dom';
import SiteIcon from './SiteIcon.jsx';

export default function ContactPage() {
  return (
    <main className="cjir-content-page">
      <section className="cjir-page-banner"><div className="cjir-site-container"><span className="cjir-section-kicker">WE&apos;RE HERE TO HELP</span><h1>Contact Us</h1><p>Reach out to our team if you have questions or need help understanding your next step.</p></div></section>
      <section className="cjir-site-container cjir-contact-content">
        <div className="cjir-contact-cards">
          <article>
            <span className="cjir-contact-icon"><SiteIcon name="location" /></span>
            <h2>Our Address</h2>
            <p>310 Oakley Avenue<br />Lynchburg, VA 24501</p>
            <a href="https://maps.google.com/?q=310+Oakley+Avenue+Lynchburg+VA+24501">Get directions <span aria-hidden="true">→</span></a>
          </article>
          <article>
            <span className="cjir-contact-icon"><SiteIcon name="phone" /></span>
            <h2>Phone Number</h2>
            <a href="tel:+14348496895">434-849-6895</a>
          </article>
          <article>
            <span className="cjir-contact-icon"><SiteIcon name="email" /></span>
            <h2>Email Us</h2>
            <a href="mailto:Info@thecollisionjustice.com">Info@thecollisionjustice.com</a>
          </article>
        </div>
        <img className="cjir-contact-image" src="/about-driver.jpg" alt="Driver reviewing information after a vehicle accident" loading="lazy" />
        <div className="cjir-inline-cta"><p>Ready to get started?</p><Link className="cjir-primary-link" to="/get-a-quote">Get a Quote <span aria-hidden="true">→</span></Link></div>
      </section>
    </main>
  );
}
