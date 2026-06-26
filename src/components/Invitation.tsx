'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Announcement } from '@/components/Announcement';
import { EventSection } from '@/components/EventSection';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { CrownOrnament } from '@/components/Ornaments';
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

        <ChmouelPhotoSlot />

        <ZoneHeader
          id="new-york"
          label="À New York"
          subtitle="Chez le Rabbi"
        />
        {content.evenements.newYork.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" flag="us" />
        ))}

        <ZoneSeparator />

        <ZoneHeader
          id="paris"
          label="En France"
          subtitle="En famille"
        />
        {content.evenements.paris.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" flag="fr" />
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
  subtitle,
}: {
  id: string;
  label: string;
  subtitle?: string;
}) {
  return (
    <div id={id} className="px-6 pt-24 pb-6 text-center scroll-mt-24">
      {/* Ornement en losange doré au-dessus */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="block w-10 h-px bg-sun" />
        <span className="text-sun text-base leading-none">◆</span>
        <span className="block w-10 h-px bg-sun" />
      </div>

      <h2 className="font-luxe font-normal text-xl md:text-2xl tracking-[0.42em] uppercase text-sky-deep">
        {label}
      </h2>

      {subtitle && (
        <p className="font-display italic text-ink-soft/80 text-base md:text-lg mt-3">
          {subtitle}
        </p>
      )}

      <div className="flex items-center justify-center gap-3 mt-5">
        <span className="block w-16 h-px bg-sun" />
        <CrownOrnament className="text-sun" size={16} />
        <span className="block w-16 h-px bg-sun" />
      </div>
    </div>
  );
}

function ZoneSeparator() {
  return (
    <div className="my-12 mx-auto max-w-md flex items-center justify-center gap-4 px-6">
      <span className="block flex-1 h-px bg-sun/40" />
      <CrownOrnament className="text-sun" size={22} />
      <span className="block flex-1 h-px bg-sun/40" />
    </div>
  );
}

/**
 * Espace réservé pour la future illustration cartoon de Chmouel
 * (inséré entre le faire-part et la première zone d'événements).
 * Quand l'image sera prête, ajouter une <img /> à l'intérieur.
 */
function ChmouelPhotoSlot() {
  return <section id="chmouel-portrait" className="h-48 md:h-64" aria-hidden="true" />;
}
