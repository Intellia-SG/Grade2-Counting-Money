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
      <div className="station-header"><h2>🪙 Coin Workshop</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        Tap a coin to inspect it, flip it over, hear its creature story, or drop it on the value scale!
      </p>

      {/* Coin Selector */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
        {['penny', 'nickel', 'dime', 'quarter'].map(denom => (
          <button
            key={denom}
            onClick={() => handleCoinSelect(denom)}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: selectedCoin === denom ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
              border: selectedCoin === denom ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
              color: selectedCoin === denom ? 'black' : 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {denom}
          </button>
        ))}
      </div>

      {/* Inspection Area */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 30 }}>
        
        {/* Coin Box */}
        <div className="glass-card" style={{ width: 220, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ perspective: 1000 }}>
            <Coin denomination={selectedCoin} size={110} isFlipped={isFlipped} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm btn-outline" onClick={handleFlip}>🔄 Flip Coin</button>
            <button className={`btn btn-sm ${narratingCreature ? 'btn-outline' : 'btn-primary'}`} onClick={handleHearCreature}>
              🔊 Talk
            </button>
          </div>
        </div>

        {/* Value Scale */}
        <div className="glass-card" style={{ width: 220, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px', background: 'rgba(255,255,255,0.03)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>VALUE SCALE</span>
          
          <div style={{ width: '100%', height: 120, background: 'rgba(0,0,0,0.3)', borderRadius: 8, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Bar Fill */}
            <div style={{
              width: '100%',
              height: `${scaleValue * 4}%`,
              background: 'linear-gradient(to top, var(--gold), var(--coral))',
              position: 'absolute',
              bottom: 0,
              left: 0,
              transition: 'height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }} />
            
            {/* Marker Lines */}
            {[5, 10, 15, 20, 25].map(tick => (
              <div key={tick} style={{
                position: 'absolute',
                bottom: `${tick * 4}%`,
                left: 0,
                width: '100%',
                height: 1,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 4,
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.5)'
              }}>
                {tick}¢
              </div>
            ))}
          </div>

          <button className="btn btn-sm btn-outline" onClick={handleDropScale} style={{ width: '100%' }}>
            ⚖️ Drop on Scale
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onNext}>
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
      <div className="station-header"><h2>🏰 Banknote Castle</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
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
      <div className="station-header"><h2>🌊 Counting Stream</h2></div>
      
      {!complete ? (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
            Tap the floating coins to catch them in your bag. Reach exactly <strong style={{ color: 'var(--gold)' }}>100 cents ($1.00)</strong>!
          </p>

          {/* Magical River Canvas */}
          <div style={{
            width: '100%',
            height: 180,
            background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 20
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
                  transition: 'transform 0.1s'
                }}
              >
                <Coin denomination={coin.denom} size={50} showLabel={false} />
              </div>
            ))}
          </div>

          {/* Skip-Counting HUD & Number Line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>🎒</span>
              <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
                Total: {bagTotal}¢ / 100¢
              </span>
            </div>
            <button className="btn btn-xs btn-outline" onClick={handleReset}>Reset Bag</button>
          </div>

          {/* Visual Progress Bar / Number Line */}
          <div style={{ width: '100%', height: 24, background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
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
    <div className="simulate-phase" style={{ padding: '40px 20px' }}>
      <div className="simulate-header">
        <h3 className="simulate-label" style={{ background: 'var(--purple-light)' }}>🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — no wrong answers!</p>
      </div>
      
      {/* Progress Dots */}
      <div className="progress-dots" style={{ marginBottom: 30 }}>
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label" style={{ fontSize: '1.2rem' }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Main Glass Card Display */}
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease', margin: '0 auto' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}