import { useEffect, useRef } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { CFG } from '../../data/config';

export default function ResumeViewer({ open, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    // Lock background scrolling
    document.body.style.overflow = 'hidden';

    // Focus close button when viewer opens
    const frame = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const getFocusableElements = () => {
      return [
        ...(dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        ) ?? []),
      ].filter((element) => {
        return element.getClientRects().length > 0;
      });
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();

      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);

      document.body.style.overflow = previousOverflow;

      document.removeEventListener('keydown', handleKeyDown);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      id="resume-viewer"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      className="
        fixed inset-0 z-[80]
        flex h-[100dvh] flex-col
        overflow-hidden overscroll-none
        bg-[#F7F7F8]
        outline-none
        dark:bg-[#0D0F17]
      "
    >
      {/* Toolbar */}
      <header
        className="
          relative z-10
          flex h-[60px] shrink-0
          items-center justify-between
          gap-3
          border-b border-black/[0.06]
          bg-white/95
          px-4
          backdrop-blur-xl
          dark:border-white/[0.08]
          dark:bg-[#0D0F17]/95
          sm:h-16 sm:px-6
          lg:px-8
        "
      >
        {/* Resume identity */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span
            aria-hidden="true"
            className="
              h-2.5 w-2.5 shrink-0
              rounded-full bg-emerald-500
              ring-4 ring-emerald-500/10
            "
          />

          <h2
            id="resume-title"
            className="
              truncate text-sm font-semibold
              tracking-[-0.02em]
              text-[#171717]
              dark:text-white
              sm:text-[15px]
            "
          >
            Sanjeevan
            <span className="mx-1.5 text-black/20 dark:text-white/20">
              —
            </span>
            <span className="font-medium text-black/50 dark:text-white/50">
              Resume
            </span>
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            as="a"
            href={CFG.resume}
            download="Sanjeevan-Resume-UI-UX-Designer.pdf"
            variant="dark"
            className="
              !h-10 !min-h-10
              !gap-2 !rounded-xl
              !px-3.5
              text-sm
              sm:!h-11 sm:!min-h-11
              sm:!px-4
            "
            aria-label="Download resume PDF"
          >
            <Icon name="download" />
            <span>Download Resume</span>
          </Button>

          <Button
            ref={closeRef}
            onClick={onClose}
            variant="soft"
            className="
              !h-10 !w-10 !min-h-10
              !shrink-0 !rounded-xl !p-0
              sm:!h-11 sm:!w-11 sm:!min-h-11
            "
            aria-label="Close resume viewer"
          >
            <Icon name="x" />
          </Button>
        </div>
      </header>

      {/* PDF Viewer */}
      <main
        className="
          relative flex min-h-0 flex-1
          overflow-hidden
          bg-[#EDEDEF]
          dark:bg-[#151720]
        "
      >
        <iframe
          title="Sanjeevan's resume PDF"
          src={CFG.resume}
          className="flex-1 block w-full h-full bg-white border-0 "
        />
      </main>
    </div>
  );
}