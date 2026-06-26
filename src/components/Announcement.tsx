'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { content } from '@/lib/content';
import { CrownOrnament } from '@/components/Ornaments';

const a = content.annonce;

/**
 * Verset hébreu courbé, SANS textPath : chaque graphème (lettre + voyelles)
 * est posé et pivoté individuellement le long d'un cercle (rendu natif →
 * nikoud + ordre RTL corrects). Pour des lettres BIEN plus grosses, le verset
 * est réparti sur DEUX arcs concentriques (2 lignes courbées).
 */
function CurvedHebrew({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // Rendu client-only : le découpage en graphèmes (Intl.Segmenter) peut
  // différer serveur/navigateur → on évite tout mismatch d'hydratation.
  const [mounted, setMounted] = useState(false);
  const [measured, setMeasured] = useState<number[] | null>(null);
  useEffect(() => setMounted(true), []);

  let graphemes: string[];
  try {
    const seg = new Intl.Segmenter('he', { granularity: 'grapheme' });
    graphemes = [...seg.segment(text)].map((g) => g.segment);
  } catch {
    graphemes = [...text];
  }

  const W = 910; // viewBox resserré → le verset occupe + de place (lettres + grosses)
  const H = 250;
  const cx = 455;
  const cy = 800; // centre du cercle (sous l'arc)
  const R = 760; // dôme doux (ni fer à cheval, ni trop plat)
  const step = 24; // pas de base (fallback avant mesure)
  const spaceFactor = 0.5;
  const fontSize = 54; // lettres bien plus grosses (desktop + mobile)
  const target = 900; // longueur d'arc visée (pour tenir sur une ligne)
  const N = graphemes.length;

  // Mesure la largeur RÉELLE de chaque lettre (canvas, après chargement de la
  // police) → l'avance suit la largeur du glyphe = espacement régulier (les
  // lettres étroites ne laissent plus de gros trous).
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      try {
        const probe = document.createElement('span');
        probe.style.fontFamily = 'var(--font-frank)';
        document.body.appendChild(probe);
        const fam = getComputedStyle(probe).fontFamily || 'serif';
        document.body.removeChild(probe);
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return;
        ctx.font = `${fontSize}px ${fam}`;
        const widths = graphemes.map((g) =>
          g.trim() === '' ? fontSize * 0.3 : ctx.measureText(g).width
        );
        if (!cancelled) setMeasured(widths);
      } catch {
        /* fallback : pas fixe */
      }
    };
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    measure();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Avances : largeurs mesurées (mises à l'échelle pour tenir sur la ligne) ;
  // sinon pas fixe en attendant la mesure.
  const rawAdv =
    measured ?? graphemes.map((g) => (g.trim() === '' ? step * spaceFactor : step));
  const rawTotal = rawAdv.reduce((s, w) => s + w, 0) || 1;
  const scale = measured ? Math.min(1, target / rawTotal) : 1;
  const advances = rawAdv.map((w) => w * scale);
  const centers: number[] = [];
  let accLen = 0;
  for (let i = 0; i < N; i++) {
    centers.push(accLen + advances[i] / 2);
    accLen += advances[i];
  }
  const totalLen = accLen; // longueur d'arc totale

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-label={text} role="img">
      {mounted &&
        graphemes.map((g, i) => {
          // centré autour du sommet (-90°) ; glyphe 0 = à droite, dernier = à gauche
          const a = -Math.PI / 2 + (totalLen / 2 - centers[i]) / R;
          const x = cx + R * Math.cos(a);
          const y = cy + R * Math.sin(a);
          const rot = (a * 180) / Math.PI + 90;
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="var(--color-sky-deep)"
              fontSize={fontSize}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: 'var(--font-frank)' }}
              transform={`rotate(${rot} ${x} ${y})`}
            >
              {g}
            </text>
          );
        })}
    </svg>
  );
}

// Cascade : le conteneur orchestre l'apparition l'un après l'autre des éléments.
const container: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.13,
      delayChildren: 0.12,
    },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const itemName: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const itemLine: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function Announcement() {
  const [crownOk, setCrownOk] = useState(true);

  return (
    <section id="annonce" className="relative py-24 md:py-32 px-6">
      <motion.div
        className="relative max-w-2xl mx-auto bg-cream/85 border-t-2 border-sky-deep/35 shadow-lg shadow-sky-deep/10 px-8 pt-10 pb-12 md:px-14 md:pt-14 md:pb-16 text-center"
        style={{
          // vraie arche (dôme) : les coins haut s'étirent jusqu'au centre
          borderRadius: '50% 50% 1.5rem 1.5rem / 130px 130px 1.5rem 1.5rem',
        }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* בס״ד (centré pour ne pas être masqué par l'arche) */}
        <motion.p variants={item} className="font-hebrew text-ink-soft/70 text-sm mb-3">
          {a.siyata}
        </motion.p>

        {/* Verset des téfilines — courbé en arc (chaque lettre posée sur le cercle) */}
        <motion.div variants={item}>
          <CurvedHebrew text={a.verset} className="w-full max-w-2xl mx-auto" />
        </motion.div>

        {/* Couronne sous le verset (remontée pour resserrer l'arche) */}
        {crownOk && (
          <motion.img
            variants={item}
            src={content.visuels.logoCrown}
            alt=""
            onError={() => setCrownOk(false)}
            className="w-24 md:w-32 mx-auto -mt-10 md:-mt-14 mb-6"
          />
        )}

        {/* Grands-parents — deux colonnes */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 items-center gap-x-10 max-w-xl mx-auto text-ink font-display text-base md:text-lg leading-snug"
        >
          <div className="space-y-2">
            {a.grandsParents.gauche.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
          <div className="space-y-2">
            {a.grandsParents.droite.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="flex items-center justify-center gap-4 my-8">
          <div className="w-14 h-px bg-gradient-to-r from-transparent to-sky/70" />
          <CrownOrnament className="text-sun" size={18} />
          <div className="w-14 h-px bg-gradient-to-l from-transparent to-sky/70" />
        </motion.div>

        {/* Parents & fratrie */}
        <motion.p variants={item} className="text-ink font-display text-xl md:text-2xl">
          {a.famille}
        </motion.p>

        <motion.p
          variants={item}
          className="font-display italic mt-3 text-ink-soft text-base md:text-lg"
        >
          {a.intro}
        </motion.p>

        {/* Bar Mitsva — Cinzel, mêmes caps que le hero */}
        <motion.h2
          variants={item}
          className="shine-gold mt-5 font-luxe font-normal uppercase tracking-[0.18em] text-3xl md:text-5xl"
        >
          {a.evenement}
        </motion.h2>

        <motion.p
          variants={item}
          className="font-display italic mt-4 text-ink-soft text-base md:text-lg"
        >
          {a.lien}
        </motion.p>

        {/* Prénom du Bar Mitsva — wordmark officiel + hébreu en dessous */}
        <motion.img
          variants={itemName}
          src={content.visuels.wordmark}
          alt={a.prenom}
          className="w-56 md:w-72 mx-auto mt-4 select-none"
          draggable={false}
        />
        {content.enfant.prenomHe && (
          <motion.p
            variants={item}
            className="font-hebrew text-sun text-3xl md:text-4xl mt-3"
            dir="rtl"
          >
            {content.enfant.prenomHe}
          </motion.p>
        )}
        {a.prenomSecond && (
          <motion.p
            variants={item}
            className="mt-1 font-display text-2xl md:text-3xl text-sky-deep/80 tracking-wide"
          >
            {a.prenomSecond}
          </motion.p>
        )}
        <motion.div
          variants={itemLine}
          className="mx-auto mt-4 h-px w-36 md:w-44 bg-gradient-to-r from-transparent via-sun to-transparent"
        />
        {a.pensee && (
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-md text-ink-soft/90 text-sm md:text-base italic leading-relaxed"
            dir="auto"
          >
            {a.pensee}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
