import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BRAND } from '../brand.js';
import { FAQ_ITEMS } from '../faqContent.js';
import SiteIcon from './SiteIcon.jsx';
import ThreeCar from './ThreeCar.jsx';

const services = [
  ['Accident Guidance', 'Step-by-step direction right after a collision so you know what to do next.', 'accident'],
  ['Hassle Free Process', 'One simple intake and help with paperwork and follow-ups, so you can focus on recovering.', 'process'],
  ['Document Support', 'Guidance gathering police reports, medical records, and evidence for your claim file.', 'document'],
  ['Fast Claim Handling', 'Your details are reviewed and routed quickly to keep your claim moving.', 'fast'],
];

function ServiceCard({ service, index }) {
  const [title, description, icon] = service;

  return (
    <article className={`cjir-service-card cjir-service-card--${index + 1}`}>
      <span className="cjir-card-corners" aria-hidden="true" />
      <span className="cjir-card-surface" aria-hidden="true" />
      <div className="cjir-card-content">
        <div className="cjir-service-card-head">
          <span className="cjir-service-number">0{index + 1}</span>
          <span className="cjir-service-icon"><SiteIcon name={icon} /></span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to="/get-a-quote" aria-label={`Start an intake for ${title}`}>Learn More <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

const testimonials = [
  ['DB', 'Danielle Brooks', 'Phoenix, AZ', 'After my rear-end accident I had no idea where to start. The Collision Justice walked me through every form and my claim was filed within days.'],
  ['AC', 'Anthony Caruso', 'Tampa, FL', 'Straightforward and no pressure. I submitted my zip code, got a call back the same day, and never paid anything upfront.'],
  ['PN', 'Priya Nair', 'Columbus, OH', 'I was overwhelmed after the crash, but their team made the whole process feel manageable. Genuinely helpful people.'],
];

export default function HomePage() {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [zipError, setZipError] = useState('');

  function startIntake(event) {
    event.preventDefault();
    if (!/^\d{5}(?:-\d{4})?$/.test(zip.trim())) {
      setZipError('Enter a valid ZIP code to get started.');
      return;
    }
    navigate(`/get-a-quote?zip=${encodeURIComponent(zip.trim())}`);
  }

  return (
    <main className="cjir-homepage">
      <section className="cjir-hero">
        <img className="cjir-hero-image" src="/home-crashed-car.png" alt="An orange car damaged in a collision" />
        <div className="cjir-hero-shade" />
        <div className="cjir-site-container cjir-hero-content">
          <div className="cjir-hero-copy">
            <span className="cjir-eyebrow">HERE FOR THE ROAD AHEAD</span>
            <h1>Crashed? Don&apos;t stress we&apos;ve got your claim.</h1>
            <p>From fender-benders to serious collisions, the Collision Justice makes the whole claims process simple. Clear steps, real human support, and zero upfront fees. Just drop your zip code to get started.</p>
            <form className="cjir-zip-form" onSubmit={startIntake} noValidate>
              <label className="cjir-visually-hidden" htmlFor="home-zip">ZIP code</label>
              <input
                id="home-zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={10}
                placeholder="Enter your ZIP code"
                value={zip}
                onChange={(event) => {
                  setZip(event.target.value);
                  setZipError('');
                }}
              />
              <button type="submit">Get Started <span aria-hidden="true">→</span></button>
            </form>
            {zipError && <p className="cjir-zip-error" role="alert">{zipError}</p>}
            <p className="cjir-hero-note">No upfront fees. No pressure.</p>
          </div>
        </div>
      </section>

      <section className="cjir-home-story cjir-site-container">
        <div className="cjir-story-image">
          <img src="/about-driver.jpg" alt="Driver reviewing accident recovery information" loading="lazy" />
          <span className="cjir-image-accent" aria-hidden="true" />
        </div>
        <div className="cjir-story-copy">
          <span className="cjir-section-kicker">WHY THE COLLISION JUSTICE</span>
          <h2>We&apos;re here after the crash</h2>
          <p>A motor vehicle accident can leave you shaken and unsure of what comes next. Between insurance calls, medical visits, and paperwork, it&apos;s easy to feel overwhelmed.</p>
          <p>Damage Path takes that weight off your shoulders. Our team guides you step by step, helps gather the right documents, and keeps your claim moving — with no upfront fees and no pressure.</p>
          <Link className="cjir-primary-link" to="/about-us">Learn more about us <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="cjir-home-services">
        <div className="cjir-site-container">
          <header className="cjir-section-heading cjir-services-heading">
            <span className="cjir-section-kicker">WHAT WE DO</span>
            <h2>Comprehensive Claim Support</h2>
            <p>From the moment of impact to your final claim, we cover every step so nothing falls through the cracks.</p>
            <span className="cjir-heading-rule" aria-hidden="true" />
          </header>
          <div className="cjir-service-grid">
            {services.slice(0, 2).map((service, index) => (
              <ServiceCard key={service[0]} service={service} index={index} />
            ))}
            <figure className="cjir-service-car-art">
              <span className="cjir-service-car-glow" aria-hidden="true" />
              <span className="cjir-service-car-orbit cjir-service-car-orbit--outer" aria-hidden="true" />
              <span className="cjir-service-car-orbit cjir-service-car-orbit--inner" aria-hidden="true" />
              <ThreeCar />
              <figcaption className="cjir-service-car-caption">A clearer road ahead</figcaption>
            </figure>
            {services.slice(2).map((service, index) => (
              <ServiceCard key={service[0]} service={service} index={index + 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="cjir-home-why cjir-site-container">
        <header className="cjir-section-heading cjir-why-heading">
          <span className="cjir-section-kicker">WHY CHOOSE US</span>
          <h2>Why drivers choose The Collision Justice</h2>
          <span className="cjir-heading-rule" aria-hidden="true" />
        </header>
        <div className="cjir-benefit-grid">
          <article><span className="cjir-card-corners" aria-hidden="true" /><span className="cjir-card-surface" aria-hidden="true" /><div className="cjir-card-content"><span><SiteIcon name="fees" /></span><h3>Zero upfront fees</h3><p>You pay nothing to get started. No hidden costs, no surprises ever.</p></div></article>
          <article><span className="cjir-card-corners" aria-hidden="true" /><span className="cjir-card-surface" aria-hidden="true" /><div className="cjir-card-content"><span><SiteIcon name="support" /></span><h3>Real human support</h3><p>Talk to actual people who listen and guide you, not bots or endless menus.</p></div></article>
          <article><span className="cjir-card-corners" aria-hidden="true" /><span className="cjir-card-surface" aria-hidden="true" /><div className="cjir-card-content"><span><SiteIcon name="check" /></span><h3>Fast &amp; hassle free</h3><p>One quick form and help with the paperwork and follow-ups.</p></div></article>
          <article><span className="cjir-card-corners" aria-hidden="true" /><span className="cjir-card-surface" aria-hidden="true" /><div className="cjir-card-content"><span><SiteIcon name="trusted" /></span><h3>Trusted nationwide</h3><p>Drivers across the country have counted on us after a crash.</p></div></article>
        </div>
      </section>

      <section className="cjir-home-testimonials">
      <div className="cjir-site-container">
        <header className="cjir-section-heading cjir-testimonials-heading">
          <span className="cjir-section-kicker">TESTIMONIALS</span>
          <h2>What Drivers Say</h2>
          <p>Real feedback from people we&apos;ve helped after a motor vehicle accident — from first call to filed claim.</p>
          <span className="cjir-heading-rule" aria-hidden="true" />
        </header>
        <div className="cjir-testimonial-rating">
          <strong>4.8</strong>
          <span className="cjir-rating-copy">
            <span className="cjir-rating-stars" role="img" aria-label="Rated 4.8 out of 5">★★★★★</span>
            <span>out of 5 · Based on <b>45,000+</b> assisted drivers</span>
          </span>
        </div>
        <div className="cjir-testimonial-grid">
          {testimonials.map(([initials, name, location, quote]) => (
            <figure className="cjir-testimonial-card" key={name}>
              <span className="cjir-card-corners" aria-hidden="true" />
              <span className="cjir-card-surface" aria-hidden="true" />
              <div className="cjir-card-content">
                <span className="cjir-testimonial-quote-mark" aria-hidden="true">“</span>
                <blockquote>{quote}</blockquote>
                <figcaption>
                  <span className="cjir-testimonial-avatar">{initials}</span>
                  <div><strong>{name}</strong><small>{location}</small></div>
                  <span className="cjir-testimonial-check" aria-label="Verified customer">✓</span>
                </figcaption>
              </div>
            </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="cjir-home-faq">
        <div className="cjir-site-container cjir-home-faq-inner">
          <div className="cjir-home-faq-intro">
            <header className="cjir-section-heading">
              <span className="cjir-section-kicker">FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <p>Answers to the questions we hear most about motor vehicle accident claims.</p>
            </header>
            <div className="cjir-home-faq-help">
              <span className="cjir-home-faq-help-icon"><SiteIcon name="support" /></span>
              <div><strong>Still have questions?</strong><span>Our team is here to help.</span></div>
              <a href="tel:+14348496895" aria-label="Call us at 434-849-6895"><SiteIcon name="phone" /></a>
            </div>
          </div>
          <div className="cjir-home-faq-content">
            <div className="cjir-faq-list">
              {FAQ_ITEMS.slice(0, 4).map(([question, answer]) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
            <Link className="cjir-primary-link" to="/faq">View all FAQs <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="cjir-home-location">
        <div className="cjir-site-container cjir-location-grid">
          <div className="cjir-location-copy">
            <span className="cjir-section-kicker">VISIT OUR OFFICE</span>
            <h2>Find The Collision Justice</h2>
            <p>310 Oakley Avenue<br />Lynchburg, VA 24501</p>
            <a className="cjir-primary-link" href="https://www.google.com/maps/search/?api=1&query=310+Oakley+Avenue+Lynchburg+VA+24501" target="_blank" rel="noreferrer">
              Get Directions <span aria-hidden="true">→</span>
            </a>
          </div>
          <iframe
            className="cjir-location-map"
            title="Map to The Collision Justice at 310 Oakley Avenue, Lynchburg, Virginia"
            src="https://www.google.com/maps?q=310+Oakley+Avenue+Lynchburg+VA+24501&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <section className="cjir-home-cta">
        <div className="cjir-site-container">
          <div className="cjir-home-cta-inner">
            <div className="cjir-home-cta-copy">
              <span className="cjir-section-kicker">SPEAK TO OUR TEAM</span>
              <h2>Prefer to talk? Give us a call.</h2>
              <p>Speak directly with a member of our team. We&apos;ll listen, answer your questions, and explain your next steps — no upfront fees and no pressure.</p>
            </div>
            <aside className="cjir-call-card" aria-label="Call our team">
              <span className="cjir-call-card-icon"><SiteIcon name="phone" /></span>
              <div className="cjir-call-card-details">
                <span className="cjir-call-card-label">Call us now</span>
                <a className="cjir-call-card-number" href="tel:+14348496895">434-849-6895</a>
                <span className="cjir-call-card-hours">Mon–Fri, 9 AM–6 PM</span>
              </div>
              <a className="cjir-cta-phone" href="tel:+14348496895"><SiteIcon className="cjir-cta-phone-icon" name="phone" />Call now</a>
            </aside>
          </div>
        </div>
      </section>
      <p className="cjir-disclosure cjir-home-disclosure">{BRAND.disclosure}</p>
    </main>
  );
}
