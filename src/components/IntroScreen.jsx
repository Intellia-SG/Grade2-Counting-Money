import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const PHASE_CARDS = [
  { icon: '🧐', title: 'Wonder', desc: 'A math mystery!' },
  { icon: '📖', title: 'Story', desc: 'The market quest' },
  { icon: '🧪', title: 'Simulate', desc: '3 Station Sandbox' },
  { icon: '🎮', title: 'Practice', desc: '5 World challenges' },
  { icon: '📓', title: 'Reflect', desc: 'Quiz & Certificate' },
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
    <div className="intro-screen" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justify: 'center', 
      minHeight: '100vh', 
      padding: '40px 20px 20px', 
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      
      {/* Top Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 20px',
        borderRadius: '50px',
        background: 'rgba(124, 92, 191, 0.25)',
        border: '1.5px solid rgba(179, 157, 219, 0.4)',
        color: '#ffd54f',
        fontSize: '0.85rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        marginBottom: 10
      }}>
        <span>✨</span> Grade 2 Math
      </div>

      {/* Main Title */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)',
        fontWeight: '800',
        color: '#ffc107',
        lineHeight: '1.1',
        marginBottom: 6,
        textShadow: '0 0 30px rgba(255, 193, 7, 0.5), 0 4px 12px rgba(0, 0, 0, 0.6)',
        letterSpacing: '0.5px'
      }}>
        Counting Money
      </h1>

      {/* Subtitle */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        fontWeight: '800',
        color: '#ff7043',
        marginTop: 0,
        marginBottom: 16,
        textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
      }}>
        Coins, Banknotes & Value Sense!
      </p>

      {/* Goal / Speech Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '18px',
        padding: '12px 28px',
        maxWidth: 620,
        width: '100%',
        margin: '0 auto 24px',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#ffffff',
        lineHeight: '1.5',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        Let's master recognizing coins, skip-counting banknotes, and paying exact amounts! 🪙
      </div>

      {/* 5 Phase Cards Grid */}
      <div style={{
        display: 'flex',
        justify: 'center',
        gap: 10,
        flexWrap: 'nowrap',
        maxWidth: 780,
        width: '100%',
        margin: '0 auto 20px'
      }}>
        {PHASE_CARDS.map((c, i) => (
          <div
            key={i}
            className="intro-phase-card"
            style={{
              flex: '1 1 0',
              minWidth: 105,
              height: 125,
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: 4,
              padding: '12px 6px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div style={{ fontSize: '2rem', lineHeight: 1 }}>{c.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: '800', color: '#ffffff' }}>
              {c.title}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>
              {c.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={handleStart}
        id="start-journey-btn"
        className="intro-cta-btn"
        style={{
          padding: '16px 48px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
          color: '#1a1a2e',
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: '800',
          border: '2px solid #ffffff',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(255, 193, 7, 0.5), 0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          margin: '0 auto 24px'
        }}
      >
        🚀 Begin Your Quest!
      </button>

      {/* Bottom Badge Pills */}
      <div style={{
        display: 'flex',
        justify: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '6px 18px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          🎯 100 Questions
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '6px 18px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          🪙 Coins & Banknotes
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '6px 18px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          🏆 Badges & XP
        </div>
      </div>
    </div>
  );
}