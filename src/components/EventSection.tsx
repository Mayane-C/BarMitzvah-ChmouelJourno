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

/** Deux bougies de Chabbat (icône sur-mesure). */
function CandlesIcon({ className, size = 24, strokeWidth = 1.6 }: IconProps) {
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
      {/* flammes */}
      <path d="M9 3 C 10.3 4.6 10.3 6.2 9 7 C 7.7 6.2 7.7 4.6 9 3 Z" />
      <path d="M15 3 C 16.3 4.6 16.3 6.2 15 7 C 13.7 6.2 13.7 4.6 15 3 Z" />
      {/* corps des bougies */}
      <rect x="8" y="8" width="2" height="10" rx="1" />
      <rect x="14" y="8" width="2" height="10" rx="1" />
      {/* socles */}
      <path d="M6.5 18.5 H 11.5" />
      <path d="M12.5 18.5 H 17.5" />
    </svg>
  );
}

/** Icône de téfilines sur-mesure : boîtier (cube isométrique) posé sur un socle. */
function TefilinIcon({ className, size = 24, strokeWidth = 1.6 }: IconProps) {
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
      {/* socle (slab) */}
      <path d="M3 15 L12 10.5 L21 15 L12 19.5 Z" />
      <path d="M3 15 L3 17 L12 21.5 L12 19.5" />
      <path d="M21 15 L21 17 L12 21.5" />
      {/* boîtier (cube) posé dessus */}
      <path d="M7.5 8 L12 5.5 L16.5 8 L12 10.5 Z" />
      <path d="M7.5 8 L7.5 11.5 L12 14 L12 10.5" />
      <path d="M16.5 8 L16.5 11.5 L12 14 L12 10.5" />
    </svg>
  );
}

const TITLE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  candles: CandlesIcon,
  party: PartyPopper,
  tefilin: TefilinIcon,
};

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
}: {
  id: string;
  event: EventData;
  accent: 'sky' | 'sage';
}) {
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
    <section id={id} className="relative py-20 md:py-28 px-6">
      <motion.div
        className={`max-w-xl mx-auto bg-cream/85 rounded-3xl border-t-2 ${accentBorder} shadow-lg shadow-sky-deep/5 px-8 py-10 md:px-12 md:py-12 text-center`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {TitleIcon && (
          <TitleIcon className={`${accentText} mx-auto mb-3`} size={34} strokeWidth={1.5} />
        )}

        <h2 className="shine-gold font-display text-4xl md:text-5xl mb-3">
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
              <span className="text-ink-soft leading-relaxed">{r.value}</span>
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
