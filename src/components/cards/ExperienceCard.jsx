import { useState } from 'react';
import Icon from '../ui/Icon';
import { RichText } from '../../lib/richText';

function CompanyBadge({ name, logo }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex items-center min-w-0 gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/5 dark:bg-[#191D2A] dark:ring-white/10">
        {logo && !logoFailed ? (
          <img
            src={logo}
            alt={`${name} logo`}
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            onError={() => setLogoFailed(true)}
            className="object-contain size-9"
          />
        ) : (
          <span className="font-bricolage text-sm font-bold text-[#0D0F17] dark:text-white">
            {name.trim().slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <span className="min-w-0 text-base font-bold leading-tight font-bricolage sm:text-lg">
        {name}
      </span>
    </div>
  );
}

const Meta = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1.5">
    <Icon
      name={icon}
      aria-hidden="true"
      className="ico !size-3.5 shrink-0 opacity-60"
    />
    {text}
  </span>
);

export default function ExperienceCard({
  co,
  role,
  loc,
  when,
  front,
  back,
  tags = [],
  url,
  logo,
  products = [],
}) {
  const muted = 'text-[#666] dark:text-[#A3A3A3]';

  return (
    <article className="flex flex-col h-full min-w-0 card">

      {/* Company */}
      <CompanyBadge name={co} logo={logo} />

      {/* Role */}
      <h3 className="mt-3 text-lg font-semibold leading-snug sm:text-xl">
        {role}
      </h3>

      {/* Meta information */}
      <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm ${muted}`}>
        {loc && <Meta icon="map-pin" text={loc} />}
        {when && <Meta icon="calendar" text={when} />}
      </div>

      {/* Description */}
      {(front || back) && (
        <div className={`mt-3 space-y-2 text-sm leading-relaxed sm:text-[15px] ${muted}`}>
          {front && <RichText text={front} />}
          {back && <p>{back}</p>}
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="mt-4">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${muted}`}>
            Products I contributed to
          </p>

          <ul className="flex flex-wrap gap-2">
            {products.map((product) => (
              <li
                key={product.name}
                className="inline-flex h-8 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-neutral-700 dark:bg-[#1A1D26]"
              >
                {product.logo && (
                  <img
                    src={product.logo}
                    alt=""
                    loading="lazy"
                    className="object-contain max-h-4 max-w-16"
                  />
                )}
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {tags.length > 0 && (
        <ul
          className="mt-4 flex flex-wrap gap-1.5"
          aria-label="Skills and focus areas"
        >
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[#F1F1F3] px-2.5 py-1 text-xs text-[#555] dark:bg-[#242631] dark:text-neutral-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {/* Website */}
      {url && url !== '#' && (
        <div className="pt-4 mt-auto">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${co} website (opens in a new tab)`}
            className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded-md text-sm font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Visit website
            <Icon name="arrow-up-right" aria-hidden="true" />
          </a>
        </div>
      )}

    </article>
  );
}
