import { useMemo } from 'react';

const MONEY_SYMBOLS = ['🪙', '💵', '💰', '1¢', '5¢', '10¢', '25¢', '$1', '$5', '$10'];
const COUNT = 18;

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      value: MONEY_SYMBOLS[i % MONEY_SYMBOLS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1.2 + Math.random() * 1.8}rem`,
      opacity: 0.06 + Math.random() * 0.1,
    })), []);

  return (
    <div className="floating-numbers">
      {items.map((n, i) => (
        <span key={i} className="floating-number" style={{
          left: n.left,
          animationDelay: n.delay,
          animationDuration: n.duration,
          fontSize: n.size,
          opacity: n.opacity,
        }}>
          {n.value}
        </span>
      ))}
    </div>
  );
}
