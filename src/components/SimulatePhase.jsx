import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import { speak } from '../utils/audio';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro, simulateAllComplete } from '../utils/narration';
import { Coin, Banknote, COIN_DATA } from './MoneyVisuals';

const STATIONS = [
  { id: 0, title: 'Coin Workshop', subtitle: 'Coin Recognition', icon: '🪙' },
  { id: 1, title: 'Banknote Castle', subtitle: 'Note Features', icon: '🏰' },
  { id: 2, title: 'Counting Stream', subtitle: 'Counting & Value', icon: '🌊' },
];

const COIN_CREATURES = {
  penny: "Hi! I am Penny Pete. I am made of copper and worth 1 cent. Abraham Lincoln is on my front!",
  nickel: "Hello! I am Nickel Nick. I am worth 5 cents. I am silver-colored and Thomas Jefferson is on my front!",
  dime: "Hey there! I am Dime Dana. I am the smallest coin in size, but I am worth 10 cents! Franklin Roosevelt is on my front.",
  quarter: "Greetings! I am Quarter Quinn. I am the largest coin here, worth 25 cents. George Washington is on my front!"
};

// ═══════════════════════════════════════════════════
// STATION 1: Coin Workshop
// ═══════════════════════════════════════════════════
const COIN_LIST = [
  { denom: 'penny', label: 'Penny', val: '1¢' },
  { denom: 'nickel', label: 'Nickel', val: '5¢' },
  { denom: 'dime', label: 'Dime', val: '10¢' },
  { denom: 'quarter', label: 'Quarter', val: '25¢' },
];

function Station1({ audioEnabled, onNext }) {
  const [selectedCoin, setSelectedCoin] = useState('penny');
  const [isFlipped, setIsFlipped] = useState(false);
  const [scaleValue, setScaleValue] = useState(0);
  const [narratingCreature, setNarratingCreature] = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const handleCoinSelect = (denom) => {
    sounds.click();
    setSelectedCoin(denom);
    setIsFlipped(false);
    setScaleValue(0);
    setNarratingCreature(false);
    narRef.current?.cancel();
  };

  const handleFlip = () => {
    sounds.click();
    setIsFlipped(!isFlipped);
  };

  const handleDropScale = () => {
    sounds.ching();
    setScaleValue(COIN_DATA[selectedCoin].value);
  };

  const handleHearCreature = async () => {
    setNarratingCreature(true);
    narRef.current?.cancel();
    await speak(COIN_CREATURES[selectedCoin], audioEnabled, 'encouragement');
    setNarratingCreature(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '6px' }}>🪙 Coin Workshop</h2>
      </div>
      <p style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.5', maxWidth: 680, margin: '0 auto 14px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        Tap a coin to inspect it, flip it over, hear its creature story, or drop it on the value scale!
      </p>

      {/* Coin Selector */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        {COIN_LIST.map(c => (
          <button
            key={c.denom}
            onClick={() => handleCoinSelect(c.denom)}
            style={{
              padding: '8px 18px',
              borderRadius: '14px',
              background: selectedCoin === c.denom 
                ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' 
                : 'rgba(255,255,255,0.08)',
              border: selectedCoin === c.denom 
                ? '2px solid #ffffff' 
                : '1px solid rgba(255,255,255,0.18)',
              color: selectedCoin === c.denom ? '#1a1a2e' : '#ffffff',
              fontSize: '1.05rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: selectedCoin === c.denom ? '0 4px 15px rgba(255, 193, 7, 0.4)' : 'none',
              transform: selectedCoin === c.denom ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {c.label} ({c.val})
          </button>
        ))}
      </div>

      {/* Inspection & Scale Area */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: 14 }}>
        
        {/* Coin Box */}
        <div className="glass-card" style={{ 
          width: 320, 
          height: 290, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justify: 'space-between', 
          padding: '14px 16px', 
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--gold)', letterSpacing: '0.5px' }}>
            🪙 {COIN_DATA[selectedCoin].name} ({COIN_DATA[selectedCoin].value}¢)
          </div>

          <div style={{ perspective: 1000, margin: '6px 0' }}>
            <Coin denomination={selectedCoin} size={120} isFlipped={isFlipped} />
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button 
              className="btn btn-outline" 
              onClick={handleFlip}
              style={{ flex: 1, padding: '8px 8px', fontSize: '0.9rem', fontWeight: '800', borderRadius: '10px', minWidth: 'auto' }}
            >
              🔄 Flip Coin
            </button>
            <button 
              className={`btn ${narratingCreature ? 'btn-outline' : 'btn-primary'}`} 
              onClick={handleHearCreature}
              style={{ flex: 1, padding: '8px 8px', fontSize: '0.9rem', fontWeight: '800', borderRadius: '10px', minWidth: 'auto' }}
            >
              🔊 Talk
            </button>
          </div>
        </div>

        {/* Value Scale */}
        <div className="glass-card" style={{ 
          width: 320, 
          height: 290, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justify: 'space-between', 
          padding: '14px 16px', 
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}>
            <span style={{ fontSize: '1.05rem', color: 'var(--gold)', fontWeight: '800', letterSpacing: '1px' }}>
              ⚖️ VALUE SCALE
            </span>
            <div style={{
              background: scaleValue > 0 ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255,255,255,0.08)',
              border: scaleValue > 0 ? '1px solid #81c784' : '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '3px 14px',
              fontSize: '0.85rem',
              fontWeight: '800',
              color: scaleValue > 0 ? '#81c784' : 'var(--text-secondary)',
              transition: 'all 0.3s ease'
            }}>
              {scaleValue > 0 ? `Measured: ${scaleValue}¢` : 'Drop coin to measure'}
            </div>
          </div>
          
          {/* Scale Ruler Box */}
          <div style={{ 
            width: '100%', 
            height: 140, 
            background: 'rgba(10, 10, 32, 0.75)', 
            borderRadius: 12, 
            overflow: 'hidden', 
            position: 'relative', 
            border: '2px solid rgba(255,255,255,0.18)',
            margin: '6px 0',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)'
          }}>
            {/* Bar Fill */}
            <div style={{
              width: '100%',
              height: `${(scaleValue / 25) * 100}%`,
              background: 'linear-gradient(to top, #ff9800 0%, #ffeb3b 50%, #4caf50 100%)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              boxShadow: scaleValue > 0 ? '0 -4px 15px rgba(76, 175, 80, 0.6)' : 'none',
              transition: 'height 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              {scaleValue > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: '#ffffff',
                  boxShadow: '0 0 8px #ffffff'
                }} />
              )}
            </div>
            
            {/* Marker Lines */}
            {[0, 5, 10, 15, 20, 25].map(tick => {
              const bottomPercent = (tick / 25) * 78 + 11;
              const isCurrent = tick === scaleValue && scaleValue > 0;

              return (
                <div key={tick} style={{
                  position: 'absolute',
                  bottom: `${bottomPercent}%`,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  transform: 'translateY(50%)',
                  pointerEvents: 'none',
                  zIndex: 2
                }}>
                  {/* Left Label Badge */}
                  <span style={{
                    fontSize: isCurrent ? '0.9rem' : '0.82rem',
                    fontWeight: '800',
                    color: isCurrent ? '#ffd54f' : '#ffffff',
                    background: isCurrent ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.65)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: isCurrent ? '1.5px solid #ffd54f' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '0.5px'
                  }}>
                    {tick}¢
                  </span>

                  {/* Tick Line Across */}
                  <div style={{
                    flex: 1,
                    height: '1px',
                    marginLeft: '6px',
                    borderBottom: isCurrent ? '2px dashed #ffd54f' : '1px dashed rgba(255,255,255,0.25)'
                  }} />
                </div>
              );
            })}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleDropScale} 
            style={{ 
              width: '100%',
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: '800',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c5cbf 0%, #4a2c8a 100%)',
              color: '#ffffff',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 15px rgba(124, 92, 191, 0.4)',
              minWidth: 'auto'
            }}
          >
            ⚖️ Drop on Scale
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onNext} style={{ padding: '10px 28px', fontSize: '1.05rem', marginTop: 0 }}>
        Next Station: Banknote Castle →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Banknote Castle
// ═══════════════════════════════════════════════════
const NOTE_HOTSPOTS = {
  1: [
    { x: '10%', y: '15%', title: 'Value Corner', desc: 'The number 1 is in all four corners to easily read the value of the bill.' },
    { x: '50%', y: '50%', title: 'Portrait', desc: 'George Washington, the first President of the United States, is featured in the center oval.' },
    { x: '82%', y: '50%', title: 'Treasury Seal', desc: 'The green seal shows the official emblem of the US Department of the Treasury.' }
  ],
  5: [
    { x: '10%', y: '15%', title: 'Value Corner', desc: 'The number 5 indicates this note is worth five dollars.' },
    { x: '50%', y: '50%', title: 'Portrait', desc: 'Abraham Lincoln, the 16th President of the United States, is pictured here.' },
    { x: '82%', y: '50%', title: 'Security Emblem', desc: 'The Great Seal of the United States is printed on the back and referenced on the front.' }
  ],
  10: [
    { x: '10%', y: '15%', title: 'Value Corner', desc: 'The number 10 means this note is worth ten dollars.' },
    { x: '50%', y: '50%', title: 'Portrait', desc: 'Alexander Hamilton, the first US Secretary of the Treasury, is featured in the center.' },
    { x: '82%', y: '50%', title: 'Security Seal', desc: 'Features a copper-to-green color-shifting ink on the number 10.' }
  ],
  20: [
    { x: '10%', y: '15%', title: 'Value Corner', desc: 'The number 20 indicates a value of twenty dollars.' },
    { x: '50%', y: '50%', title: 'Portrait', desc: 'Andrew Jackson, the 7th President of the United States, is displayed in the center.' },
    { x: '82%', y: '50%', title: 'Security Thread', desc: 'A polymer strip embedded in the paper glows green under ultraviolet light.' }
  ]
};

function Station2({ audioEnabled, onNext }) {
  const [selectedNote, setSelectedNote] = useState(1);
  const [activeFeature, setActiveFeature] = useState(null);
  const narRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const handleNoteSelect = (value) => {
    sounds.click();
    setSelectedNote(value);
    setActiveFeature(null);
  };

  const handleHotspotClick = (spot) => {
    sounds.ching();
    setActiveFeature(spot);
    if (audioEnabled) {
      narRef.current?.cancel();
      narRef.current = narrate([{ text: `${spot.title}: ${spot.desc}`, style: 'emphasis', pause: 0 }], true);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '6px' }}>🏰 Banknote Castle</h2>
      </div>
      <p style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.5', maxWidth: 680, margin: '0 auto 16px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
        Tap a dollar bill note, then click the glowing hotspots to discover portraits and security features!
      </p>

      {/* Note Selector */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
        {[1, 5, 10, 20].map(val => (
          <button
            key={val}
            onClick={() => handleNoteSelect(val)}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: selectedNote === val ? 'var(--purple-light)' : 'rgba(255,255,255,0.06)',
              border: selectedNote === val ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ${val} Bill
          </button>
        ))}
      </div>

      {/* Note Canvas Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 30 }}>
        
        {/* Interactive Bill Panel */}
        <div style={{ position: 'relative', width: 280, height: 140 }}>
          <Banknote denomination={selectedNote} scale={1.5} unfolded={true} showDetails={false} />
          
          {/* Hotspots overlay */}
          {NOTE_HOTSPOTS[selectedNote]?.map((spot, idx) => (
            <div
              key={idx}
              onClick={() => handleHotspotClick(spot)}
              style={{
                position: 'absolute',
                left: spot.x,
                top: spot.y,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'rgba(255, 235, 59, 0.8)',
                border: '2px solid white',
                boxShadow: '0 0 10px #fff',
                cursor: 'pointer',
                animation: 'pulse 1.5s infinite',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            />
          ))}
        </div>

        {/* Feature Detail Board */}
        <div className="glass-card" style={{ maxWidth: 400, width: '100%', minHeight: 90, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
          {activeFeature ? (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h4 style={{ color: 'var(--gold)', margin: '0 0 4px', fontWeight: 'bold' }}>{activeFeature.title}</h4>
              <p style={{ color: '#fff', fontSize: '0.9rem', margin: 0 }}>{activeFeature.desc}</p>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Tap a glowing dot on the banknote above to learn its secrets!
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-primary" onClick={onNext}>
        Next Station: Counting Stream →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: Counting Stream
// ═══════════════════════════════════════════════════
function Station3({ audioEnabled, onComplete }) {
  const [bagTotal, setBagTotal] = useState(0);
  const [streamCoins, setStreamCoins] = useState([]);
  const [bagCoins, setBagCoins] = useState({ penny: 0, nickel: 0, dime: 0, quarter: 0 });
  const [complete, setComplete] = useState(false);
  const narRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  // Spawn coins in the stream
  useEffect(() => {
    if (complete) return;
    const interval = setInterval(() => {
      const types = ['penny', 'nickel', 'dime', 'quarter'];
      const denom = types[Math.floor(Math.random() * types.length)];
      
      const newCoin = {
        id: Math.random().toString(),
        denom,
        x: 100, // percentage from left
        y: 15 + Math.random() * 55, // vertical path in river
        speed: 0.5 + Math.random() * 0.5
      };
      
      setStreamCoins(prev => [...prev, newCoin]);
    }, 1800);

    return () => clearInterval(interval);
  }, [complete]);

  // Move coins along the stream
  useEffect(() => {
    if (complete) return;
    const animateInterval = setInterval(() => {
      setStreamCoins(prev => {
        return prev
          .map(c => ({ ...c, x: c.x - c.speed }))
          .filter(c => c.x > -10); // keep only visible coins
      });
    }, 30);

    return () => clearInterval(animateInterval);
  }, [complete]);

  const handleCatchCoin = (coin) => {
    sounds.ching();
    
    // Add value to bag
    const value = COIN_DATA[coin.denom].value;
    const newTotal = bagTotal + value;
    
    // Update bag totals
    setBagCoins(prev => ({ ...prev, [coin.denom]: prev[coin.denom] + 1 }));
    setBagTotal(newTotal);

    // Remove from stream
    setStreamCoins(prev => prev.filter(c => c.id !== coin.id));

    // Speak running total
    if (audioEnabled) {
      speak(`${newTotal} cents!`, true, 'statement');
    }

    // Check completion target: 100 cents ($1.00)
    if (newTotal >= 100) {
      setComplete(true);
      sounds.badge();
      if (audioEnabled) {
        narRef.current?.cancel();
        narRef.current = narrate(simulateAllComplete(), true);
      }
    }
  };

  const handleReset = () => {
    setBagTotal(0);
    setBagCoins({ penny: 0, nickel: 0, dime: 0, quarter: 0 });
    setStreamCoins([]);
    setComplete(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header">
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '6px' }}>🌊 Counting Stream</h2>
      </div>
      
      {!complete ? (
        <>
          <p style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.5', maxWidth: 680, margin: '0 auto 16px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Tap the floating coins to catch them in your bag. Reach exactly <strong style={{ color: '#ffd54f', textShadow: '0 0 10px rgba(255,213,79,0.5)' }}>100 cents ($1.00)</strong>!
          </p>

          {/* Magical River Canvas */}
          <div style={{
            width: '100%',
            height: 180,
            background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 16
          }}>
            {/* Water Waves animation placeholders */}
            <div className="wave-animation" />

            {/* Render moving coins */}
            {streamCoins.map(coin => (
              <div
                key={coin.id}
                onClick={() => handleCatchCoin(coin)}
                style={{
                  position: 'absolute',
                  left: `${coin.x}%`,
                  top: `${coin.y}%`,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  transition: 'transform 0.1s',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                }}
              >
                <Coin denomination={coin.denom} size={58} showLabel={false} />
              </div>
            ))}
          </div>

          {/* Skip-Counting HUD & Number Line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.6rem' }}>🎒</span>
              <span style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: '#ffd54f', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Total: {bagTotal}¢ / 100¢
              </span>
            </div>
            <button className="btn btn-xs btn-outline" onClick={handleReset} style={{ fontSize: '0.9rem', padding: '6px 16px', fontWeight: '700' }}>Reset Bag</button>
          </div>

          {/* Visual Progress Bar / Number Line */}
          <div style={{ width: '100%', height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.18)', overflow: 'hidden', position: 'relative', marginBottom: 16 }}>
            <div style={{
              width: `${Math.min(bagTotal, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4caf50, #81c784)',
              transition: 'width 0.3s ease-out'
            }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
              {Math.min(bagTotal, 100)}%
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '30px 0', animation: 'bounceIn 0.6s' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>💰</div>
          <h2 style={{ color: 'var(--green)' }}>Spell Broken!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 24px' }}>
            Excellent skip-counting! You collected exactly 100 cents (1 dollar) and fed the Enchanted Piggy Bank!
          </p>

          <button className="btn btn-green btn-lg" onClick={onComplete}>
            🏆 Complete Challenge!
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Main SimulatePhase
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase" style={{ padding: '50px 16px 10px' }}>
      <div className="simulate-header" style={{ marginBottom: 6 }}>
        <h3 className="simulate-label" style={{ background: 'var(--purple-light)', margin: 0 }}>🧪 Simulate</h3>
        <p className="simulate-sublabel" style={{ margin: 0 }}>Explore and discover — no wrong answers!</p>
      </div>
      
      {/* Progress Dots */}
      <div className="progress-dots" style={{ marginBottom: 10 }}>
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label" style={{ fontSize: '1rem' }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Main Glass Card Display */}
      <div className="glass-card" style={{ maxWidth: 860, width: '100%', animation: 'slideUp 0.4s ease', margin: '0 auto', padding: '18px 24px' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}