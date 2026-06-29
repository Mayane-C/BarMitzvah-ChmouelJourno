import { CrownOrnament } from '@/components/Ornaments';

/**
 * Bande pleine largeur — intertitre cinématique avec :
 *   ─ double filet doré en haut ─
 *   ─── ♛ ───   (couronne centrée flanquée de courtes lignes dorées)
 *   LABEL
 *   sous-titre italique
 *   ─ double filet doré en bas ─
 *
 * Très différent du look « card » des blocs événement : pleine largeur,
 * sans coin arrondi, doubles filets, ornement central.
 */
export function ZoneBand({
  id,
  label,
  subtitle,
}: {
  id?: string;
  label: string;
  subtitle?: string;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 w-full bg-cream/85 backdrop-blur-md py-9 md:py-12 text-center"
      style={{
        borderTop: '6px double rgba(192, 142, 44, 0.75)',
        borderBottom: '6px double rgba(192, 142, 44, 0.75)',
      }}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="block w-12 md:w-16 h-px bg-sun" />
        <CrownOrnament className="text-sun" size={20} />
        <span className="block w-12 md:w-16 h-px bg-sun" />
      </div>
      <h2 className="font-luxe font-normal text-2xl md:text-4xl tracking-[0.42em] uppercase text-sky-deep">
        {label}
      </h2>
      {subtitle && (
        <p className="font-display italic text-ink-soft/85 text-base md:text-xl mt-2">
          {subtitle}
        </p>
      )}
    </section>
  );
}
