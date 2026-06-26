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

function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[68px] h-20 md:w-20 md:h-24 flex items-center justify-center rounded-2xl overflow-hidden"
        style={{
          // verre dépoli
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(251,246,236,0.28)',
          boxShadow:
            '0 10px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.40)',
        }}
      >
        {/* liseré doré en haut */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-sun to-transparent" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            className="absolute font-display text-4xl md:text-5xl leading-none"
            style={{
              // chiffres dorés métalliques
              backgroundImage:
                'linear-gradient(180deg, #fff7e6 0%, #f6dca2 55%, #e7b75a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 1px rgba(0,0,0,0.12)',
            }}
            initial={{ y: '70%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-70%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            suppressHydrationWarning
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-[10px] md:text-xs tracking-[0.32em] uppercase text-sand-deep/90">
        {label}
      </span>
    </div>
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

  const Sep = () => (
    <span
      className="flex items-center justify-center h-20 md:h-24 font-display text-3xl"
      style={{ color: 'var(--color-sun)' }}
    >
      :
    </span>
  );

  const inner = (
    <div className="max-w-2xl mx-auto text-center">
      {!embedded && (
        <p className="text-ink-soft text-xs tracking-[0.45em] uppercase mb-8">
          La soirée dans
        </p>
      )}
      <div className="flex justify-center gap-3 md:gap-5">
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
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-sky" />
          <CrownOrnament className="text-sun" size={18} />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-sky" />
        </div>
      )}
    </div>
  );

  if (embedded) return inner;

  return <section className="relative py-14 md:py-20 px-6">{inner}</section>;
}
