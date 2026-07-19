import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const birthdayMessage =
  'A very small surprise filled with cats, soft sparkles, and love.';

function usePrefersReducedMotion() {
  return false;
}

function useInView(options = {}) {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, options);
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, inView];
}

function AnimatedActivityCard({ className, 'aria-label': ariaLabel, children }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`activity-card visual-card ${className} ${inView ? 'in-view' : ''}`}
      role="img"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState('intro');
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 150 }, (_, index) => ({
        id: index,
        left: `${4 + ((index * 17) % 92)}%`,
        delay: `${(index % 31) * 0.12}s`,
        hue: ['#ff8fbd', '#b99cff', '#8bd0ff', '#ffd28f', '#ffb39a', '#a8e8c3'][index % 6],
        drift: `${(index % 2 === 0 ? 1 : -1) * (14 + (index % 5) * 5)}px`,
        rotation: `${90 + (index % 9) * 32}deg`,
      })),
    [],
  );

  useEffect(() => {
    // only run this during the loading phase
    if (phase !== 'loading') {
      return undefined;
    }

    const loadTime = prefersReducedMotion ? 650 : 2000;
    const exitTime = prefersReducedMotion ? 20 : 520;
    let exitTimeoutId;
    const loadTimeoutId = window.setTimeout(() => {
      setIsLoaderExiting(true);
      exitTimeoutId = window.setTimeout(() => {
        setPhase('birthday');
        setIsLoaderExiting(false);
        if (!prefersReducedMotion) {
          setConfettiKey((value) => value + 1);
        }
      }, exitTime);
    }, loadTime);

    return () => {
      window.clearTimeout(loadTimeoutId);
      window.clearTimeout(exitTimeoutId);
    };
  }, [phase, prefersReducedMotion]);

  // Starts the surprise sequence
  const startSurprise = () => {
    setIsLoaderExiting(false);
    setPhase('loading');
  };

  const resetToIntro = () => {
    setPhase('intro');
  };

  return (
    <>
      {phase === 'intro' && <IntroScreen onOpen={startSurprise} />}

      {phase === 'birthday' && (
        <main className="page-shell birthday-shell" aria-labelledby="birthday-title">
          <Decorations />
          <PeekingCat />
          <section className="hero-section">
            <div className="hero-art" aria-label="Animated birthday scenery with cats">
              <div className="hero-copy">
                <div className="eyebrow" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--pink-strong)">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="#9bd7ff">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--lavender)">
                    <path d="M12 2l2.4 7.6h8l-6.4 4.8 2.4 7.6-6.4-4.8-6.4 4.8 2.4-7.6-6.4-4.8h8z" />
                  </svg>
                </div>
                <h1 id="birthday-title" className="birthday-heading" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>
                  <span>Happy</span>
                  <span>Birthday</span>
                  <span>Ma!</span>
                </h1>
                <p className="birthday-message">{birthdayMessage}</p>
              </div>
              <BirthdayCatParty />
              <YarnTrail />
            </div>
          </section>

          <section className="playground-section visual-playground" aria-label="Playful birthday cat decorations">
            <AnimatedActivityCard className="paw-card" aria-label="Calico heart kitty with tiny paws">
              <PanelHeartKitty />
            </AnimatedActivityCard>
            <AnimatedActivityCard className="balloon-card" aria-label="Orange, tilapia, and cow cat balloon kitties">
              <PanelBalloonKitties />
            </AnimatedActivityCard>
            <AnimatedActivityCard className="yarn-card" aria-label="Sleepy tilapia kitty with moon and yarn">
              <PanelSleepyKitty />
            </AnimatedActivityCard>
          </section>

          <footer className="site-footer">
            <div className="footer-message">
              <span aria-hidden="true">&#9825;</span>
              For you, Ma
              <span aria-hidden="true">&#9825;</span>
            </div>
            <button className="back-button" onClick={resetToIntro} aria-label="Go back to intro">
              &laquo; Back to start
            </button>
          </footer>

          {!prefersReducedMotion && confettiKey > 0 && (
            <Confetti key={confettiKey} pieces={confettiPieces} />
          )}
        </main>
      )}

      {phase === 'loading' && <LoadingScreen isExiting={isLoaderExiting} />}
    </>
  );
}

function IntroScreen({ onOpen }) {
  return (
    <main className="page-shell intro-shell" aria-labelledby="intro-title">
      <Decorations />
      <section className="intro-section">
        <div className="intro-greeting-card">
          <div className="intro-peeking-cat" aria-hidden="true">
            <MiniCat />
          </div>
          <div className="intro-card-content">
            <div className="eyebrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--pink-strong)">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="#9bd7ff">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} width="18" height="18" viewBox="0 0 24 24" fill="var(--lavender)">
                <path d="M12 2l2.4 7.6h8l-6.4 4.8 2.4 7.6-6.4-4.8-6.4 4.8 2.4-7.6-6.4-4.8h8z" />
              </svg>
            </div>
            <h1 id="intro-title" className="intro-title">Hello Ma!</h1>
            <p className="intro-subtitle">A very small surprise awaits...</p>
            <button className="surprise-button intro-button" type="button" onClick={onOpen}>
              <span aria-hidden="true">&#9654;</span>
              Play
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingScreen({ isExiting }) {
  return (
    <div
      className={`loading-screen ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Preparing your birthday surprise"
    >
      <div className="loading-stars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="loader-card">
        <LoadingCat />
        <p className="loading-text">
          Loading<span className="dot-one">.</span><span className="dot-two">.</span><span className="dot-three">.</span>
        </p>
        <div className="paw-loader" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

function LoadingCat() {
  return (
    <svg className="loading-cat" viewBox="0 0 260 220" role="img" aria-label="Cute magic orange cat loading animation">
      <defs>
        <style>
          {`
            .magic-wand-wave {
              transform-origin: 164px 184px;
              animation: wandWave 2s ease-in-out infinite;
            }
            .magic-star {
              animation: starTwinkle 1.5s ease-in-out infinite;
              transform-origin: 210px 96px;
            }
            .cat-blink {
              transform-origin: center;
              animation: blink 4s infinite;
            }
            @keyframes wandWave {
              0%, 100% { transform: rotate(-8deg); }
              50% { transform: rotate(18deg); }
            }
            @keyframes starTwinkle {
              0%, 100% { opacity: 0.8; transform: scale(0.9) rotate(0deg); }
              50% { opacity: 1; transform: scale(1.25) rotate(15deg); }
            }
          `}
        </style>
      </defs>

      {/* Body */}
      <ellipse cx="128" cy="136" rx="61" ry="53" style={{ fill: '#ffd36a', stroke: '#4f3d47', strokeWidth: 6 }} />

      {/* Head */}
      <path d="M73 96 58 52l39 20a70 70 0 0 1 62 0l39-20-15 44v20c0 37-24 62-55 62s-55-25-55-62z" style={{ fill: '#ffd36a', stroke: '#4f3d47', strokeWidth: 6, strokeLinejoin: 'round' }} />

      {/* Ears */}
      <path d="m76 67 20 14-26 10z" style={{ fill: '#f46f9f' }} />
      <path d="m180 67-20 14 26 10z" style={{ fill: '#f46f9f' }} />

      {/* Wizard Hat */}
      <path d="M 60 48 L 128 10 L 196 48" style={{ fill: '#9d84c6', stroke: '#4f3d47', strokeWidth: 6, strokeLinejoin: 'round' }} />
      <ellipse cx="128" cy="48" rx="70" ry="14" style={{ fill: '#9d84c6', stroke: '#4f3d47', strokeWidth: 6 }} />

      {/* Star on the Wizard Hat */}
      <path d="M 128 20 L 131 27 L 138 27 L 132 32 L 134 39 L 128 35 L 122 39 L 124 32 L 118 27 L 125 27 Z" style={{ fill: '#ffd36a' }} />

      {/* Eyes */}
      <g className="cat-blink" style={{ fill: '#4f3d47' }}>
        <path d="M103 111c0 7-4 12-10 12s-10-5-10-12 4-12 10-12 10 5 10 12Z" />
        <path d="M173 111c0 7-4 12-10 12s-10-5-10-12 4-12 10-12 10 5 10 12Z" />
      </g>

      {/* Nose */}
      <path d="m126 124 8 0-4 6z" style={{ fill: '#f46f9f' }} />
      <path d="M130 132c-7 9-17 9-24 1M130 132c7 9 17 9 24 1" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }} />

      {/* Whiskers */}
      <g style={{ stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }}>
        <path d="M85 128H44" />
        <path d="M86 140 48 151" />
        <path d="M175 128h41" />
        <path d="m174 140 38 11" />
      </g>

      {/* Left Paw */}
      <ellipse cx="92" cy="184" rx="20" ry="14" style={{ fill: '#ffd36a', stroke: '#4f3d47', strokeWidth: 6 }} />

      {/* Magic Wand + Right Paw (Animated) */}
      <g className="magic-wand-wave">
        <path d="M 164 184 L 210 100" style={{ stroke: '#72566a', strokeWidth: 8, strokeLinecap: 'round' }} />
        <path className="magic-star" d="M 210 70 L 216 90 L 236 90 L 220 102 L 226 122 L 210 110 L 194 122 L 200 102 L 184 90 L 204 90 Z" style={{ fill: '#fffefe', stroke: '#4f3d47', strokeWidth: 4, strokeLinejoin: 'round' }} />
        <ellipse cx="164" cy="184" rx="20" ry="14" style={{ fill: '#ffd36a', stroke: '#4f3d47', strokeWidth: 6 }} />
      </g>
    </svg>
  );
}

function BirthdayCatParty() {
  return (
    <svg className="birthday-party" viewBox="0 0 1000 520" role="img" aria-label="Three cute birthday cats in a scenery">
      <defs>
        <clipPath id="party-poster-clip">
          <rect x="18" y="18" width="964" height="484" rx="38" />
        </clipPath>
      </defs>
      <rect className="party-backdrop" x="18" y="18" width="964" height="484" rx="38" />
      <g className="poster-scene" clipPath="url(#party-poster-clip)">

        <g className="poster-clouds" fill="#fff" opacity="0.5">
          <circle cx="200" cy="150" r="60" />
          <circle cx="260" cy="130" r="80" />
          <circle cx="320" cy="160" r="50" />
          <circle cx="700" cy="80" r="40" />
          <circle cx="760" cy="60" r="70" />
          <circle cx="820" cy="90" r="45" />
          <circle cx="920" cy="180" r="60" />
        </g>

        <g className="poster-balloons" aria-hidden="true">
          <ellipse className="poster-balloon peach" cx="75" cy="78" rx="65" ry="77" />
          <ellipse className="poster-balloon pink" cx="350" cy="66" rx="62" ry="72" />
          <circle className="poster-balloon white" cx="500" cy="112" r="48" />
          <ellipse className="poster-balloon peach" cx="900" cy="220" rx="45" ry="55" />
        </g>

        <g className="poster-confetti" aria-hidden="true">
          <path d="M152 48 174 38" />
          <path d="M112 97 121 118" />
          <path d="M380 51 395 62" />
          <path d="M421 154 436 133" />
          <path d="M455 287 474 297" />
          <path d="M76 240 87 216" />
          <path d="M230 187 239 171" />
          <path d="M300 72 303 50" />
          <path d="M600 80 610 95" />
          <path d="M800 120 815 110" />
          <path d="M750 250 760 270" />
          <path d="M920 300 935 280" />
          <path d="M500 400 520 410" />
        </g>

        <g className="poster-top-sparkles" aria-hidden="true">
          <path className="poster-star-fill" d="M260 50 268 70l21 7-21 7-8 20-8-20-21-7 21-7Z" />
          <path className="poster-star-fill" d="M760 90 768 110l21 7-21 7-8 20-8-20-21-7 21-7Z" />
          <path className="poster-heart-fill" d="M205 92c-8-13-27-2-16 13l16 15 16-15c11-15-8-26-16-13Z" />
          <path className="poster-heart-fill small-heart-fill" d="M318 90c-6-10-21-2-13 10l13 12 13-12c8-12-7-20-13-10Z" />
          <path className="poster-heart-fill" d="M805 192c-8-13-27-2-16 13l16 15 16-15c11-15-8-26-16-13Z" />
          <circle className="poster-dot-fill peach-dot" cx="178" cy="62" r="6" />
          <circle className="poster-dot-fill blue-dot" cx="342" cy="62" r="6" />
          <circle className="poster-dot-fill peach-dot" cx="600" cy="150" r="6" />
        </g>

        <g className="party-cats">

          {/* FAR LEFT CAT - Tilapia Cat */}
          <g transform="translate(60, 30) scale(0.85)">
            <g className="party-cat cat-far-left">
              {/* Tail */}
              <g className="party-cat-tail-left">
                <path d="M 40 520 C -10 550, -40 450, 10 430" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 20, strokeLinecap: 'round' }} />
                <path d="M 40 520 C -10 550, -40 450, 10 430" style={{ fill: 'none', stroke: '#c9baa6', strokeWidth: 10, strokeLinecap: 'round' }} />
              </g>
              
              {/* Body */}
              <ellipse cx="100" cy="480" rx="75" ry="80" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />
              
              {/* Back Feet */}
              <ellipse cx="50" cy="550" rx="22" ry="16" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />
              <ellipse cx="150" cy="550" rx="22" ry="16" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Ears - outlined */}
              <path style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M30 360 L50 270 L90 340Z" />
              <path style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M110 340 L150 270 L170 360Z" />
              {/* Inner ears */}
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M45 340 L55 295 L75 330Z" />
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M125 330 L145 295 L155 340Z" />

              {/* Head */}
              <ellipse cx="100" cy="390" rx="90" ry="70" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Party Hat (Blue) */}
              <path style={{ fill: '#9bd7ff', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M65 340 L100 210 L135 340 Z" />
              <ellipse cx="100" cy="340" rx="35" ry="10" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
              <circle cx="100" cy="210" r="14" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
              {/* Hat Dots */}
              <circle cx="100" cy="260" r="6" style={{ fill: '#fffdf8' }} />
              <circle cx="80" cy="300" r="6" style={{ fill: '#fffdf8' }} />
              <circle cx="120" cy="310" r="6" style={{ fill: '#fffdf8' }} />

              {/* Stripes */}
              <path d="M100 320v30M80 325v25M120 325v25" style={{ stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />
              <path d="M10 370h20M10 390h25M190 370h-20M190 390h-25" style={{ stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />

              {/* Body Stripes */}
              <path d="M 30 460 Q 50 470 70 460" style={{ fill: 'none', stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />
              <path d="M 170 460 Q 150 470 130 460" style={{ fill: 'none', stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />

              {/* Eyes looking happy */}
              <path style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }} d="M50 380 Q60 370 70 380 M130 380 Q140 370 150 380" />

              {/* Nose & Mouth */}
              <path d="m96 395 8 0-4 6z" style={{ fill: '#f46f9f' }} />
              <path d="M100 405c-7 9-17 9-24 1M100 405c7 9 17 9 24 1" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Whiskers */}
              <path d="M40 395h-30M40 405l-30 8M160 395h30M160 405l30 8" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Front Paws */}
              <ellipse cx="75" cy="495" rx="16" ry="26" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />
              <ellipse cx="125" cy="495" rx="16" ry="26" style={{ fill: '#c9baa6', stroke: '#4f3d47', strokeWidth: 5 }} />
            </g>
          </g>

          {/* LEFT CAT - Present Box Scene */}
          <g transform="translate(305, 30) scale(0.85)">
            {/* Fat Cow Kitty Body (Drawn behind the head) */}
            <g className="fat-cat-body">
              {/* Tail */}
              <g className="party-cat-tail-cow">
                <path d="M 0 500 C -50 510, -70 420, -30 410" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 24, strokeLinecap: 'round' }} />
                <path d="M 0 500 C -50 510, -70 420, -30 410" style={{ fill: 'none', stroke: '#4c444a', strokeWidth: 14, strokeLinecap: 'round' }} />
              </g>

              <clipPath id="fat-cat-body-clip-cow-left">
                <ellipse cx="100" cy="450" rx="115" ry="85" />
              </clipPath>
              
              {/* Body Fill */}
              <ellipse cx="100" cy="450" rx="115" ry="85" style={{ fill: '#fffdf8' }} />
              
              {/* Cow Patches on Body (clipped) */}
              <g clipPath="url(#fat-cat-body-clip-cow-left)">
                <ellipse cx="0" cy="460" rx="40" ry="60" style={{ fill: '#4c444a' }} transform="rotate(25 0 460)" />
                <ellipse cx="190" cy="480" rx="45" ry="55" style={{ fill: '#4c444a' }} transform="rotate(-20 190 480)" />
                <ellipse cx="140" cy="510" rx="20" ry="15" style={{ fill: '#4c444a' }} transform="rotate(10 140 510)" />
              </g>

              {/* Body Outline */}
              <ellipse cx="100" cy="450" rx="115" ry="85" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Back Feet */}
              <g className="cat-back-feet">
                {/* Left Foot */}
                <g transform="rotate(-30 55 520)">
                  <ellipse cx="55" cy="520" rx="16" ry="22" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
                  <line x1="49" y1="540" x2="49" y2="530" style={{ stroke: '#4f3d47', strokeWidth: 4, strokeLinecap: 'round' }} />
                  <line x1="61" y1="540" x2="61" y2="530" style={{ stroke: '#4f3d47', strokeWidth: 4, strokeLinecap: 'round' }} />
                </g>
                
                {/* Right Foot */}
                <g transform="rotate(30 145 520)">
                  <ellipse cx="145" cy="520" rx="16" ry="22" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
                  <line x1="139" y1="540" x2="139" y2="530" style={{ stroke: '#4f3d47', strokeWidth: 4, strokeLinecap: 'round' }} />
                  <line x1="151" y1="540" x2="151" y2="530" style={{ stroke: '#4f3d47', strokeWidth: 4, strokeLinecap: 'round' }} />
                </g>
              </g>
            </g>

            <g className="party-cat cat-left">
              {/* Ears - outlined */}
              <path style={{ fill: '#4c444a', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M30 350 L50 260 L90 330Z" />
              <path style={{ fill: '#4c444a', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M110 330 L150 260 L170 350Z" />
              {/* Inner ears */}
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M45 330 L55 285 L75 320Z" />
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M125 320 L145 285 L155 330Z" />

              {/* Head */}
              <ellipse cx="100" cy="380" rx="90" ry="70" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Cow Patches */}
              <path style={{ fill: '#4c444a', stroke: 'none' }} d="M100 310 C75 310 50 322 45 345 C55 348 70 345 85 333 C95 326 100 317 100 310 Z" />
              <path style={{ fill: '#4c444a', stroke: 'none' }} d="M165 390 C185 390 190 410 170 420 C155 425 150 405 165 390 Z" />

              {/* Eyes looking happy */}
              <path style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }} d="M50 370 Q60 360 70 370 M130 370 Q140 360 150 370" />

              {/* Nose & Mouth */}
              <path d="m96 385 8 0-4 6z" style={{ fill: '#f46f9f' }} />
              <path d="M100 395c-7 9-17 9-24 1M100 395c7 9 17 9 24 1" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Whiskers */}
              <path d="M40 385H10M40 395l-30 8M160 385h30M160 395l30 8" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />
            </g>

            <g className="party-cat cat-left-hands">
              {/* Cute Cake */}
              <g className="hero-cake" transform="translate(-178, -10)">
                <path d="M 235 440 L 320 440 L 320 395 L 235 420 Z" style={{ fill: '#ffd28f', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} />
                <path d="M 235 430 L 320 417" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 4 }} />
                <path d="M 235 420 L 320 395" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 8, strokeLinecap: 'round' }} />
                <path d="M 250 415 L 250 425" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 6, strokeLinecap: 'round' }} />
                <path d="M 270 410 L 270 420" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 6, strokeLinecap: 'round' }} />
                <line x1="295" y1="402" x2="295" y2="375" style={{ stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />
                <ellipse cx="295" cy="367" rx="4" ry="7" style={{ fill: '#ffd36a', stroke: 'none' }} />
              </g>

              {/* Paws */}
              <ellipse cx="50" cy="420" rx="20" ry="12" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
              <ellipse cx="150" cy="420" rx="20" ry="12" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
            </g>
          </g>

          {/* MIDDLE CAT - Hot Air Balloon Scene */}
          <g transform="translate(316, 60) scale(0.85)">
            <path d="M 174 440 L 262 100 M 382 440 L 294 100" stroke="#72566a" strokeWidth="4" fill="none" opacity="0.4" />
            <g className="balloon-backdrop" transform="translate(118, -80) scale(0.65)">
              <path d="M 195 20 C 60 20 60 260 160 320 L 230 320 C 330 260 330 20 195 20 Z" fill="#ffb7a8" stroke="#72566a" strokeWidth="5" strokeLinejoin="round" />
              <path d="M 195 20 Q 120 170 160 320" fill="none" stroke="#72566a" strokeWidth="5" opacity="0.4" />
              <path d="M 195 20 Q 270 170 230 320" fill="none" stroke="#72566a" strokeWidth="5" opacity="0.4" />
              <path d="M 195 20 L 195 320" fill="none" stroke="#72566a" strokeWidth="5" opacity="0.4" />
              <path className="candle-flame" d="M 195 325 Q 165 370 195 410 Q 225 370 195 325" fill="#ffd36a" />
            </g>
            <g className="party-cat cat-middle">
              {/* Ears - outlined */}
              <path style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M208 360 L228 270 L268 340Z" />
              <path style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M288 340 L328 270 L348 360Z" />
              {/* Inner ears */}
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M223 340 L233 295 L253 330Z" />
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M303 330 L323 295 L333 340Z" />

              {/* Head */}
              <ellipse cx="278" cy="390" rx="90" ry="70" style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Stripes */}
              <path d="M278 320v30M258 325v25M298 325v25" style={{ stroke: '#d6803e', strokeWidth: 4, strokeLinecap: 'round' }} />
              <path d="M188 370h20M188 390h25M368 370h-20M368 390h-25" style={{ stroke: '#d6803e', strokeWidth: 4, strokeLinecap: 'round' }} />

              {/* Party Hat (Pink) */}
              <path style={{ fill: '#ff8fbd', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M228 330 L278 180 L328 330 Z" />
              <ellipse cx="278" cy="330" rx="55" ry="15" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
              <circle cx="278" cy="180" r="16" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
              {/* Hat Dots */}
              <circle cx="268" cy="230" r="7" style={{ fill: '#fffdf8' }} />
              <circle cx="298" cy="270" r="7" style={{ fill: '#fffdf8' }} />
              <circle cx="258" cy="290" r="7" style={{ fill: '#fffdf8' }} />

              {/* Eyes looking happy */}
              <path style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }} d="M228 380 Q238 370 248 380 M308 380 Q318 370 328 380" />

              {/* Nose & Mouth */}
              <path d="m274 395 8 0-4 6z" style={{ fill: '#f46f9f' }} />
              <path d="M278 405c-7 9-17 9-24 1M278 405c7 9 17 9 24 1" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Whiskers */}
              <path d="M218 395h-30M218 405l-30 8M338 395h30M338 405l30 8" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Paws */}
              <ellipse cx="218" cy="430" rx="20" ry="12" style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5 }} />
              <ellipse cx="338" cy="430" rx="20" ry="12" style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5 }} />
            </g>
            <g className="balloon-basket" transform="translate(164, 440)">
              <path d="M 0 0 L 91 -310 M 228 0 L 137 -310" stroke="#72566a" strokeWidth="4" fill="none" opacity="0.8" />
              <path d="M0 0 L228 0 L218 90 L10 90 Z" fill="#ffd28f" stroke="#72566a" strokeWidth="5" strokeLinejoin="round" />
              <path d="M0 0 L228 0 M46 0 L52 90 M91 0 L93 90 M137 0 L135 90 M182 0 L176 90" stroke="#72566a" strokeWidth="3" />
            </g>
          </g>

          {/* RIGHT CAT - Cloud Scene */}
          <g transform="translate(388, 40) scale(0.85)">
            <g className="party-cat cat-right">
              {/* Ears - outlined */}
              {/* Left ear Orange */}
              <path style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M340 380 L360 290 L400 360Z" />
              {/* Right ear Charcoal */}
              <path style={{ fill: '#4c444a', stroke: '#4f3d47', strokeWidth: 5, strokeLinejoin: 'round' }} d="M420 360 L460 290 L480 380Z" />
              {/* Inner ears */}
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M355 360 L365 315 L385 350Z" />
              <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M435 350 L455 315 L465 360Z" />

              {/* Head */}
              <ellipse cx="410" cy="410" rx="90" ry="65" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />

              {/* Orange Patch (left) */}
              <path style={{ fill: '#ffc466', stroke: 'none' }} d="M410 345 C360 345 320 365 320 410 C320 430 360 440 380 430 C410 415 410 370 410 345 Z" />
              {/* Charcoal Patch (right ear base) */}
              <path style={{ fill: '#4c444a', stroke: 'none' }} d="M410 345 C440 345 470 360 480 380 C470 385 450 380 430 365 C420 360 415 350 410 345 Z" />

              {/* Eyes closed sleeping */}
              <path style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 6, strokeLinecap: 'round' }} d="M360 405 Q370 415 380 405 M440 405 Q450 415 460 405" />

              {/* Nose & Mouth (peaceful sleeping) */}
              <path d="m406 418 8 0-4 5z" style={{ fill: '#f46f9f' }} />
              <path d="M410 425c-5 6-12 6-17 1M410 425c5 6 12 6 17 1" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Whiskers */}
              <path d="M350 418h-30M350 428l-30 8M470 418h30M470 428l30 8" style={{ fill: 'none', stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round' }} />

              {/* Sleep bubbles */}
              <circle cx="470" cy="320" r="5" style={{ fill: '#fffdf8', stroke: '#72566a', strokeWidth: 3 }} />
              <circle cx="490" cy="290" r="10" style={{ fill: '#fffdf8', stroke: '#72566a', strokeWidth: 3 }} />
              <circle cx="520" cy="250" r="15" style={{ fill: '#fffdf8', stroke: '#72566a', strokeWidth: 3 }} />
            </g>
            
            {/* Present Box for Right Cat */}
            <g className="present-box" transform="translate(320, 470)">
              <rect x="0" y="0" width="180" height="150" fill="#ffb3c7" stroke="#72566a" strokeWidth="5" />
              <rect x="-10" y="-20" width="200" height="40" fill="#b99cff" stroke="#72566a" strokeWidth="5" />
              <rect x="75" y="-20" width="30" height="170" fill="#fffefe" stroke="#72566a" strokeWidth="5" />
              <path d="M 90 -20 C 40 -90 -10 -40 90 -20 Z" fill="#fffefe" stroke="#72566a" strokeWidth="5" />
              <path d="M 90 -20 C 140 -90 190 -40 90 -20 Z" fill="#fffefe" stroke="#72566a" strokeWidth="5" />
              <circle cx="90" cy="-20" r="10" fill="#fffefe" stroke="#72566a" strokeWidth="5" />
            </g>

            {/* Paws over the box */}
            <ellipse cx="350" cy="455" rx="20" ry="12" style={{ fill: '#ffc466', stroke: '#4f3d47', strokeWidth: 5 }} />
            <ellipse cx="470" cy="455" rx="20" ry="12" style={{ fill: '#fffdf8', stroke: '#4f3d47', strokeWidth: 5 }} />
          </g>

        </g>
      </g>
    </svg>
  );
}

function MiniCat() {
  return (
    <svg className="mini-cat-sticker" viewBox="0 0 120 120" role="img" aria-label="Tiny smiling calico cat">
      <path className="mini-cat-sparkle" d="M96 18 101 29l12 4-12 4-5 11-5-11-12-4 12-4Z" />
      <path className="mini-cat-ear mini-cat-ear-orange" d="M27 61 43 26 65 61Z" />
      <path className="mini-cat-ear mini-cat-ear-charcoal" d="M55 61 77 26 93 61Z" />
      <path className="mini-cat-inner-ear" d="M39 53 45 39 55 54Z" />
      <path className="mini-cat-inner-ear" d="M66 54 76 39 82 53Z" />
      <ellipse className="mini-cat-head" cx="60" cy="74" rx="39" ry="30" />
      <path className="mini-cat-patch mini-cat-patch-orange" d="M26 67c6-20 27-25 38-11 9 11 1 26-15 28-14 2-24-4-23-17Z" />
      <path className="mini-cat-patch mini-cat-patch-charcoal" d="M70 52c19 2 31 14 28 29-3 13-23 15-33 5-9-9-7-25 5-34Z" />
      <path className="mini-cat-eye" d="M39 68c5 6 14 6 19 0" />
      <path className="mini-cat-eye on-dark-fur" d="M62 68c5 6 14 6 19 0" />
      <path className="mini-cat-nose" d="m55 77 10 0-5 7z" />
      <path className="mini-cat-mouth" d="M60 86c-5 6-12 6-17 0M60 86c5 6 12 6 17 0" />
      <path className="mini-cat-whisker" d="M40 80H22M80 80h18" />
      <path className="mini-cat-cheek" d="M28 75h9M83 75h9" />
    </svg>
  );
}

function PanelHeartKitty() {
  return (
    <svg className="mini-kitty-scene" viewBox="0 0 280 160" aria-hidden="true">
      <g className="panel-cat-line" style={{ stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>

        {/* Sparkles - no outline */}
        <path style={{ fill: '#ffd36a', stroke: 'none' }} d="M 45 60 L 50 70 L 60 70 L 52 78 L 55 88 L 45 80 L 35 88 L 38 78 L 30 70 L 40 70 Z" />
        <path style={{ fill: '#8bd0ff', stroke: 'none' }} d="M 230 40 L 233 48 L 241 48 L 235 53 L 237 61 L 230 56 L 223 61 L 225 53 L 219 48 L 227 48 Z" />

        {/* Ears - outlined */}
        <path style={{ fill: '#ffc466' }} d="M100 80 L115 35 L140 75Z" />
        <path style={{ fill: '#ffc466' }} d="M180 80 L165 35 L140 75Z" />

        {/* Inner Ears - no outline */}
        <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M110 70 L118 48 L130 70Z" />
        <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M170 70 L162 48 L150 70Z" />

        {/* Head - outlined */}
        <ellipse cx="140" cy="95" rx="50" ry="40" style={{ fill: '#ffc466' }} />

        {/* Happy Eyes - stroked, no fill */}
        <path d="M115 85c4 -4 12 -4 16 0" fill="none" />
        <path d="M149 85c4 -4 12 -4 16 0" fill="none" />

        {/* Nose - outlined and filled */}
        <path d="m136 98 8 0-4 5z" style={{ fill: '#f46f9f' }} />

        {/* Mouth - stroked, no fill */}
        <path d="M140 106c-5 5-10 5-15 0M140 106c5 5 10 5 15 0" fill="none" />

        {/* Whiskers - stroked, no fill */}
        <path d="M110 98H90M110 105l-18 5M170 98h20M170 105l18 5" fill="none" />

        {/* Gift Box Body - outlined */}
        <rect x="80" y="115" width="120" height="45" style={{ fill: '#ff8fbd' }} />

        {/* Box Ribbon Vertical - stroked, no fill */}
        <path d="M 140 115 L 140 160" fill="none" />

        {/* Box Lid - outlined */}
        <rect x="75" y="105" width="130" height="15" rx="3" style={{ fill: '#ffb39a' }} />

        {/* Paws Over Lid - outlined */}
        <ellipse cx="105" cy="105" rx="12" ry="8" style={{ fill: '#ffc466' }} />
        <ellipse cx="175" cy="105" rx="12" ry="8" style={{ fill: '#ffc466' }} />
      </g>
    </svg>
  );
}

function PanelBalloonKitties() {
  return (
    <svg className="mini-kitty-scene" viewBox="0 0 280 160" aria-hidden="true">
      <g className="panel-cat-line" style={{ stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>

        {/* Ears - outlined */}
        <path style={{ fill: '#ffc466' }} d="M120 78 L143 28 L170 78Z" />
        <path style={{ fill: '#4c444a' }} d="M170 78 L197 28 L220 78Z" />

        {/* Inner ears - no outline */}
        <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M136 66 L145 44 L160 67Z" />
        <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M180 67 L195 44 L204 66Z" />

        {/* Head - outlined */}
        <ellipse cx="170" cy="93" rx="60" ry="40" style={{ fill: '#fffdf8' }} />

        {/* Orange patch over left eye - no outline */}
        <path style={{ fill: '#ffc466', stroke: 'none' }} d="M170 53 C140 53 110 70 110 93 C110 115 135 125 155 115 C175 105 170 73 170 53 Z" />

        {/* Charcoal patch over right ear base (avoids the eye!) - no outline */}
        <path style={{ fill: '#4c444a', stroke: 'none' }} d="M170 53 C195 53 220 62 225 78 C215 80 200 78 185 70 C175 65 170 58 170 53 Z" />

        {/* Big cute open eyes looking left - filled, no outline */}
        <ellipse cx="140" cy="85" rx="6" ry="8" style={{ fill: '#4f3d47', stroke: 'none' }} />
        <ellipse cx="190" cy="85" rx="6" ry="8" style={{ fill: '#4f3d47', stroke: 'none' }} />
        <circle cx="138" cy="82" r="2" style={{ fill: '#fff', stroke: 'none' }} />
        <circle cx="188" cy="82" r="2" style={{ fill: '#fff', stroke: 'none' }} />

        {/* Tiny mouth - stroked */}
        <path d="m162 96 3 3 3-3" fill="none" />

        {/* Whiskers - completely standard dark color! */}
        <path d="M120 92H100M120 99l-18 5M215 92h20M215 99l18 5" fill="none" />

        {/* Yarn Ball on the left - outlined */}
        <circle cx="70" cy="100" r="25" style={{ fill: '#ff8fbd' }} />

        {/* Yarn ball details - stroked */}
        <path d="M 55 85 C 70 90 85 105 80 120" fill="none" style={{ stroke: '#f46f9f', strokeWidth: 4 }} />
        <path d="M 85 85 C 70 90 55 105 60 120" fill="none" style={{ stroke: '#f46f9f', strokeWidth: 4 }} />
        <path d="M 50 100 C 60 100 70 110 90 100" fill="none" style={{ stroke: '#f46f9f', strokeWidth: 4 }} />

        {/* Yarn string trailing - stroked */}
        <path d="M 70 125 Q 90 135 130 125" fill="none" style={{ stroke: '#f46f9f', strokeWidth: 4 }} />

        {/* Cat paw reaching out - outlined */}
        <ellipse cx="110" cy="120" rx="14" ry="9" style={{ fill: '#fffdf8' }} />
      </g>
    </svg>
  );
}

const tinyKittyStyles = {
  orange: {
    body: '#ffc466',
    accent: '#d6803e',
  },
  tilapia: {
    body: '#bfe3ee',
    accent: '#74a9b9',
  },
  cow: {
    body: '#fffdf8',
    accent: '#4c444a',
  },
};

function PanelTinyKitty({ x, y, variant }) {
  const colors = tinyKittyStyles[variant] ?? tinyKittyStyles.orange;

  return (
    <g className={`tiny-head tiny-head-${variant}`} transform={`translate(${x} ${y})`}>
      <path className="panel-ear-fill" style={{ fill: colors.body }} d="M20 58 38 16 61 58Z" />
      <path className="panel-ear-fill" style={{ fill: variant === 'cow' ? colors.accent : colors.body }} d="M65 58 88 16 106 58Z" />
      <path className="panel-inner-ear" d="M32 50 39 31 51 51Z" />
      <path className="panel-inner-ear" d="M76 51 87 31 94 50Z" />
      <ellipse className="panel-cat-fill" fill={colors.body} cx="63" cy="76" rx="52" ry="33" />
      {variant === 'orange' && (
        <g className="tiny-fur-lines" style={{ '--tiny-accent': colors.accent }}>
          <path d="M34 60c10 5 21 6 33 2" />
          <path d="M24 76c11 3 21 2 29-4" />
          <path d="M76 62c11 3 21 1 30-5" />
          <path d="M77 81c11 3 21 1 30-6" />
        </g>
      )}
      {variant === 'tilapia' && (
        <g className="tiny-fur-lines tiny-tilapia-lines" style={{ '--tiny-accent': colors.accent }}>
          <path d="M37 59c11 7 26 7 39 0" />
          <path d="M35 79c9 6 18 7 28 3" />
          <path d="M74 80c10 3 19 2 28-5" />
        </g>
      )}
      {variant === 'cow' && (
        <>
          <path className="panel-fur-patch tiny-cow-patch-left" d="M22 65c9-15 30-17 41-4 9 12 0 27-19 26-15-1-25-9-22-22Z" />
          <path className="panel-fur-patch tiny-cow-patch-right" d="M75 51c21 2 35 16 32 33-2 15-26 17-37 4-10-11-8-27 5-37Z" />
        </>
      )}
      <path className={`panel-eye-arc small-eye ${variant === 'cow' ? 'on-dark-fur' : ''}`} d="M35 68c7 7 17 7 24 0" />
      <path className={`panel-eye-arc small-eye ${variant === 'cow' ? 'on-dark-fur' : ''}`} d="M68 68c7 7 17 7 24 0" />
      <path className="panel-nose" d="m58 80 9 0-4 6z" />
      <path className="panel-soft-mouth small-mouth" d="M63 90c-5 5-11 5-16 0M63 90c5 5 11 5 16 0" />
      <path className="panel-whiskers mini-whiskers" d="M38 82H22M88 82h16" />
      <path className="panel-cheek-line mini-cheek" d="M28 77h9M89 77h9" />
    </g>
  );
}

function PanelSleepyKitty() {
  return (
    <svg className="mini-kitty-scene" viewBox="0 0 280 160" aria-hidden="true">
      <g className="panel-cat-line" style={{ stroke: '#4f3d47', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <g transform="translate(0, 10)">
          {/* Ears - outlined */}
          <path style={{ fill: '#c9baa6' }} d="M50 78 L65 30 L90 60Z" />
          <path style={{ fill: '#c9baa6' }} d="M150 78 L135 30 L110 60Z" />

          {/* Inner ears - no outline */}
          <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M58 64 L68 44 L80 64Z" />
          <path style={{ fill: '#f46f9f', stroke: 'none' }} d="M142 64 L132 44 L120 64Z" />

          {/* Head - outlined */}
          <ellipse cx="100" cy="93" rx="65" ry="42" style={{ fill: '#c9baa6' }} />

          {/* Stripes */}
          <path d="M100 51v15M88 54v12M112 54v12" style={{ fill: 'none', stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />
          <path d="M35 85h15M35 95h18M165 85h-15M165 95h-18" style={{ fill: 'none', stroke: '#4c444a', strokeWidth: 4, strokeLinecap: 'round' }} />

          {/* Party Hat - outlined */}
          <path d="M80 50 L100 0 L120 50 Z" style={{ fill: '#ffc466' }} />
          <circle cx="100" cy="0" r="8" style={{ fill: '#f46f9f' }} />

          {/* Happy Eyes - stroked */}
          <path d="M70 86c6 -6 16 -6 22 0" fill="none" />
          <path d="M108 86c6 -6 16 -6 22 0" fill="none" />

          {/* Nose - outlined */}
          <path d="m96 96 8 0-4 5z" style={{ fill: '#f46f9f' }} />

          {/* Mouth - stroked */}
          <path d="M100 104c-5 5-12 5-18 0M100 104c5 5 12 5 18 0" fill="none" />

          {/* Whiskers - stroked */}
          <path d="M60 96H40M60 103l-18 5M140 96h20M140 103l18 5" fill="none" />
        </g>

        {/* Slice of Cake on the Right */}
        <g transform="translate(180, 70)">
          {/* Cake Body - outlined */}
          <path d="M 10 60 L 70 60 L 70 20 L 10 40 Z" style={{ fill: '#fffdf8' }} />

          {/* Middle frosting layer - stroked */}
          <path d="M 10 50 L 70 40" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 4 }} />

          {/* Top frosting with drips - stroked */}
          <path d="M 10 40 L 70 20" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 8, strokeLinecap: 'round' }} />
          <path d="M 25 35 L 25 45" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 6, strokeLinecap: 'round' }} />
          <path d="M 55 25 L 55 35" fill="none" style={{ stroke: '#ff8fbd', strokeWidth: 6, strokeLinecap: 'round' }} />

          {/* Candle - stroked */}
          <line x1="40" y1="30" x2="40" y2="10" style={{ stroke: '#4f3d47', strokeWidth: 4 }} />

          {/* Flame - filled, no outline */}
          <ellipse cx="40" cy="4" rx="4" ry="6" style={{ fill: '#ffd36a', stroke: 'none' }} />
        </g>
      </g>
    </svg>
  );
}

function PeekingCat() {
  return (
    <div className="peeking-cat" aria-hidden="true">
      <MiniCat />
    </div>
  );
}

function YarnTrail() {
  return (
    <div className="yarn-trail" aria-hidden="true">
      <span className="yarn-ball"></span>
      <span className="yarn-line"></span>
    </div>
  );
}

function Decorations() {
  return (
    <div className="decorations" aria-hidden="true">
      <span className="star star-one">&#9733;</span>
      <span className="star star-two">&#10022;</span>
      <span className="heart heart-one">&#9825;</span>
      <span className="heart heart-two">&#9825;</span>
      <span className="paw-print paw-one">
        <i></i>
      </span>
      <span className="paw-print paw-two">
        <i></i>
      </span>
    </div>
  );
}

function Confetti({ pieces }) {
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            '--left': piece.left,
            '--delay': piece.delay,
            '--hue': piece.hue,
            '--drift': piece.drift,
            '--rotation': piece.rotation,
          }}
        ></span>
      ))}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
