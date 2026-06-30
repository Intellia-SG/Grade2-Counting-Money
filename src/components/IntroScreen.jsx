import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A money-value mystery!' },
  { icon: '📖', label: 'Story', desc: 'Emma\'s market adventure' },
  { icon: '🧪', label: 'Simulate', desc: 'Interactive workshop & castle' },
  { icon: '🎮', label: 'Play', desc: '5-World mathematical quest' },
  { icon: '📓', label: 'Reflect', desc: 'Print your Treasurer Certificate' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen" style={{ padding: '32px 24px 20px' }}>
      {/* Curriculum badge */}
      <div className="intro-badge" style={{ background: 'rgba(255, 193, 7, 0.15)', color: 'var(--gold)', border: '1px solid rgba(255, 193, 7, 0.3)', marginBottom: '4px' }}>
        ✨ · Grade 2 Mathematics
      </div>

      {/* Title */}
      <h1 className="intro-title" style={{ color: 'var(--gold)', marginBottom: 8 }}>
        Counting Money
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 0, fontFamily: 'var(--font-display)' }}>
        Interactive Math Learning Journey
      </p>

      {/* Mascot */}
      <div className="mascot-container" style={{ margin: '12px 0', gap: 12 }}>
        <img src="/images/piggy_mascot.png" alt="Mascot" className="mascot" style={{ width: 64, height: 64, background: 'none' }} />
        <div className="speech-bubble" style={{ background: 'var(--bg-card-solid)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', fontSize: '0.9rem' }}>
          Let's count some coins and notes! 🪙
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc" style={{ maxWidth: 600, fontSize: '0.95rem', margin: '4px 0 12px' }}>
        Help <strong style={{ color: 'var(--gold)' }}>Emma</strong> restore the magical <strong style={{ color: 'var(--coral)' }}>Treasure Market of Numeralia</strong> by learning how to recognize coins, skip-count banknotes, and pay exact amounts!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map" style={{ maxWidth: 700, padding: '12px 20px', marginTop: 8 }}>
        <h3 className="intro-journey-title" style={{ marginBottom: 12, fontSize: '0.8rem' }}>Your Quest Path</h3>
        <div className="intro-journey-steps" style={{ gap: 8 }}>
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step" style={{ gap: 6 }}>
              <div className="intro-journey-icon" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', width: 32, height: 32, fontSize: '1.2rem' }}>{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label" style={{ fontSize: '0.75rem' }}>{p.label}</div>
                <div className="intro-journey-desc" style={{ fontSize: '0.6rem' }}>{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow" style={{ margin: '0 2px', fontSize: '0.7rem' }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn" style={{ margin: '12px 0', padding: '14px 36px', fontSize: '1.15rem' }}>
        🚀 Begin Your Quest!
      </button>

      {/* Feature cards */}
      <div className="feature-cards" style={{ marginTop: 12, gap: 12 }}>
        <div className="feature-card" style={{ padding: '12px 20px', minWidth: 120 }}>
          <div className="feature-card-icon" style={{ fontSize: '1.6rem', marginBottom: 4 }}>🪙</div>
          <div className="feature-card-label" style={{ fontSize: '0.8rem' }}>Coin Workshop</div>
        </div>
        <div className="feature-card" style={{ padding: '12px 20px', minWidth: 120 }}>
          <div className="feature-card-icon" style={{ fontSize: '1.6rem', marginBottom: 4 }}>💸</div>
          <div className="feature-card-label" style={{ fontSize: '0.8rem' }}>Banknote Castle</div>
        </div>
        <div className="feature-card" style={{ padding: '12px 20px', minWidth: 120 }}>
          <div className="feature-card-icon" style={{ fontSize: '1.6rem', marginBottom: 4 }}>🏪</div>
          <div className="feature-card-label" style={{ fontSize: '0.8rem' }}>Shopping Festival</div>
        </div>
      </div>
    </div>
  );
}