/**
 * Mini-ornement « couronne » — silhouette stylisée à 3 pics + base,
 * pensé pour les dividers (entre le logo CHMOUEL et la couronne de l'annonce).
 * Hérite la couleur via currentColor.
 */
export function CrownOrnament({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  const w = size;
  const h = (size * 12) / 18;
  return (
    <svg
      viewBox="0 0 18 12"
      width={w}
      height={h}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Pics et base de la couronne */}
      <path d="M1 5 L 3 8 L 5 5 L 9 1 L 13 5 L 15 8 L 17 5 L 16 10 L 2 10 Z" />
      {/* Bandeau */}
      <rect x="0.5" y="10" width="17" height="1.2" />
      {/* Joyaux : 3 petits points sur les pics */}
      <circle cx="3" cy="6" r="0.6" />
      <circle cx="9" cy="2.2" r="0.8" />
      <circle cx="15" cy="6" r="0.6" />
    </svg>
  );
}
