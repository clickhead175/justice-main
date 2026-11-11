import { Link } from 'react-router-dom';
import { FAQ_ITEMS } from '../faqContent.js';

export default function FaqPage() {
  return (
    <main className="cjir-content-page">
      <section className="cjir-page-banner"><div className="cjir-site-container"><span className="cjir-section-kicker">FAQ</span><h1>Frequently Asked Questions</h1><p>Answers to the questions we hear most about motor vehicle accident claims. Still unsure? Our team is happy to help.</p></div></section>
      <section className="cjir-site-container cjir-faq-page-content">
        <div className="cjir-faq-list">
          {FAQ_ITEMS.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
        <div className="cjir-inline-cta"><p>Still have questions? We&apos;re here to help.</p><Link className="cjir-primary-link" to="/contact-us">Contact The Collision Justice <span aria-hidden="true">→</span></Link></div>
      </section>
    </main>
  );
}
