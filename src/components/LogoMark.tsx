import { LOGO, LOGO_VIEWBOX } from '../data/logo';

interface Props {
  className?: string;
  /** Accessible name. Omit for purely decorative use. */
  title?: string;
}

/** The Mindstor AI brain mark as inline SVG, drawn from the shared facet data. */
export function LogoMark({ className, title }: Props) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {LOGO.map((facet, i) => (
        <polygon key={i} fill={facet.color} points={facet.points.map((p) => p.join(',')).join(' ')} />
      ))}
    </svg>
  );
}
