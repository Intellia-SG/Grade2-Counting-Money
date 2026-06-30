import React, { useState, useCallback, useEffect } from 'react';
import { Coin, BillChip, Wallet } from './MoneyVisuals';

// ─── Visual area shown above the question options ─────────────────────────────
function Visual({ question }) {
  if (!question.visual) return null;

  const containerStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    flexWrap: 'wrap', gap: 10,
    margin: '14px 0',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.08)',
  };

  // Single highlighted coin
  if (question.visual === 'coin' && question.coinType) {
    return (
      <div style={containerStyle}>
        <Coin denomination={question.coinType} size={100} animated />
      </div>
    );
  }

  // Single highlighted note
  if (question.visual === 'note' && question.noteType) {
    return (
      <div style={containerStyle}>
        <BillChip denomination={question.noteType} />
      </div>
    );
  }

  // Multiple coins spread out
  if (question.visual === 'coins_collection' && question.coins) {
    return (
      <div style={containerStyle}>
        {Object.entries(question.coins).map(([denom, count]) =>
          Array.from({ length: count }).map((_, i) => (
            <Coin key={`${denom}-${i}`} denomination={denom} size={62} />
          ))
        )}
      </div>
    );
  }

  // Multiple bills — use BillChip: always clean and readable
  if (question.visual === 'notes_collection' && question.notes) {
    return (
      <div style={containerStyle}>
        {Object.entries(question.notes).map(([denom, count]) =>
          Array.from({ length: count }).map((_, i) => (
            <BillChip key={`${denom}-${i}`} denomination={Number(denom)} />
          ))
        )}
      </div>
    );
  }

  // Mixed notes + coins
  if (question.visual === 'mixed_collection') {
    return (
      <div style={{ ...containerStyle, flexDirection: 'column', gap: 10 }}>
        {question.notes && Object.keys(question.notes).length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(question.notes).map(([denom, count]) =>
              Array.from({ length: count }).map((_, i) => (
                <BillChip key={`n-${denom}-${i}`} denomination={Number(denom)} />
              ))
            )}
          </div>
        )}
        {question.coins && Object.keys(question.coins).length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(question.coins).map(([denom, count]) =>
              Array.from({ length: count }).map((_, i) => (
                <Coin key={`c-${denom}-${i}`} denomination={denom} size={50} />
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Two wallets side-by-side (comparison questions)
  if (question.visual === 'compare_wallets' && question.walletA && question.walletB) {
    return (
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'stretch', margin: '14px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: 1 }}>WALLET A</span>
          <Wallet coins={question.walletA.coins} notes={question.walletA.notes} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>VS</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: 1 }}>WALLET B</span>
          <Wallet coins={question.walletB.coins} notes={question.walletB.notes} />
        </div>
      </div>
    );
  }

  return null;
}

// ─── Main Question Renderer ───────────────────────────────────────────────────
export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => { setSelectedOption(null); }, [question]);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setTimeout(() => { onAnswer(isCorrect); }, 550);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      {/* World badge pill */}
      <div style={{
        display: 'inline-block',
        background: 'var(--purple-light)',
        color: 'white', padding: '5px 14px',
        borderRadius: 999, fontSize: '0.8rem',
        fontWeight: 700, marginBottom: 14,
        letterSpacing: '0.5px', textTransform: 'uppercase',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}>
        🪙 Money Quest
      </div>

      {/* Question text */}
      <p className="question-text" style={{ fontSize: '1.25rem', color: '#fff', lineHeight: 1.5, textShadow: '0 1px 3px rgba(0,0,0,0.5)', margin: '0 0 4px' }}>
        {question.questionText}
      </p>

      {/* Visual aid */}
      <Visual question={question} />

      {/* Answer options */}
      {question.options && (
        <div className="options-grid" style={{ marginTop: 14 }}>
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleOptionClick(opt)}
                style={{
                  padding: '14px 10px',
                  fontSize: '1.1rem',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.18s ease',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
