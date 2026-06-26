'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '@/lib/content';
import { Countdown } from '@/components/Countdown';
import { CrownOrnament } from '@/components/Ornaments';

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
      {/* Voile local au hero : sombre quand des frames vidéo sont actives,
         transparent sinon → laisse remonter le fond crème pour faire ressortir
         le vert royal du nom. */}
      {content.video.frames.count > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(16,42,50,0.62) 0%, rgba(16,42,50,0.54) 60%, rgba(16,42,50,0.32) 100%)',
          }}
        />
      )}

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
            className="w-32 md:w-40 drop-shadow-[0_0_28px_rgba(255,255,255,0.85)]"
          />
        ) : (
          <div className="font-luxe text-6xl text-sun">CJ</div>
        )}

        {/* Nom du Bar Mitsva — wordmark image officiel + hébreu + nom */}
        <p className="text-sky-deep/80 text-xs md:text-sm tracking-[0.55em] uppercase mt-6">
          Bar Mitsva
        </p>
        <img
          src={content.visuels.wordmark}
          alt={content.enfant.prenom}
          className="w-72 md:w-[28rem] mt-4 select-none"
          draggable={false}
        />
        {content.enfant.prenomHe && (
          <p className="font-hebrew text-sun text-3xl md:text-4xl mt-3" dir="rtl">
            {content.enfant.prenomHe}
          </p>
        )}
        <p className="font-luxe font-normal text-sky-deep/85 text-lg md:text-xl tracking-[0.42em] uppercase mt-3">
          {content.enfant.nom}
        </p>

        <div className="flex items-center justify-center gap-4 mt-6 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-sun" />
          <CrownOrnament className="text-sun" size={18} />
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
