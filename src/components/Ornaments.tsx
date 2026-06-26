/**
 * Mini-couronne pour les dividers — réutilise la VRAIE couronne du logo
 * CHMOUEL (logo-chmouel-crown.png) plutôt qu'une silhouette stylisée,
 * pour garantir la fidélité visuelle au brand.
 */
export function CrownOrnament({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/images/logo-chmouel-crown.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round((size * 2) / 3)}
      draggable={false}
      className={`select-none ${className ?? ''}`}
      style={{ width: size, height: 'auto' }}
    />
  );
}
