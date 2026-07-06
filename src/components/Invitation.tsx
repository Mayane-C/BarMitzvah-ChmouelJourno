'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Announcement } from '@/components/Announcement';
import { EventSection } from '@/components/EventSection';
import { RSVP } from '@/components/RSVP';
import { Footer } from '@/components/Footer';
import { BackgroundSequence } from '@/components/BackgroundSequence';
import { ScrollHint } from '@/components/ScrollHint';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { ZoneBand } from '@/components/Bands';
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
    // Verrouillé uniquement à l'idle ; dès qu'on clique « Découvrir »,
    // le scroll est libéré pour que la page glisse vers l'annonce pendant
    // que les portes du 770 s'ouvrent.
    document.body.style.overflow = introState === 'idle' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introState]);

  // Premier scroll après l'intro : dès que l'invité a commencé à
  // scroller (10 px au-delà du sommet du faire-part), on reprend la
  // main et on anime jusqu'à la photo 1. Le scrollTo par rAF override
  // le scroll natif, y compris le momentum inertial iOS. Durée
  // proportionnelle à la distance restante — plus l'invité a scrollé
  // vite, plus il est proche, plus l'animation est courte.
  useEffect(() => {
    if (introState === 'idle') return;
    let taken = false;
    let rafId = 0;

    const animateTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const startT = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startT) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        window.scrollTo(0, startY + (targetY - startY) * eased);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          window.scrollTo(0, targetY);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (taken) return;
      const annonce = document.getElementById('annonce');
      const photo1 = document.getElementById('chmouel-photo-1a');
      if (!annonce || !photo1) return;
      const y = window.scrollY;
      if (y <= annonce.offsetTop + 10) return;
      if (y >= photo1.offsetTop - 10) return;
      taken = true;
      const distance = photo1.offsetTop - y;
      const duration = Math.max(450, Math.min(1400, distance * 1.4));
      animateTo(photo1.offsetTop, duration);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [introState]);

  const discover = () => {
    if (introState !== 'idle') return;
    setIntroState('playing');
    window.dispatchEvent(new Event('ltd:play-intro'));
    requestAnimationFrame(() => {
      document.getElementById('annonce')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setTimeout(() => setIntroState('done'), 4000);
  };

  /**
   * Navigation via le menu hamburger ou la pagination d'ancrage —
   * skip l'intro vidéo et révèle directement le contenu, puis scroll
   * vers la section demandée. Pas de conflit avec l'auto-scroll de
   * `discover` vers l'annonce.
   */
  const navigate = (id: string) => {
    if (introState === 'idle') {
      // L'annonce ne s'affichera pas si on ne déclenche pas l'événement.
      setIntroState('done');
      window.dispatchEvent(new Event('ltd:play-intro'));
    }
    document.body.style.overflow = '';
    // Attendre la prochaine frame pour que le scroll lock soit bien levé
    // avant le scrollIntoView.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <BackgroundSequence />
      <Header includeChabbat={false} onReveal={discover} onNavigate={navigate} />
      <main>
        <Hero onDiscover={discover} introState={introState} />
        <Announcement />

        {/* Cycle photos : image 1 (intro) → image 2 → image 1 (transition brève
            avant le texte). Le boy défile en un seul scroll, image 1 sa 2e
            apparition est volontairement très courte pour ne pas s'attarder. */}
        <ChmouelPhotoStage id="chmouel-photo-1a" h="35vh" />
        <ChmouelPhotoStage id="chmouel-photo-2" h="30vh" />
        <ChmouelPhotoStage id="chmouel-photo-1b" h="20vh" />

        <ZoneBand
          id="new-york"
          label="À New York"
          subtitle="Chez le Rabbi"
        />
        {content.evenements.newYork.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" flag="us" />
        ))}

        <ZoneBand
          id="paris"
          label="En France"
          subtitle="Tous réunis"
        />
        {content.evenements.paris.map((e) => (
          <EventSection key={e.id} id={e.id} event={e} accent="sky" flag="fr" />
        ))}

        <RSVP includeChabbat={true} />
      </main>
      <Footer />
      <ScrollHint />
      <BackgroundMusic />
    </>
  );
}

/**
 * Étage sans contenu — révélation rapide du fond. Hauteur ajustable via
 * `h` pour pouvoir donner moins de scroll à l'image 1 sur sa 2e
 * apparition (transition brève avant le texte).
 */
function ChmouelPhotoStage({ id, h }: { id: string; h: string }) {
  return (
    <section
      id={id}
      style={{ height: h, minHeight: h }}
      aria-hidden="true"
    />
  );
}
