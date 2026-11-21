import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { TESTIMONIALS } from '../data/content';

function getValidPeople(data) {
  const seenIds = new Set();

  return data.filter((person) => {
    const valid =
      person &&
      typeof person.id === 'string' &&
      person.id.trim() &&
      typeof person.name === 'string' &&
      person.name.trim() &&
      typeof person.quote === 'string' &&
      person.quote.trim();

    if (!valid || seenIds.has(person.id)) return false;

    seenIds.add(person.id);
    return true;
  });
}

const PEOPLE = getValidPeople(TESTIMONIALS);

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback for browsers without IntersectionObserver.
    if (!('IntersectionObserver' in window)) {
      const frameId = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Portrait({ person }) {
  const [failed, setFailed] = useState(false);

  if (person.portrait && !failed) {
    return (
      <img
        src={person.portrait}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="testimonial-avatar"
      />
    );
  }

  return (
    <span className="testimonial-avatar testimonial-avatar-fallback" aria-hidden="true">
      {initialsOf(person.name)}
    </span>
  );
}

function ReviewCard({ person, index }) {
  const { ref, visible } = useReveal();
  const meta = [person.role, person.company].filter(Boolean).join(' · ');

  return (
    <figure
      ref={ref}
      className={`testimonial-card ${visible ? 'is-visible' : ''}`}
      style={{ '--card-index': index }}
    >
      <blockquote className="testimonial-quote">
        <p>{person.quote.trim()}</p>
      </blockquote>

      <figcaption className="testimonial-author">
        <Portrait person={person} />

        <div className="testimonial-author-info">
          <span className="testimonial-author-name">{person.name}</span>

          {meta && (
            <span className="testimonial-author-meta">
              {meta}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  if (!PEOPLE.length) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="sec testimonials-section bg-white">
      <div className="wrap">
        <SectionHeading
          headingId="testimonials-title"
          title="Words from the people I work with."
          subtitle="A few kind words from people I've had the pleasure of working with."
          className="testimonials-heading"
        />

        <div
          className="testimonials-track"
          role="region"
          aria-label="Client testimonials"
          aria-describedby="testimonials-instructions"
          tabIndex={0}
        >

          {PEOPLE.map((person, index) => (
            <ReviewCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
