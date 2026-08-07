import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { generateSessionQuestions } from '../utils/questionBank';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { playWorldIntro, playReadQuestion, playCorrectNarration, playWrongNarration, playWorldComplete } from '../utils/narration';
import QuestionRenderer from './QuestionRenderer';

const WORLDS = [
  { id: 0, name: 'Coin Forest', icon: '🌲', color: '#2e7d32', desc: 'Coin Recognition' },
  { id: 1, name: 'Counting Stream', icon: '🌊', color: '#1565c0', desc: 'Counting Coins' },
  { id: 2, name: 'Note Mountains', icon: '⛰️', color: '#6a1b9a', desc: 'Note Recognition' },
  { id: 3, name: 'Shopping Festival', icon: '🎪', color: '#e65100', desc: 'Mixed Money & Shopping' },
  { id: 4, name: 'Treasure Checkout', icon: '🏆', color: '#c62828', desc: 'Making Change' },
];

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const narrationRef = useRef(null);
  const [worldQuestions, setWorldQuestions] = useState([]);

  const q = worldQuestions[qIndex];

  useEffect(() => {
    if (audioEnabled && q && !worldComplete && !feedback && currentWorld >= 0) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(playReadQuestion(q.questionText), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [qIndex, audioEnabled, q, worldComplete, feedback, currentWorld]);

  const startWorld = useCallback((worldId) => {
    const bank = generateSessionQuestions();
    const filtered = bank.filter(q => q.world === worldId);
    setWorldQuestions(filtered);
    setCurrentWorld(worldId);
    setQIndex(0); setScore(0); setLives(3); setStreak(0);
    setWorldComplete(false); setFeedback(null); setAnswered(false);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldIntro(WORLDS[worldId].name), true);
    }
  }, [audioEnabled]);

  const finishWorld = useCallback(() => {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    sounds.badge();
    setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
    setWorldComplete(true);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(w.name, score, worldQuestions.length), true);
    }
  }, [currentWorld, score, audioEnabled, worldQuestions.length]);

  const backToMap = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    setCurrentWorld(-1); setWorldComplete(false); setFeedback(null);
  }, []);

  const handleAllComplete = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0) + score;
    const totalQ = Object.values(worldResults).reduce((a, r) => a + r.total, 0) + (worldQuestions.length || 0);
    onComplete({
      score: totalScore, xp: totalXP, maxStreak,
      totalAnswered: totalQ,
      worldResults: { ...worldResults, [currentWorld]: { score, total: worldQuestions.length, stars: calcStars(score, worldQuestions.length) } },
    });
  }, [worldResults, score, totalXP, maxStreak, worldQuestions, currentWorld, onComplete]);

  const advance = useCallback(() => {
    setFeedback(null); setAnswered(false);
    if (qIndex + 1 < worldQuestions.length && lives > 0) {
      setQIndex(i => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, lives, finishWorld]);

  const handleAnswer = useCallback((isCorrect) => {
    setAnswered(true);
    narrationRef.current?.cancel();
    if (isCorrect) {
      const ns = streak + 1;
      const earned = calcXP(1, ns);
      setScore(s => s + 1); setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      setTotalXP(x => x + earned);
      sounds.correct();
      if (ns >= 5 && ns % 5 === 0) sounds.streak();
      setXpPopup(`+${earned} XP`);
      setTimeout(() => setXpPopup(null), 1500);
      setFeedback({ type: 'correct', message: ns >= 5 ? `🔥 ${ns} Streak!` : 'Correct! 🎉', sub: q.explanation });
      if (audioEnabled) {
        narrationRef.current = narrate(playCorrectNarration(ns), true);
      }
      setTimeout(advance, 1800);
    } else {
      setStreak(0); setLives(l => l - 1);
      sounds.wrong();
      setFeedback({ type: 'wrong', message: 'Not quite! 🤔', sub: q.explanation });
      if (audioEnabled) {
        narrationRef.current = narrate(playWrongNarration(), true);
      }
      if (lives - 1 <= 0) setTimeout(finishWorld, 2000);
      else setTimeout(advance, 2000);
    }
  }, [streak, q, advance, lives, finishWorld, audioEnabled]);

  // ─── World Map ───────────────────────────────────
  if (currentWorld < 0) {
    const allDone = WORLDS.every((_, i) => worldResults[i]);
    return (
      <div className="play-phase" style={{ padding: '40px 20px' }}>
        <div className="play-header">
          <h2 className="play-title">🎮 Practice Quest!</h2>
          <p className="play-subtitle">Complete each practice world to unlock the next one. Earn stars and XP!</p>
          {totalXP > 0 && <div className="play-xp-badge" style={{ background: 'var(--gold)', color: 'black', padding: '6px 20px', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block', marginTop: 8 }}>⭐ {totalXP} XP</div>}
        </div>
        <div className="world-map" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, padding: '20px 0', width: '100%', maxWidth: 860 }}>
          {WORLDS.map((w, i) => {
            const unlocked = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div key={w.id} className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{
                  '--world-color': w.color,
                  borderRadius: '20px',
                  background: unlocked ? `linear-gradient(135deg, ${w.color}cc 0%, ${w.color}88 100%)` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${unlocked ? w.color : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '20px 12px', cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.5, transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: unlocked ? `0 6px 20px ${w.color}44` : 'none',
                  position: 'relative', minHeight: 170
                }}>
                {!unlocked && <div className="world-lock" style={{ position: 'absolute', top: 8, right: 8, fontSize: '1rem' }}>🔒</div>}
                <div className="world-icon" style={{ fontSize: '2.5rem' }}>{w.icon}</div>
                <div className="world-name" style={{ fontWeight: 'bold', color: 'white', textAlign: 'center', fontSize: '0.95rem' }}>{w.name}</div>
                <div className="world-desc" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{w.desc}</div>
                {completed && (
                  <div className="world-stars" style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3].map(s => (<span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2, fontSize: '1.1rem' }}>⭐</span>))}
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>{completed.score}/{completed.total}</span>
                  </div>
                )}
                {unlocked && !completed && <div className="world-play-btn" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>▶ PRACTICE</div>}
              </div>
            );
          })}
        </div>
        {allDone && (
          <button className="btn btn-green btn-lg" onClick={handleAllComplete} style={{ marginTop: 24, animation: 'bounceIn 0.5s ease' }}>
            🏆 Complete Quest!
          </button>
        )}
      </div>
    );
  }

  // ─── World Complete ──────────────────────────────
  if (worldComplete) {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    const isLastWorld = currentWorld === WORLDS.length - 1;
    return (
      <div className="play-phase" style={{ padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="world-complete-card" style={{
          background: `linear-gradient(135deg, ${w.color}99, ${w.color}44)`,
          border: `2px solid ${w.color}`, borderRadius: '24px',
          padding: '40px 32px', textAlign: 'center', maxWidth: 440, width: '100%',
          boxShadow: `0 10px 30px ${w.color}33`, animation: 'bounceIn 0.6s'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{w.icon}</div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 8px' }}>{w.name} Complete!</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: '12px 0' }}>{score}/{worldQuestions.length}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
            {[1, 2, 3].map(s => (
              <span key={s} style={{ fontSize: '2rem', opacity: s <= stars ? 1 : 0.2, animation: s <= stars ? `bounceIn ${s * 0.2 + 0.2}s ease` : 'none' }}>⭐</span>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>⭐ {totalXP} XP earned total</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap}>← World Map</button>
            {isLastWorld ? (
              <button className="btn btn-green" onClick={handleAllComplete}>🏆 Finish Quest!</button>
            ) : (
              <button className="btn btn-primary" onClick={() => {
                setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
                startWorld(currentWorld + 1);
              }}>Next World →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Question View ───────────────────────────────
  if (!q) return null;
  const w = WORLDS[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="play-phase" style={{ padding: '20px' }}>
      {/* World badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, background: w.color,
        color: 'white', padding: '6px 18px', borderRadius: '20px', fontWeight: 'bold',
        fontSize: '0.9rem', marginBottom: 12, boxShadow: `0 4px 12px ${w.color}66`
      }}>
        {w.icon} {w.name}
      </div>

      {/* HUD */}
      <div className="hud" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '1rem' }}>⭐ {totalXP} XP</div>
        <div className="hearts" style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: 3 }, (_, i) => (<span key={i} style={{ opacity: i < lives ? 1 : 0.2, fontSize: '1.2rem' }}>❤️</span>))}
        </div>
        <div style={{ fontWeight: 'bold', color: streak >= 5 ? 'var(--coral)' : 'var(--text-secondary)', fontSize: '1rem' }}>
          🔥 {streak}x
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Question {qIndex + 1}/{worldQuestions.length}</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--coral))', transition: 'width 0.4s ease', borderRadius: 4 }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card glass-card" style={{ animation: 'slideUp 0.3s ease', maxWidth: 700, width: '100%', margin: '0 auto' }}>
        <QuestionRenderer question={q} onAnswer={handleAnswer} disabled={answered} />
      </div>

      {/* XP Popup - small floating badge top-right */}
      {xpPopup && <div style={{
        position: 'fixed', top: 72, right: 20,
        background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
        color: '#1a1a2e', padding: '6px 16px', borderRadius: '999px',
        fontWeight: 800, fontSize: '0.95rem',
        animation: 'floatUp 1.5s ease forwards',
        zIndex: 400, pointerEvents: 'none',
        boxShadow: '0 4px 14px rgba(255,193,7,0.5)',
        whiteSpace: 'nowrap'
      }}>{xpPopup}</div>}

      {/* Feedback Overlay */}
      {feedback && (
        <div className="feedback-overlay" style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', zIndex: 50, backdropFilter: 'blur(4px)'
        }}>
          <div className={`feedback-content ${feedback.type}`} style={{
            background: feedback.type === 'correct' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)',
            borderRadius: '24px', padding: '32px 40px', textAlign: 'center', maxWidth: 460,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'bounceIn 0.4s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>{feedback.type === 'correct' ? '🎉' : '😢'}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: 8 }}>{feedback.message}</div>
            <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}