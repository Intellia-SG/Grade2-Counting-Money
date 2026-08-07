import { useMemo } from 'react';

const MONEY_ITEMS = ['🪙', '💵', '💰', '1¢', '5¢', '10¢', '25¢', '$1', '$5', '$10', '50¢', '$20'];
const COUNT = 28;

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      value: MONEY_ITEMS[i % MONEY_ITEMS.length],
      left: `${(i / COUNT) * 96 + (Math.random() * 4)}%`,
      delay: `${Math.random() * 18}s`,
      duration: `${14 + Math.random() * 16}s`,
      size: `${1.3 + Math.random() * 1.7}rem`,
      color: i % 3 === 0 ? 'rgba(255, 213, 79, 0.28)' : i % 3 === 1 ? 'rgba(129, 199, 132, 0.28)' : 'rgba(255, 255, 255, 0.22)',
    })), []);

  return (
    <div className="floating-numbers">
      {items.map((n, i) => (
        <span key={i} className="floating-number" style={{
          left: n.left,
          animationDelay: n.delay,
          animationDuration: n.duration,
          fontSize: n.size,
          color: n.color,
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.15))'
        }}>
          {n.value}
        </span>
      ))}
    </div>
  );
}
