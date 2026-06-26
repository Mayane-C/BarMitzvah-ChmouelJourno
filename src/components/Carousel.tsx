'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  legende: string;
  focus?: string; // object-position (ex. 'center 45%') pour bien cadrer le visage
}

const AUTOPLAY_MS = 1600;

export function Carousel({
  id,
  photos,
}: {
  id?: string;
  photos: readonly Slide[];
}) {
  const slides = photos;
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<number | undefined>(undefined);

  // Pause l'autoplay pendant qu'on interagit, puis reprend après 5 s d'inactivité.
  const holdAutoplay = useCallback(() => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setPaused(false), 5000);
  }, []);

  useEffect(() => () => { if (resumeRef.current) clearTimeout(resumeRef.current); }, []);

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((prev) => (prev + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    holdAutoplay();
  };

  // Dès que le carrousel apparaît (1er pixel), il repart de la 1ʳᵉ image.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIndex(0);
          setDirection(1);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Le défilement tourne en continu (sauf au survol) → actif dès l'apparition.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go, index]);

  return (
    <section id={id} ref={sectionRef} className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden rounded-3xl bg-sand shadow-xl shadow-ink/10"
          style={{
            borderTop: '3px solid var(--color-sky-deep)',
            // clip-path : coins arrondis fiables même pendant l'animation (iOS/Safari)
            clipPath: 'inset(0 round 1.5rem)',
            // laisse le scroll vertical de la page, capte l'horizontal pour le swipe
            touchAction: 'pan-y',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={holdAutoplay}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={index}
              src={slides[index].src}
              alt={slides[index].alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: slides[index].focus ?? 'center 25%' }}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragStart={holdAutoplay}
              onDragEnd={(_, info) => {
                const swipe = info.offset.x + info.velocity.x * 0.2;
                if (swipe < -45) go(1);
                else if (swipe > 45) go(-1);
                holdAutoplay();
              }}
            />
          </AnimatePresence>

          {/* Flèches */}
          <button
            type="button"
            onClick={() => { go(-1); holdAutoplay(); }}
            aria-label="Image précédente"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm text-sky-deep flex items-center justify-center hover:bg-cream transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => { go(1); holdAutoplay(); }}
            aria-label="Image suivante"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm text-sky-deep flex items-center justify-center hover:bg-cream transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Pastilles */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller à l’image ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-sky-deep' : 'w-2 bg-sky/40 hover:bg-sky/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
