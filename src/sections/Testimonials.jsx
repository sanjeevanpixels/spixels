import { useState } from 'react';
import Marquee from '../components/ui/Marquee';
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

const splitAt = Math.ceil(PEOPLE.length / 2);
const ROWS = [
  PEOPLE.slice(0, splitAt),
  PEOPLE.slice(splitAt),
].filter((row) => row.length > 0);

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
      className="size-12 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white"
    >
      {initialsOf(person.name)}
    </span>
  );
}

function ReviewCard({ person }) {
  const meta = [person.role, person.company].filter(Boolean).join(', ');

  return (
    <figure className="flex min-h-56 w-72 shrink-0 flex-col justify-between gap-6 rounded-2xl border border-black/5 bg-white p-6 text-[#0D0F17] shadow-sm transition-colors hover:border-black/20 sm:w-96">
      <blockquote className="text-sm leading-relaxed [text-wrap:pretty] sm:text-base">
        <p>&ldquo;{person.quote.trim()}&rdquo;</p>
      </blockquote>
      <figcaption className="flex min-w-0 items-center gap-3">
        <Portrait person={person} />
        <div className="min-w-0 text-sm">
          <div className="truncate font-semibold">{person.name}</div>
          {meta && (
            <div className="truncate text-[#666]">
              {meta}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function ReviewRow({ reviews, reverse = false, rowNumber }) {
  return (
    <Marquee
      label={`Client testimonials, row ${rowNumber}`}
      tabIndex={0}
      className="testimonials-marquee py-1"
      trackClassName={
        reverse
          ? 'gap-5 [animation-duration:70s] [animation-direction:reverse]'
          : 'gap-5 [animation-duration:60s]'
      }
    >
      {reviews.map((person) => (
        <ReviewCard key={person.id} person={person} />
      ))}
    </Marquee>
  );
}

export default function Testimonials() {
  if (PEOPLE.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="sec overflow-hidden bg-[#FBFBFB] !py-12 sm:!py-16 lg:!py-20"
    >
      <div className="wrap">
        <SectionHeading
          headingId="testimonials-title"
          title="Words from the people I work with."
          subtitle="A few kind words from people I've had the pleasure of working with."
          className="mb-8 sm:mb-10 lg:mb-12"
        />

        <div className="flex flex-col gap-5">
          {ROWS.map((reviews, index) => (
            <ReviewRow
              key={index}
              reviews={reviews}
              reverse={index === 1}
              rowNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
