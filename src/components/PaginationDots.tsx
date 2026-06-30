'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'invitation', label: 'Invitation' },
  { id: 'annonce', label: 'Faire-part' },
  { id: 'new-york', label: 'New York' },
  { id: 'paris', label: 'France' },
  { id: 'rsvp', label: 'Répondre' },
];

/**
 * Pagination d'ancrage — petits points dorés fixes sur le côté droit
 * du viewport. Indique où on est dans la page et permet de sauter
 * directement à n'importe quelle section.
 */
export function PaginationDots({
  onNavigate,
}: {
  onNavigate?: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string>('invitation');

  useEffect(() => {
    const onScroll = () => {
      const ref = window.scrollY + window.innerHeight * 0.35;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= ref) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      document.body.style.overflow = '';
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3.5"
      aria-label="Navigation des sections"
    >
      {SECTIONS.map((s) => {
        const active = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => handleClick(s.id)}
            aria-label={`Aller à ${s.label}`}
            aria-current={active ? 'true' : undefined}
            className="group relative flex items-center justify-end"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                active
                  ? 'w-3 h-3 bg-sun shadow-[0_0_0_3px_rgba(192,142,44,0.18)]'
                  : 'w-2 h-2 bg-sun/45 group-hover:bg-sun/75'
              }`}
            />
            <span className="pointer-events-none absolute right-5 md:right-6 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-sky-deep bg-cream/95 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm shadow-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
