import { useState } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { TESTIMONIALS } from '../data/content';

const seenIds = new Set();

const PEOPLE = TESTIMONIALS.filter((person) => {
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

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function Portrait({ person }) {
  const [failed, setFailed] = useState(false);

  return person.portrait && !failed ? (
    <img
      src={person.portrait}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-11 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white"
    >
      {initialsOf(person.name)}
    </span>
  );
}

function ReviewCard({ person }) {
  const meta = [person.role, person.company].filter(Boolean).join(', ');

  return (
    <figure
      className="
        flex w-[85%] shrink-0 snap-center flex-col justify-between gap-6
        rounded-2xl border border-black/5 bg-white p-5 text-[#0D0F17] shadow-sm
        transition-colors duration-300 hover:border-black/20
        sm:w-[60%] sm:p-6
        md:w-auto md:shrink
      "
    >
      <blockquote className="text-sm leading-relaxed [text-wrap:pretty] sm:text-base">
        <p>&ldquo;{person.quote.trim()}&rdquo;</p>
      </blockquote>

      <figcaption className="flex min-w-0 items-center gap-3">
        <Portrait person={person} />

        <div className="min-w-0 text-sm">
          <div className="truncate font-semibold">{person.name}</div>
          {meta && (
            <div className="truncate text-xs text-[#666] sm:text-sm">
              {meta}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  if (PEOPLE.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="sec overflow-hidden bg-[#FBFBFB] !py-10 sm:!py-14 lg:!py-20"
    >
      <div className="wrap">
        <SectionHeading
          headingId="testimonials-title"
          title="Words from the people I work with."
          subtitle="A few kind words from people I've had the pleasure of working with."
          className="mb-7 sm:mb-10 lg:mb-12"
        />

        <div
          role="region"
          aria-label="Client testimonials"
          tabIndex={0}
          className="
            -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
            sm:-mx-6 sm:px-6
            md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:p-0
            lg:grid-cols-3
          "
        >
          {PEOPLE.map((person) => (
            <ReviewCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}