'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Croissant,
  PartyPopper,
} from 'lucide-react';

type IconProps = { className?: string; size?: number; strokeWidth?: number };

/** Wrapper commun aux icônes sur-mesure — même style trait fin doré-vert. */
function IconShell({
  className,
  size = 24,
  strokeWidth = 1.4,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Deux bougies de Chabbat — bougeoirs galbés sur un socle commun. */
function CandlesIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* flammes (remplies) */}
      <path d="M9 3 C 10.2 4.4 10.2 5.8 9 6.6 C 7.8 5.8 7.8 4.4 9 3 Z" fill="currentColor" />
      <path d="M15 3 C 16.2 4.4 16.2 5.8 15 6.6 C 13.8 4.4 13.8 4.4 15 3 Z" fill="currentColor" />
      {/* cires (corps des bougies) — fines */}
      <line x1="9" y1="7" x2="9" y2="15" />
      <line x1="15" y1="7" x2="15" y2="15" />
      {/* bougeoirs galbés */}
      <path d="M7 15 L 11 15 L 10 17 L 8 17 Z" />
      <path d="M13 15 L 17 15 L 16 17 L 14 17 Z" />
      {/* socle commun */}
      <path d="M5 19 L 19 19" />
      <path d="M7 17 L 7 19" />
      <path d="M11 17 L 11 19" />
      <path d="M13 17 L 13 19" />
      <path d="M17 17 L 17 19" />
    </IconShell>
  );
}

/** Téfilines — boîtier de tête (shel rosh) + deux lanières qui descendent. */
function TefilinIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* boîtier carré */}
      <rect x="8" y="6" width="8" height="7" rx="0.5" />
      {/* fendage des 4 compartiments en façade */}
      <line x1="10" y1="6" x2="10" y2="13" />
      <line x1="12" y1="6" x2="12" y2="13" />
      <line x1="14" y1="6" x2="14" y2="13" />
      {/* lanières (rétzouot) qui descendent */}
      <path d="M8 13 L 5 21" />
      <path d="M16 13 L 19 21" />
    </IconShell>
  );
}

/** Rouleau de Torah (Séfer Torah) — deux atsé-haïm encadrant le parchemin. */
function TorahIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* mâts (atsé-haïm) gauche/droit */}
      <ellipse cx="6" cy="12" rx="1.6" ry="9" />
      <ellipse cx="18" cy="12" rx="1.6" ry="9" />
      {/* pommeaux haut/bas */}
      <ellipse cx="6" cy="3.2" rx="2" ry="1" />
      <ellipse cx="18" cy="3.2" rx="2" ry="1" />
      <ellipse cx="6" cy="20.8" rx="2" ry="1" />
      <ellipse cx="18" cy="20.8" rx="2" ry="1" />
      {/* parchemin central */}
      <line x1="7.6" y1="6" x2="16.4" y2="6" />
      <line x1="7.6" y1="18" x2="16.4" y2="18" />
    </IconShell>
  );
}

/** Séfer (livre ouvert) — pour les discours / maamar / étude. */
function SeferIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* deux pages ouvertes */}
      <path d="M3 6 C 6 5 9 5 12 6.5 C 15 5 18 5 21 6 L 21 19 C 18 18 15 18 12 19.5 C 9 18 6 18 3 19 Z" />
      {/* couture centrale */}
      <line x1="12" y1="6.5" x2="12" y2="19.5" />
      {/* quelques lignes de texte stylisées */}
      <line x1="5.5" y1="9" x2="9.5" y2="9.4" />
      <line x1="5.5" y1="11" x2="9.5" y2="11.4" />
      <line x1="5.5" y1="13" x2="9.5" y2="13.4" />
      <line x1="14.5" y1="9.4" x2="18.5" y2="9" />
      <line x1="14.5" y1="11.4" x2="18.5" y2="11" />
      <line x1="14.5" y1="13.4" x2="18.5" y2="13" />
    </IconShell>
  );
}

/** Étoile de David (réserve). */
function StarOfDavidIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      <polygon points="12,3 3.5,17.7 20.5,17.7" />
      <polygon points="12,21 3.5,6.3 20.5,6.3" />
    </IconShell>
  );
}

/**
 * Silhouette du 770 — façade Gothic Revival avec ses 3 arches caractéristiques
 * et son pignon pointu. Référence historique : 770 Eastern Parkway, Brooklyn.
 */
function SevenSeventyIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* Façade + pignon pointu */}
      <path d="M3 21 L 3 9 L 12 3 L 21 9 L 21 21 Z" />
      {/* 3 fenêtres arquées */}
      <path d="M5.5 16 L 5.5 13 Q 5.5 11.5 7 11.5 Q 8.5 11.5 8.5 13 L 8.5 16 Z" />
      <path d="M10.5 16 L 10.5 13 Q 10.5 11.5 12 11.5 Q 13.5 11.5 13.5 13 L 13.5 16 Z" />
      <path d="M15.5 16 L 15.5 13 Q 15.5 11.5 17 11.5 Q 18.5 11.5 18.5 13 L 18.5 16 Z" />
      {/* Porte arquée */}
      <path d="M10.5 21 L 10.5 18.5 Q 10.5 17.5 12 17.5 Q 13.5 17.5 13.5 18.5 L 13.5 21" />
    </IconShell>
  );
}

/** Couronne royale — écho au logo CHMOUEL (disponible si réutilisée plus tard). */
function CrownIcon(p: IconProps) {
  return (
    <IconShell {...p}>
      {/* silhouette de la couronne — 3 pics dont un central plus haut */}
      <path d="M3 9 L 6 14 L 9 9.5 L 12 5 L 15 9.5 L 18 14 L 21 9 L 19 18 L 5 18 Z" />
      {/* socle bandeau */}
      <line x1="5" y1="20" x2="19" y2="20" />
      {/* pierres précieuses (points hauts) */}
      <circle cx="3" cy="9" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="21" cy="9" r="0.9" fill="currentColor" stroke="none" />
    </IconShell>
  );
}

const TITLE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  candles: CandlesIcon,
  tefilin: TefilinIcon,
  torah: TorahIcon,
  sefer: SeferIcon,
  star: StarOfDavidIcon,
  crown: CrownIcon,
  party: PartyPopper,
  '770': SevenSeventyIcon,
};

/** Mini drapeau « tampon postal » — encadré d'un filet doré. */
function FlagBadge({ country }: { country: 'us' | 'fr' }) {
  const label = country === 'us' ? 'États-Unis' : 'France';
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-block ring-1 ring-sun/70 shadow-sm shadow-sky-deep/10 rounded-[2px] overflow-hidden"
    >
      {country === 'fr' ? <FlagFR /> : <FlagUS />}
    </span>
  );
}

function FlagFR() {
  return (
    <svg viewBox="0 0 30 20" width="30" height="20" aria-hidden="true" className="block">
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </svg>
  );
}

function FlagUS() {
  // Bandes rouge/blanc + canton bleu avec étoiles stylisées (points blancs).
  // Simplifié pour rester lisible à 30×20 sans paraître chargé.
  return (
    <svg viewBox="0 0 30 20" width="30" height="20" aria-hidden="true" className="block">
      <rect width="30" height="20" fill="#B22234" />
      {/* Bandes blanches (6 bandes blanches + 7 rouges = 13 bandes au total) */}
      {[2.3, 5.4, 8.5, 11.6, 14.7, 17.8].map((y) => (
        <rect key={y} y={y} width="30" height="1.6" fill="#FFFFFF" />
      ))}
      {/* Canton bleu */}
      <rect width="13" height="11" fill="#3C3B6E" />
      {/* Étoiles stylisées (4×3 grille de petits points) */}
      {[1.5, 4.5, 7.5, 10.5].map((x) =>
        [1.8, 4.8, 7.8].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#FFFFFF" />
        ))
      )}
    </svg>
  );
}

interface EventData {
  titre: string;
  icon?: string; // clé d'icône du titre (flame / sunrise / party)
  date: string;
  heure: string;
  lieu: string;
  adresse: string;
  wazeUrl: string;
  ambiance?: string;
  programme?: readonly string[];
  filigrane?: string; // verset hébreu affiché en filigrane derrière le programme
}

export function EventSection({
  id,
  event,
  accent,
  flag,
  size = 'default',
}: {
  id: string;
  event: EventData;
  accent: 'sky' | 'sage';
  flag?: 'us' | 'fr';
  size?: 'default' | 'large';
}) {
  const isLarge = size === 'large';
  const waze =
    event.wazeUrl ||
    (event.lieu
      ? `https://waze.com/ul?q=${encodeURIComponent(
          `${event.lieu} ${event.adresse}`.trim()
        )}&navigate=yes`
      : '');

  const accentText = accent === 'sky' ? 'text-sky-deep' : 'text-sage-deep';
  // contours en bleu profond (même bleu que le bouton Découvrir)
  const accentBorder = accent === 'sky' ? 'border-sky-deep/35' : 'border-sage/50';
  const TitleIcon = event.icon ? TITLE_ICONS[event.icon] : null;

  const rows = [
    { icon: Calendar, value: event.date },
    ...(event.heure ? [{ icon: Clock, value: event.heure }] : []),
    ...(event.lieu
      ? [{ icon: MapPin, value: `${event.lieu}${event.adresse ? ' — ' + event.adresse : ''}` }]
      : []),
  ];

  return (
    <section id={id} className={`relative px-6 ${isLarge ? 'py-24 md:py-40' : 'py-20 md:py-28'}`}>
      <motion.div
        className={`relative ${
          isLarge ? 'max-w-3xl' : 'max-w-xl'
        } mx-auto bg-cream/85 rounded-3xl border-t-2 ${accentBorder} shadow-lg shadow-sky-deep/5 ${
          isLarge ? 'px-10 py-14 md:px-20 md:py-20' : 'px-8 py-10 md:px-12 md:py-12'
        } text-center`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {flag && (
          <div className="absolute top-5 right-5 md:top-6 md:right-6">
            <FlagBadge country={flag} />
          </div>
        )}

        {TitleIcon && (
          <TitleIcon className={`${accentText} mx-auto mb-3`} size={34} strokeWidth={1.5} />
        )}

        <h2 className="shine-gold font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight whitespace-pre-line">
          {event.titre}
        </h2>

        {event.ambiance && (
          <p className="text-ink-soft text-sm tracking-[0.2em] uppercase mb-8">
            {event.ambiance}
          </p>
        )}
        {!event.ambiance && <div className="mb-6" />}

        <ul className="space-y-5 text-left max-w-sm mx-auto">
          {rows.map((r, i) => (
            <li key={i} className="flex items-start gap-4">
              <r.icon className={`${accentText} shrink-0 mt-1`} size={20} />
              <span className="font-display text-ink text-base md:text-lg leading-relaxed">
                {r.value}
              </span>
            </li>
          ))}
        </ul>

        {event.programme && event.programme.length > 0 && (
          <div className={`relative mt-8 max-w-sm mx-auto text-left border-t ${accentBorder} pt-6 overflow-hidden`}>
            {/* Filigrane : verset des téfilines en transparence */}
            {event.filigrane && (
              <span
                dir="rtl"
                aria-hidden="true"
                className={`font-hebrew pointer-events-none select-none absolute -top-1 right-0 left-0 text-center ${accentText} opacity-[0.07] text-3xl md:text-4xl leading-tight`}
              >
                {event.filigrane}
              </span>
            )}
            <ul className="relative space-y-2">
              {event.programme.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  {i === 0 ? (
                    <Croissant className={`${accentText} shrink-0 mt-1`} size={20} />
                  ) : (
                    <span className="w-5 shrink-0" />
                  )}
                  <span className="text-ink-soft leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {waze && (
          <a
            href={waze}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-2 mt-10 px-7 py-3 rounded-full text-sm uppercase tracking-[0.18em]"
          >
            <Navigation size={16} />
            Itinéraire Waze
          </a>
        )}
      </motion.div>
    </section>
  );
}
