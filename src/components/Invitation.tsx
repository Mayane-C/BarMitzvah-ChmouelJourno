'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Announcement } from '@/components/Announcement';
import { EventSection } from '@/components/EventSection';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { content } from '@/lib/content';

/**
 * Page d'invitation complète (scroll unique).
 * Le scroll est bloqué tant que l'invité n'a pas cliqué sur « Découvrir ».
 */
export function Invitation() {
  const [discovered, setDiscovered] = useState(false);

  // Au (re)chargement de la page : on revient toujours au hero.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = discovered ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [discovered]);

  return (
    <>
      <Header includeChabbat={false} onReveal={() => setDiscovered(true)} />
      <main>
        <Hero onDiscover={() => setDiscovered(true)} />
        <Announcement />

        <ZoneHeader id="new-york" label="À New York" icon={<LibertyIcon />} />
        {content.evenements.newYork.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" />
        ))}

        <ZoneSeparator />

        <ZoneHeader id="paris" label="En France" icon={<EiffelIcon />} />
        {content.evenements.paris.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" />
        ))}

        <RSVP includeChabbat={true} />
      </main>
      <Footer />
    </>
  );
}

function ZoneHeader({
  id,
  label,
  icon,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div id={id} className="px-6 pt-20 pb-4 text-center scroll-mt-24">
      {icon && (
        <div className="mb-4 flex justify-center text-sun">{icon}</div>
      )}
      <div className="inline-flex items-center gap-4">
        <span className="block w-12 h-px bg-sun" />
        <span className="font-luxe text-sm tracking-[0.45em] uppercase text-sky-deep">
          {label}
        </span>
        <span className="block w-12 h-px bg-sun" />
      </div>
    </div>
  );
}

function ZoneSeparator() {
  return (
    <div className="my-8 mx-auto max-w-md flex items-center justify-center gap-4 px-6">
      <span className="block flex-1 h-px bg-sun/40" />
      <span className="text-sun text-lg">✦</span>
      <span className="block flex-1 h-px bg-sun/40" />
    </div>
  );
}

/** Silhouette de la Statue de la Liberté, doré, en SVG inline. */
function LibertyIcon() {
  return (
    <svg
      viewBox="0 0 32 52"
      width="34"
      height="55"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Flamme du flambeau */}
      <path d="M26 3 c 0 1.5 -0.6 2.4 0 3.4 c 0.6 -0.8 1.4 -0.8 1 -3.4 z" />
      {/* Manche du flambeau */}
      <rect x="25.4" y="6.4" width="1.4" height="2.2" />
      {/* Bras levé */}
      <path d="M21 14.5 L 24.8 8.6 L 26.4 9 L 26.4 9.9 L 23.4 13.5 L 22 15 Z" />
      {/* Couronne — 7 pointes */}
      <path d="M10.5 9.5 L 12 5 L 13 8 L 14 4 L 15.2 8 L 16 3 L 16.8 8 L 18 4 L 19 8 L 20 5 L 21.5 9.5 Z" />
      {/* Tête */}
      <ellipse cx="16" cy="11.5" rx="2.1" ry="2.1" />
      {/* Corps / robe */}
      <path d="M13 13.5 C 13 16 12 20 11.2 30 L 10.4 37 L 21.6 37 L 20.8 30 C 20 20 19 16 19 13.5 Z" />
      {/* Tablette tenue dans le bras gauche */}
      <path d="M9 21 L 12 19 L 12 27 L 9 28 Z" />
      {/* Piédestal — étages */}
      <rect x="10.4" y="37" width="11.2" height="2.6" />
      <rect x="9" y="39.6" width="14" height="4.4" />
      <rect x="7.4" y="44" width="17.2" height="2.2" />
      <rect x="5.5" y="46.2" width="21" height="2.4" />
      <rect x="3.5" y="48.6" width="25" height="2.4" />
    </svg>
  );
}

/** Silhouette de la Tour Eiffel, dorée, en SVG inline. */
function EiffelIcon() {
  return (
    <svg
      viewBox="0 0 32 52"
      width="34"
      height="55"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Antenne */}
      <rect x="15.5" y="3" width="1" height="4.5" />
      {/* Sommet */}
      <polygon points="14,7.5 18,7.5 17.4,12 14.6,12" />
      {/* Étage supérieur */}
      <polygon points="14.6,12 17.4,12 18.6,21 13.4,21" />
      {/* Plateforme 2 */}
      <rect x="12.5" y="20.5" width="7" height="1.1" />
      {/* Étage moyen */}
      <polygon points="13.4,21.6 18.6,21.6 21,34 11,34" />
      {/* Plateforme 1 */}
      <rect x="10" y="33.5" width="12" height="1.2" />
      {/* Jambes courbées + arche */}
      <path d="M11 34.7 C 7 39 4.5 43 3.5 47 L 6.5 47 C 7.5 43 9.5 40 13 36.5 Z" />
      <path d="M21 34.7 C 25 39 27.5 43 28.5 47 L 25.5 47 C 24.5 43 22.5 40 19 36.5 Z" />
      {/* Arche centrale */}
      <path d="M 8 47 Q 12 42 16 42 Q 20 42 24 47 L 21 47 Q 19 44 16 44 Q 13 44 11 47 Z" />
      {/* Sol */}
      <rect x="2.5" y="48" width="27" height="2" />
    </svg>
  );
}
