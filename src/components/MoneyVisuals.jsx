import React from 'react';

// Coin styles based on denomination
export const COIN_DATA = {
  penny:   { value: 1,  name: 'Penny',   label: '1¢',  color: 'linear-gradient(145deg, #e8a87c 0%, #c4652d 60%, #8c3b1a 100%)', size: 65, border: '#a04828' },
  nickel:  { value: 5,  name: 'Nickel',  label: '5¢',  color: 'linear-gradient(145deg, #e0e0e0 0%, #bdbdbd 60%, #757575 100%)', size: 75, border: '#9e9e9e' },
  dime:    { value: 10, name: 'Dime',    label: '10¢', color: 'linear-gradient(145deg, #eeeeee 0%, #bdbdbd 60%, #757575 100%)', size: 60, border: '#9e9e9e' },
  quarter: { value: 25, name: 'Quarter', label: '25¢', color: 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 60%, #9e9e9e 100%)', size: 85, border: '#bdbdbd' },
};

export const NOTE_DATA = {
  1:  { value: 1,  name: '$1',  color: '#558b2f', light: '#7cb342', portrait: 'Washington' },
  5:  { value: 5,  name: '$5',  color: '#2e7d32', light: '#43a047', portrait: 'Lincoln'    },
  10: { value: 10, name: '$10', color: '#00695c', light: '#00897b', portrait: 'Hamilton'   },
  20: { value: 20, name: '$20', color: '#1565c0', light: '#1e88e5', portrait: 'Jackson'    },
};

// ─── Coin ────────────────────────────────────────────────────────────────────
export function Coin({ denomination, size: customSize, onClick, showLabel = true, isFlipped = false, animated = false, style }) {
  const coin = COIN_DATA[denomination?.toLowerCase()] || COIN_DATA.penny;
  const size = customSize || coin.size;

  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: coin.color,
        border: `3px double ${coin.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.45), inset 0 2px 5px rgba(255,255,255,0.45)',
        display: 'inline-flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none', flexShrink: 0,
        transition: 'transform 0.3s ease, box-shadow 0.2s ease',
        transform: `rotateY(${isFlipped ? 180 : 0}deg) ${style?.transform || ''}`,
        position: 'relative', ...style,
      }}
      className={animated ? 'pulse' : ''}
    >
      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.28)', pointerEvents: 'none' }} />
      <div style={{
        transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.7)',
        fontWeight: 'bold', fontSize: size * 0.22,
        fontFamily: 'var(--font-display)', textAlign: 'center', lineHeight: 1.1,
      }}>
        {isFlipped ? (
          <><span style={{ fontSize: '0.85em', opacity: 0.8 }}>TAILS</span></>
        ) : (
          <>
            {showLabel && <span>{coin.label}</span>}
            {size >= 50 && <span style={{ fontSize: '0.52em', opacity: 0.85, fontWeight: 500 }}>{coin.name}</span>}
          </>
        )}
      </div>
    </div>
  );
}

// ─── BillChip — clean flat bill for question visuals ─────────────────────────
// This is the primary component used in question card visuals.
// It renders a clear, readable denomination chip instead of a tiny complex bill.
export function BillChip({ denomination, count = 1 }) {
  const note = NOTE_DATA[denomination] || NOTE_DATA[1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 88, height: 46,
            background: `linear-gradient(135deg, ${note.light} 0%, ${note.color} 100%)`,
            borderRadius: 8,
            border: `2px solid ${note.light}`,
            boxShadow: `0 3px 10px ${note.color}99, inset 0 1px 3px rgba(255,255,255,0.25)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            userSelect: 'none', flexShrink: 0,
            marginTop: i > 0 ? -32 : 0, // fan/stack effect
          }}
        >
          {/* Inner border detail */}
          <div style={{ position: 'absolute', inset: 3, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 5, pointerEvents: 'none' }} />
          {/* Denomination */}
          <span style={{
            fontSize: '1.25rem', fontWeight: 800,
            fontFamily: 'var(--font-display)', color: 'white',
            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
            lineHeight: 1,
          }}>
            ${note.value}
          </span>
          <span style={{ fontSize: '0.5rem', opacity: 0.75, color: 'white', letterSpacing: '0.5px', marginTop: 1 }}>
            BILL
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Banknote — full-detail bill (used in Simulation/Inspection) ──────────────
export function Banknote({ denomination, onClick, unfolded = true, scale = 1, showDetails = false }) {
  const note = NOTE_DATA[denomination] || NOTE_DATA[1];

  return (
    <div
      onClick={onClick}
      style={{
        width: 180 * scale, height: 90 * scale,
        background: `linear-gradient(135deg, ${note.light} 0%, ${note.color} 100%)`,
        border: `${Math.max(1, Math.round(2 * scale))}px solid ${note.light}`,
        borderRadius: `${8 * scale}px`,
        boxShadow: `0 4px 14px ${note.color}88, inset 0 1px 4px rgba(255,255,255,0.2)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: `${Math.max(5, 9 * scale)}px`,
        color: 'white', fontFamily: 'var(--font-display)',
        cursor: onClick ? 'pointer' : 'default', userSelect: 'none',
        transition: 'transform 0.4s ease',
        transform: `scale(${unfolded ? 1 : 0.15})`,
        position: 'relative', flexShrink: 0, overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: `${3 * scale}px`, border: '1px solid rgba(255,255,255,0.18)', borderRadius: `${5 * scale}px`, pointerEvents: 'none' }} />

      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${1.1 * scale}rem`, fontWeight: 800, lineHeight: 1 }}>
        <span>${note.value}</span>
        {scale >= 0.6 && <span style={{ fontSize: `${0.45 * scale}rem`, opacity: 0.8, fontWeight: 400, alignSelf: 'center' }}>FEDERAL NOTE</span>}
        <span>${note.value}</span>
      </div>

      {/* Center portrait */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, gap: `${6 * scale}px` }}>
        <div style={{
          width: Math.max(18, 40 * scale), height: Math.max(18, 40 * scale),
          borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: `${0.9 * scale}rem`,
        }}>👤</div>
        {showDetails && scale >= 0.9 && (
          <div style={{ fontSize: `${0.55 * scale}rem`, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontWeight: 700 }}>{note.name}</span>
            <span style={{ opacity: 0.75 }}>{note.portrait}</span>
          </div>
        )}
      </div>

      {/* Bottom */}
      {scale >= 0.55 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${0.4 * scale}rem`, opacity: 0.7, lineHeight: 1 }}>
          <span>USA</span><span>${note.value}</span>
        </div>
      )}
    </div>
  );
}

// ─── Wallet ────────────────────────────────────────────────────────────────────
export function Wallet({ coins = {}, notes = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 16, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      alignItems: 'center', justifyContent: 'center', minWidth: 130,
    }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(notes).map(([denom, count]) => {
          if (!count || count <= 0) return null;
          return Array.from({ length: count }).map((_, i) => (
            <BillChip key={`n-${denom}-${i}`} denomination={Number(denom)} />
          ));
        })}
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(coins).map(([denom, count]) => {
          if (!count || count <= 0) return null;
          return Array.from({ length: count }).map((_, i) => (
            <Coin key={`c-${denom}-${i}`} denomination={denom} size={30} showLabel={false} />
          ));
        })}
      </div>
    </div>
  );
}
