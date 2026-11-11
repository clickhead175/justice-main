import { useEffect, useRef } from 'react';

const revealTargets = [
  '.cjir-home-story',
  '.cjir-home-services',
  '.cjir-home-why',
  '.cjir-home-testimonials',
  '.cjir-home-faq',
  '.cjir-home-location',
  '.cjir-home-cta',
  '.cjir-about-intro',
  '.cjir-about-purpose',
  '.cjir-about-values',
  '.cjir-about-approach',
  '.cjir-about-cta',
  '.cjir-page-banner',
  '.cjir-contact-cards',
  '.cjir-contact-image',
  '.cjir-faq-page-content > .cjir-faq-list',
  '.cjir-purpose-grid > article',
  '.cjir-value-grid > article',
  '.cjir-contact-cards > article',
];

export default function MotionEffects({ pathname, enabled }) {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
    let observer;
    let activeMagnet = null;
    let activeTilt = null;
    let hero = null;
    let cleanups = [];
    const cursor = cursorRef.current;

    function revealPage() {
      observer?.disconnect();
      document.querySelectorAll('.cjir-reveal').forEach((element) => {
        element.classList.remove('cjir-reveal', 'cjir-is-visible');
      });

      if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('cjir-is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

      const selector = revealTargets.join(',');
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add('cjir-reveal');
        observer.observe(element);
      });
    }

    function resetMagnet() {
      if (!activeMagnet) return;
      activeMagnet.style.setProperty('--magnet-x', '0px');
      activeMagnet.style.setProperty('--magnet-y', '0px');
      activeMagnet = null;
    }

    function resetTilt() {
      if (!activeTilt) return;
      activeTilt.style.setProperty('--tilt-x', '0deg');
      activeTilt.style.setProperty('--tilt-y', '0deg');
      activeTilt.style.setProperty('--pointer-x', '50%');
      activeTilt.style.setProperty('--pointer-y', '50%');
      activeTilt = null;
    }

    function handlePointerMove(event) {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (cursor.dataset.visible !== 'true') {
        cursor.dataset.visible = 'true';
      }

      const interactive = event.target instanceof Element
        ? event.target.closest('a, button, input, select, summary, [role="button"]')
        : null;
      cursor.dataset.hovering = interactive ? 'true' : 'false';

      if (interactive) {
        if (activeMagnet !== interactive) resetMagnet();
        activeMagnet = interactive;
        const bounds = interactive.getBoundingClientRect();
        const strength = interactive.matches('a, button') ? 0.12 : 0.045;
        const magnetX = Math.max(-7, Math.min(7, (event.clientX - (bounds.left + bounds.width / 2)) * strength));
        const magnetY = Math.max(-5, Math.min(5, (event.clientY - (bounds.top + bounds.height / 2)) * strength));
        interactive.style.setProperty('--magnet-x', `${magnetX.toFixed(2)}px`);
        interactive.style.setProperty('--magnet-y', `${magnetY.toFixed(2)}px`);
      } else {
        resetMagnet();
      }

      const currentTilt = event.target instanceof Element
        ? event.target.closest('.cjir-service-card, .cjir-benefit-grid article, .cjir-testimonial-card, .cjir-contact-cards article, .cjir-purpose-grid article, .cjir-value-grid article')
        : null;
      if (currentTilt) {
        if (activeTilt !== currentTilt) resetTilt();
        const bounds = currentTilt.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        currentTilt.style.setProperty('--tilt-x', `${((0.5 - y) * 16).toFixed(2)}deg`);
        currentTilt.style.setProperty('--tilt-y', `${((x - 0.5) * 16).toFixed(2)}deg`);
        currentTilt.style.setProperty('--pointer-x', `${(x * 100).toFixed(1)}%`);
        currentTilt.style.setProperty('--pointer-y', `${(y * 100).toFixed(1)}%`);
        activeTilt = currentTilt;
      } else {
        resetTilt();
      }

      const currentHero = event.target instanceof Element ? event.target.closest('.cjir-hero') : null;
      if (currentHero) {
        const bounds = currentHero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        currentHero.style.setProperty('--hero-dx', `${(x * 12).toFixed(2)}px`);
        currentHero.style.setProperty('--hero-dy', `${(y * 9).toFixed(2)}px`);
        hero = currentHero;
      } else if (hero) {
        hero.style.setProperty('--hero-dx', '0px');
        hero.style.setProperty('--hero-dy', '0px');
        hero = null;
      }
    }

    function handleMotionPreferenceChange() {
      if (reducedMotion.matches) {
        observer?.disconnect();
        resetMagnet();
        resetTilt();
        cursor.dataset.visible = 'false';
        cursor.dataset.hovering = 'false';
        return;
      }
      revealPage();
    }

    function hideCursor() {
      cursor.dataset.visible = 'false';
      cursor.dataset.hovering = 'false';
      resetMagnet();
      resetTilt();
      if (hero) {
        hero.style.setProperty('--hero-dx', '0px');
        hero.style.setProperty('--hero-dy', '0px');
        hero = null;
      }
    }

    function handlePointerOut(event) {
      if (!event.relatedTarget || event.relatedTarget instanceof HTMLIFrameElement) hideCursor();
    }

    revealPage();
    document.documentElement.classList.add('cjir-motion-ready');

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    cleanups.push(() => document.removeEventListener('pointermove', handlePointerMove));
    document.addEventListener('pointerout', handlePointerOut);
    cleanups.push(() => document.removeEventListener('pointerout', handlePointerOut));
    window.addEventListener('blur', hideCursor);
    cleanups.push(() => window.removeEventListener('blur', hideCursor));

    const onReducedMotionChange = () => handleMotionPreferenceChange();
    reducedMotion.addEventListener('change', onReducedMotionChange);
    cleanups.push(() => reducedMotion.removeEventListener('change', onReducedMotionChange));

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.documentElement.classList.remove('cjir-motion-ready');
      document.querySelectorAll('.cjir-reveal').forEach((element) => {
        element.classList.remove('cjir-reveal', 'cjir-is-visible');
      });
      observer?.disconnect();
      resetMagnet();
      resetTilt();
      if (hero) {
        hero.style.setProperty('--hero-dx', '0px');
        hero.style.setProperty('--hero-dy', '0px');
      }
      if (cursor) {
        cursor.dataset.visible = 'false';
        cursor.dataset.hovering = 'false';
      }
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="cjir-cursor-orbit" aria-hidden="true"><span /></div>;
}
