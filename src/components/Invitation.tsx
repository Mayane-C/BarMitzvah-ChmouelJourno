'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Announcement } from '@/components/Announcement';
import { EventSection } from '@/components/EventSection';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { CrownOrnament } from '@/components/Ornaments';
import { BackgroundSequence } from '@/components/BackgroundSequence';
import { content } from '@/lib/content';

/**
 * Page d'invitation complète (scroll unique).
 *
 * Flux du « Découvrir » :
 *   1. Page chargée : hero visible, body scroll bloqué, vidéo début figée
 *      sur la frame 1.
 *   2. Clic sur « Découvrir » → on déclenche `ltd:play-intro` : le
 *      contenu du hero disparaît en fondu, BackgroundSequence anime la
 *      vidéo début frame 1 → 240 (cinematic intro, ~4s).
 *   3. À la fin de l'intro, le scroll est débloqué et la page glisse en
 *      douceur jusqu'au faire-part.
 */
export function Invitation() {
  const [introState, setIntroState] = useState<'idle' | 'playing' | 'done'>('idle');

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = introState === 'done' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introState]);

  const discover = () => {
    if (introState !== 'idle') return;
    setIntroState('playing');
    window.dispatchEvent(new Event('ltd:play-intro'));
    // Durée de l'intro de BackgroundSequence (4s) — synchroniser.
    setTimeout(() => {
      setIntroState('done');
      requestAnimationFrame(() => {
        document.getElementById('annonce')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 4000);
  };

  return (
    <>
      <BackgroundSequence />
      <Header includeChabbat={false} onReveal={discover} />
      <main>
        <Hero onDiscover={discover} introState={introState} />
        <Announcement />

        <ChmouelPhotoStage id="chmouel-photo-1a" />
        <ChmouelPhotoStage id="chmouel-photo-2" />
        <ChmouelPhotoStage id="chmouel-photo-1b" />

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
      <div className="mx-auto mb-5 h-px w-44 md:w-56 bg-gradient-to-r from-transparent via-sun to-transparent" />
      <h2 className="font-luxe font-normal text-xl md:text-2xl tracking-[0.42em] uppercase text-sky-deep">
        {label}
      </h2>
      {subtitle && (
        <p className="font-display italic text-ink-soft/80 text-base md:text-lg mt-3">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-5 h-px w-44 md:w-56 bg-gradient-to-r from-transparent via-sun to-transparent" />
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
 * Étage plein écran sans contenu — le fond (géré par BackgroundSequence)
 * occupe seul l'espace pendant ce viewport. Utilisé pour les 3 viewports
 * de photos Chmouel entre le faire-part et les blocs d'événements.
 */
function ChmouelPhotoStage({ id }: { id: string }) {
  return <section id={id} className="h-screen min-h-dvh" aria-hidden="true" />;
}
