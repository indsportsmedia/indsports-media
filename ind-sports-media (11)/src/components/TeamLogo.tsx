import { useState } from 'react';

/**
 * School logo with a clean fallback: if there's no logo (or it fails to load),
 * shows the school's initials on its team color instead of a broken image.
 * Logos come from the Schools library (Newsroom → Schools), matched by name.
 */
export default function TeamLogo({
  name,
  url,
  color,
  className = 'w-8 h-8',
  textClass = 'text-xs',
}: {
  name: string;
  url?: string;
  color?: string;
  className?: string;
  textClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return <img src={url} alt={name} onError={() => setFailed(true)} className={`${className} object-contain shrink-0`} />;
  }
  const initials = name
    .replace(/\b(high school|hs|the)\b/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span
      role="img"
      aria-label={name}
      className={`${className} ${textClass} shrink-0 rounded-sm flex items-center justify-center font-display font-semibold text-white`}
      style={{ backgroundColor: color && color !== '#000000' ? color : '#262A2F' }}
    >
      {initials || '?'}
    </span>
  );
}
