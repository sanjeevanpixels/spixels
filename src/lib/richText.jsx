import { Fragment } from 'react';

// Renders **bold** markers from content strings without dangerouslySetInnerHTML
export function RichText({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 ? (
      <b key={i} className="font-semibold text-black dark:text-white">{part}</b>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
