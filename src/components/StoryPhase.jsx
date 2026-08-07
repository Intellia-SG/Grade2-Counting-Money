import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/images/c1.png',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    icon: '🏰',
    title: 'The Lost Market',
    text: 'Emma discovers the broken marketplace of Numeralia. A mysterious spell has scattered all the coins and banknotes, leaving the shopkeepers unable to trade. Emma has a magical pouch that can hold any currency!',
    highlight: '"Can we break the spell on the market?"',
    mascotText: 'Let\'s find out what money really means! 🪙',
  },
  {
    image: '/images/c2.png',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    icon: '🌲',
    title: 'Chapter 1: Coin Forest',
    text: 'Emma enters the Coin Forest, where the Coin Creatures have lost their values! With Priya and Liam\'s help, Emma identifies the shapes, sizes, and values of Pennies, Nickels, Dimes, and Quarters.',
    highlight: '"Pennies are copper, dimes are the smallest!"',
    mascotText: 'Knowing coins is the first key! 🪙',
  },
  {
    image: '/images/c3.png',
    gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    icon: '🌊',
    title: 'Chapter 2: The Counting Stream',
    text: 'A magical stream counts in patterns! Emma practices skip-counting by fives (nickels), tens (dimes), and twenty-fives (quarters) to quickly find the total value in her treasure bag.',
    highlight: '"5, 10, 15, 20... Skip counting is fun!"',
    mascotText: 'Fractions of a dollar make sense now! 🧮',
  },
  {
    image: '/images/c4.png',
    gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
    icon: '⛰️',
    title: 'Chapter 3: Note Mountains',
    text: 'High up in the Note Mountains, giant paper banknotes flutter in the wind. Sarah the Treasurer teaches Emma to recognize dollar bills: ones, fives, tens, and twenties.',
    highlight: '"Use paper notes for larger values!"',
    mascotText: 'Paper bills are lighter than coins! 💵',
  },
  {
    image: '/images/c5.png',
    gradient: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
    icon: '🧗',
    title: 'Chapter 4: The Mixing Valley',
    text: 'Emma reaches the Mixing Valley, where ancient gates are sealed with coin and note locks. To unlock them, she must combine different coins and notes to make the exact target amounts.',
    highlight: '"There are multiple ways to make a dollar!"',
    mascotText: 'Let\'s mix coins and notes! 💸',
  },
  {
    image: '/images/c6.png',
    gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    icon: '🌉',
    title: 'Chapter 5: Comparison Bridge',
    text: 'Emma stands before the Comparison Bridge. Two pathways lie ahead, but only the bridge holding the greater total value of money is safe to cross.',
    highlight: '"Compare values to cross safely!"',
    mascotText: 'Look closely at the wallet totals! ⚖️',
  },
  {
    image: '/images/c7.png',
    gradient: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    icon: '🎪',
    title: 'Chapter 6: Shopping Festival',
    text: 'The Shopping Festival is restored! Emma buys items from the marketplace stalls. She counts out the exact coins and bills from her wallet to pay the shopkeepers.',
    highlight: '"Pay the exact price to purchase items!"',
    mascotText: 'Let\'s go shopping! 🛍️',
  },
  {
    image: '/images/c8.png',
    gradient: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)',
    icon: '🪙',
    title: 'Chapter 7: Treasure Checkout',
    text: 'At the Word Problem Castle, Emma operates the magical cash register. She solves math riddles and counts out the exact change to give back to the customers.',
    highlight: '"Subtract cost from payment to find change!"',
    mascotText: 'You are now a Master Treasurer! 🎉',
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const [imgError, setImgError] = useState(false);
  const narrationRef = useRef(null);
  
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  // Reset img error on slide change
  useEffect(() => {
    setImgError(false);
  }, [slide]);

  // Preload audio
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          {!imgError ? (
            <>
              <img 
                src={s.image} 
                alt="" 
                className="story-image-backdrop" 
              />
              <img 
                src={s.image} 
                alt={s.title} 
                className="story-image" 
                onError={() => setImgError(true)} 
              />
            </>
          ) : (
            <div style={{ fontSize: '6rem', zIndex: 2, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>{s.icon}</div>
          )}
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>

        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🧪 Start Simulation!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}