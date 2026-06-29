'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '@/lib/content';
import { CrownOrnament } from '@/components/Ornaments';

const TARGET_DATE = new Date(content.countdownTarget);

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { jours: 0, heures: 0, minutes: 0, secondes: 0 };
  return {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Une unité = un grand chiffre vert royal (Cinzel) + un label doré en
 * petites caps. Pas de carte ni de verre dépoli — typographie pure.
 */
function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center min-w-[64px] md:min-w-[88px]">
      <div className="relative h-12 md:h-16 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            className="font-luxe text-5xl md:text-6xl leading-none tracking-[0.04em] tabular-nums text-sky-deep"
            initial={{ y: '70%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-70%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            suppressHydrationWarning
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-[10px] md:text-[11px] tracking-[0.42em] uppercase text-sun font-luxe">
        {label}
      </span>
    </div>
  );
}

/** Fine barre verticale dorée entre les unités. */
function Sep() {
  return (
    <span
      aria-hidden="true"
      className="self-center block w-px h-10 md:h-12 bg-gradient-to-b from-transparent via-sun to-transparent"
    />
  );
}

export function Countdown({ embedded = false }: { embedded?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ jours: 0, heures: 0, minutes: 0, secondes: 0 });

  useEffect(() => {
    setMounted(true);
    setT(getTimeLeft());
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const inner = (
    <div className="max-w-2xl mx-auto text-center">
      {!embedded && (
        <p className="font-luxe text-ink-soft text-xs tracking-[0.45em] uppercase mb-8">
          La soirée dans
        </p>
      )}
      <div className="flex justify-center items-stretch gap-4 md:gap-8">
        <Unit value={mounted ? t.jours : 0} label="Jours" />
        <Sep />
        <Unit value={mounted ? t.heures : 0} label="Heures" />
        <Sep />
        <Unit value={mounted ? t.minutes : 0} label="Min" />
        <Sep />
        <Unit value={mounted ? t.secondes : 0} label="Sec" />
      </div>
      {!embedded && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-sun" />
          <CrownOrnament className="text-sun" size={18} />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-sun" />
        </div>
      )}
    </div>
  );

  if (embedded) return inner;

  return <section className="relative py-14 md:py-20 px-6">{inner}</section>;
}
