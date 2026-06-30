import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  reflectIntroNarration, reflectCorrectNarration, reflectWrongNarration,
  reflectConfidenceNarration, reflectCertificateNarration,
} from '../utils/narration';

const REFLECT_QUESTIONS = [
  { q: "If you pay with a $5 bill for a $2 apple, how much change should you get?", options: [
    { text: "$3 — Subtract 2 from 5", correct: true, emoji: "🍎" },
    { text: "$2 — Same as the cost", correct: false, emoji: "💵" },
    { text: "$7 — Add 5 and 2", correct: false, emoji: "➕" },
  ]},
  { q: "Which of the following is equivalent to one $10 bill?", options: [
    { text: "Two $5 bills", correct: true, emoji: "💵" },
    { text: "Ten Quarters", correct: false, emoji: "🪙" },
    { text: "Five Dimes", correct: false, emoji: "🪙" },
  ]},
  { q: "How many Quarters make exactly 50 cents?", options: [
    { text: "2 Quarters", correct: true, emoji: "🪙" },
    { text: "4 Quarters", correct: false, emoji: "🪙" },
    { text: "10 Quarters", correct: false, emoji: "🪙" },
  ]},
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I'm great at counting money!", color: '#4caf50' },
  { emoji: '🙂', label: 'I can count most coins & notes!', color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning", color: '#42a5f5' },
];

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const narrationRef = useRef(null);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    if (step === 0 && audioEnabled) {
      narrationRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback((option) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    narrationRef.current?.cancel();
    if (option.correct) {
      setTeachCorrect(c => c + 1);
      sounds.correct();
      if (audioEnabled) narrationRef.current = narrate(reflectCorrectNarration(), true);
    } else {
      sounds.wrong();
      if (audioEnabled) narrationRef.current = narrate(reflectWrongNarration(), true);
    }
    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1);
      }
    }, 1500);
  }, [teachAnswered, teachIdx, audioEnabled]);

  const handleConfidenceSelect = useCallback((idx) => {
    setConfidence(idx);
    sounds.badge();
    setShowConfetti(true);
    narrationRef.current?.cancel();
    if (audioEnabled) narrationRef.current = narrate(reflectCertificateNarration(pct), true);
    setTimeout(() => setStep(2), 1000);
  }, [audioEnabled, pct]);

  useEffect(() => {
    if (step === 1 && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(reflectConfidenceNarration(), true);
    }
  }, [step, audioEnabled]);

  useEffect(() => {
    return () => { narrationRef.current?.cancel(); stopNarration(); };
  }, []);

  // Step 0: Teach the Mascot
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase" style={{ padding: '40px 20px' }}>
        <div className="reflect-header" style={{ marginBottom: 24 }}>
          <h3 className="reflect-label" style={{ background: 'var(--purple-light)' }}>📓 Reflect</h3>
          <p className="reflect-sublabel">Teach the mascot what you learned!</p>
        </div>
        <div className="reflect-card" style={{ maxWidth: 600, width: '100%', margin: '0 auto' }}>
          <div className="reflect-mascot-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <img src="/images/piggy_mascot.png" alt="Mascot" className="mascot thinking" style={{ width: 70, height: 70, background: 'none' }} />
            <div className="speech-bubble" style={{ maxWidth: 320, background: 'var(--bg-card-solid)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>Can you help me? {rq.q}</div>
          </div>
          <div className="reflect-options" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rq.options.map((opt, i) => (
              <button key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)} disabled={teachAnswered}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  borderRadius: '12px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                  cursor: 'pointer', textAlign: 'left', fontSize: '1.05rem', fontWeight: 600
                }}>
                <span className="reflect-option-emoji" style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`} style={{ width: 10, height: 10, borderRadius: '50%' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Confidence
  if (step === 1) {
    return (
      <div className="reflect-phase" style={{ padding: '40px 20px' }}>
        <div className="reflect-card" style={{ maxWidth: 600, width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <h3 className="reflect-card-title" style={{ fontSize: '1.6rem', color: 'white', marginBottom: 8 }}>How do you feel about counting money?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Be honest — every answer is great!</p>
          <div className="confidence-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button key={i} className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)} style={{
                  '--conf-color': c.color, display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '1.1rem'
                }}>
                <span className="confidence-emoji" style={{ fontSize: '2rem' }}>{c.emoji}</span>
                <span className="confidence-label" style={{ fontWeight: 'bold' }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Certificate
  return (
    <div className="reflect-phase" style={{ padding: '40px 20px' }}>
      {showConfetti && (
        <div className="confetti-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`, animationDelay: `${p.delay}s`,
              backgroundColor: p.color, width: p.size, height: p.size,
              animationDuration: `${p.duration}s`, position: 'absolute', top: -10
            }} />
          ))}
        </div>
      )}
      <div className="certificate-card" style={{ maxWidth: 600, width: '100%', margin: '0 auto', textAlign: 'center', padding: '32px 24px' }}>
        <div className="cert-badge" style={{ fontSize: '4rem', marginBottom: 12 }}>🏆</div>
        <h2 className="cert-title" style={{ fontSize: '2rem', color: 'var(--gold)', margin: '0 0 4px' }}>Quest Complete!</h2>
        <p className="cert-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>You restored the Numeralia Treasure Market!</p>
        
        <div className="score-circle" style={{
          width: 130, height: 130, borderRadius: '50%',
          border: '5px solid var(--gold)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          boxShadow: '0 0 20px rgba(255,193,7,0.3)', background: 'rgba(0,0,0,0.2)'
        }}>
          <span className="score-number" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'white' }}>{pct}%</span>
          <span className="score-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{score}/{totalAnswered} Correct</span>
        </div>

        <div style={{ fontSize: '2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{ opacity: i <= Math.ceil(totalStars / 3) ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>

        <div className="cert-stats" style={{ display: 'flex', justifyContent: 'space-around', margin: '24px 0', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>{xp}</div>
            <div className="cert-stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)', fontSize: '1.5rem', fontWeight: 'bold' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Max Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)', fontSize: '1.5rem', fontWeight: 'bold' }}>{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="cert-stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Teaching</div>
          </div>
        </div>

        <div className="mascot-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
          <img src="/images/piggy_mascot.png" alt="Mascot" className="mascot happy" style={{ width: 80, height: 80, background: 'none' }} />
          <div className="speech-bubble" style={{ background: 'var(--bg-card-solid)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', textAlign: 'left' }}>
            {pct >= 80 ? 'Incredible! You are a Master Treasurer! 🏆' : pct >= 50 ? 'Great effort! Keep practicing! 💪' : 'Good start! Try again to improve! 📚'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 32 }}>
          <button className="btn btn-primary btn-lg" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onRestart(); }}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onGoHome(); }}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}