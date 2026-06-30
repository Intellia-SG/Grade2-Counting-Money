import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "Why do some small coins (like Dimes) have a larger value than bigger coins (like Nickels)?",
    subtext: "Coins have values based on their metal history, not just their size!",
    emoji: "🪙",
    bgEmojis: ["🪙", "💵", "✨", "🔢"],
  },
  {
    question: "Why do we use paper banknotes instead of carrying hundreds of heavy gold and silver coins?",
    subtext: "Paper money is lightweight and makes it easy to carry large values!",
    emoji: "💵",
    bgEmojis: ["💵", "👛", "👑", "✨"],
  },
  {
    question: "Is four quarters the exact same amount of money as a one-dollar bill?",
    subtext: "Four quarters adds up to 100 cents, which equals one dollar!",
    emoji: "🇺🇸",
    bgEmojis: ["🪙", "💵", "🇺🇸", "✨"],
  },
  {
    question: "How does a shopkeeper know exactly how much change to give you back?",
    subtext: "They subtract the cost of the item from the money you paid!",
    emoji: "🏪",
    bgEmojis: ["🏪", "🧾", "💰", "✨"],
  },
  {
    question: "Can you buy something that costs 75 cents if you only have dimes and nickels?",
    subtext: "Yes! There are many different ways to combine coins to make the same value!",
    emoji: "🛍️",
    bgEmojis: ["🛍️", "🪙", "🧮", "✨"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(wonder.question, wonder.subtext),
        true
      );
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 3000);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <img src="/images/piggy_mascot.png" alt="Mascot" className="mascot thinking" style={{ background: 'none' }} />
          <div className="speech-bubble wonder-bubble" style={{ background: 'var(--bg-card-solid)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}