import { Link } from 'react-router-dom';

const values = [
  ['Clear Information', 'We make accident-related topics easier to understand so you can explore your next steps with confidence.'],
  ['People First', 'We recognize that every accident involves real people, real concerns, and circumstances that deserve attention.'],
  ['Helpful Resources', 'We aim to connect visitors with useful information and resources relevant to their situation.'],
  ['Practical Guidance', 'We focus on explaining common processes and helping visitors identify questions they may need to ask.'],
  ['Respectful Support', 'Every person deserves to be treated with understanding, professionalism, and respect.'],
  ['Moving Forward', 'Our focus is helping people feel better informed as they take their next steps after an accident.'],
];

export default function AboutPage() {
  return (
    <main className="cjir-content-page">
      <section className="cjir-page-banner"><div className="cjir-site-container"><span className="cjir-section-kicker">ABOUT THE COLLISION JUSTICE</span><h1>Helping You Move Forward After an Accident</h1><p>After a vehicle accident, knowing what to do next can feel overwhelming. We aim to make the process easier by helping drivers understand their options and find the information and support they need.</p></div></section>
      <section className="cjir-site-container cjir-about-intro">
        <img src="/about-driver.jpg" alt="Driver reviewing accident recovery information" loading="lazy" />
        <div><span className="cjir-section-kicker">WHO WE ARE</span><h2>Guidance When You Need It Most</h2><p>A motor vehicle accident can disrupt everyday life. From dealing with vehicle damage to understanding insurance-related processes, the next steps are not always clear.</p><p>The Collision Justice is focused on making helpful information easier to understand and access. Our goal is to help people feel more informed as they navigate the road ahead.</p><p>We believe every driver deserves clear information, respectful support, and the opportunity to make informed decisions.</p><Link className="cjir-primary-link" to="/contact-us">Get In Touch <span aria-hidden="true">→</span></Link></div>
      </section>
      <section className="cjir-about-purpose">
        <div className="cjir-site-container">
          <header className="cjir-section-heading"><span className="cjir-section-kicker">OUR PURPOSE</span><h2>What Drives The Collision Justice</h2><p>Our work is guided by a commitment to clarity, helpful resources, and a better experience for people dealing with the aftermath of a vehicle accident.</p></header>
          <div className="cjir-purpose-grid"><article><span aria-hidden="true">◎</span><h3>Our Mission</h3><p>To make accident-related information easier to understand and help drivers identify useful resources and possible next steps after a collision.</p></article><article><span aria-hidden="true">◇</span><h3>Our Vision</h3><p>A world where people affected by vehicle accidents can access clear information, understand their options, and move forward with greater confidence.</p></article></div>
        </div>
      </section>
      <section className="cjir-site-container cjir-about-values">
        <header className="cjir-section-heading"><span className="cjir-section-kicker">WHY THE COLLISION JUSTICE</span><h2>A Clearer Path After a Collision</h2><p>We focus on making the experience more approachable through useful information and a people-first approach.</p></header>
        <div className="cjir-value-grid">{values.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="cjir-about-approach">
        <div className="cjir-site-container cjir-approach-grid">
          <div><span className="cjir-section-kicker">OUR APPROACH</span><h2>Making the Next Steps Easier to Understand</h2><p>No two accidents are exactly alike. The circumstances, questions, and concerns can vary from one driver to another. That is why accessible information matters.</p><p>We want visitors to have a useful starting point when learning about accident-related matters and considering what steps may be appropriate for their circumstances.</p><ul><li>Easy-to-understand information</li><li>Resources for accident-related questions</li><li>A respectful, people-focused approach</li><li>Information to help you consider next steps</li></ul><Link className="cjir-primary-link" to="/contact-us">Talk To Our Team <span aria-hidden="true">→</span></Link></div>
          <img src="/about-reviewing-claim.png" alt="Person reviewing information after a vehicle accident" loading="lazy" />
        </div>
      </section>
      <section className="cjir-about-cta"><div className="cjir-site-container"><span className="cjir-section-kicker">WE&apos;RE HERE TO HELP</span><h2>Don&apos;t Let an Accident Leave You Without Direction</h2><p>Explore helpful resources and get in touch if you have questions. Take your next step with clearer information.</p><Link className="cjir-primary-link" to="/contact-us">Contact The Collision Justice <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}
