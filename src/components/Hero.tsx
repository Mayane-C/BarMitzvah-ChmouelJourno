'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '@/lib/content';
import { Countdown } from '@/components/Countdown';

export function Hero({ onDiscover }: { onDiscover?: () => void }) {
  const [logoOk, setLogoOk] = useState(true);
  const logoRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP : flottement + respiration premium du logo (effet « wow »).
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { y: -12, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to(el, { scale: 1.045, duration: 4.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
    return () => ctx.revert();
  }, [logoOk]);

  // GSAP ScrollTrigger : parallax au scroll (contenu + particules à vitesses
  // différentes → profondeur).
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const st = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      };
      gsap.to(contentRef.current, { yPercent: -22, opacity: 0.6, ease: 'none', scrollTrigger: st });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const discover = () => {
    document.body.style.overflow = ''; // déverrouille immédiatement le scroll
    onDiscover?.();
    window.dispatchEvent(new Event('ltd:play-music'));
    requestAnimationFrame(() =>
      document.getElementById('annonce')?.scrollIntoView({ behavior: 'smooth' })
    );
  };

  return (
    <section
      ref={sectionRef}
      id="invitation"
      className="relative min-h-screen min-h-dvh flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden"
    >
      {/* Overlay sombre local au hero → fort contraste */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(16,42,50,0.62) 0%, rgba(16,42,50,0.54) 60%, rgba(16,42,50,0.32) 100%)',
        }}
      />

      <div ref={contentRef} className="relative z-10 w-full max-w-2xl">
      <motion.div
        className="flex flex-col items-center w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' as const }}
      >
        {/* Couronne — monogramme royal */}
        {logoOk ? (
          <img
            ref={logoRef}
            src={content.visuels.logoCrown}
            alt=""
            onError={() => setLogoOk(false)}
            className="w-32 md:w-40 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        ) : (
          <div className="font-luxe text-6xl text-sun">CJ</div>
        )}

        {/* Nom du Bar Mitsva */}
        <p className="text-sand/90 text-xs md:text-sm tracking-[0.45em] uppercase mt-6">
          Bar Mitsva
        </p>
        <h1 className="font-luxe text-5xl md:text-7xl text-sand leading-tight mt-3 tracking-[0.05em]">
          {content.enfant.prenom}
        </h1>
        <p className="font-luxe text-sand/90 text-xl md:text-2xl tracking-[0.32em] uppercase mt-1">
          {content.enfant.nom}
        </p>

        <div className="flex items-center justify-center gap-4 mt-5 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-sun" />
          <span className="text-sun text-xs">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-sun" />
        </div>

        {/* Compte à rebours intégré au hero */}
        <Countdown embedded />

        <button
          type="button"
          onClick={discover}
          className="btn-premium mt-9 inline-flex items-center justify-center px-10 py-4 rounded-full text-sm tracking-[0.2em] uppercase"
        >
          Découvrir
        </button>
      </motion.div>
      </div>
    </section>
  );
}
