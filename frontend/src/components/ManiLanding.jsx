import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ManiLanding.css';
import { SIGNALS, SPOTS, TAGLINES, WHISPERS, BOOT_LINES, FULL_LOGS, FRAMES } from '../data/landingData';

export default function ManiLanding({ onEnterOS, onStartAudio, audioMuted, onToggleAudioMute }) {
  const [started, setStarted] = useState(false);
  const [curFrame, setCurFrame] = useState(0);
  const [outFrame, setOutFrame] = useState(null);
  const [heroStages, setHeroStages] = useState({ s1: false, s2: false, s3: false });
  const [isBooted, setIsBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [ksText, setKsText] = useState('KERNEL BOOTING…');
  const [tagIdx, setTagIdx] = useState(0);
  const [tagFade, setTagFade] = useState(false);
  const [foundSignals, setFoundSignals] = useState(new Set());
  const [activePopup, setActivePopup] = useState(null);
  const [isMuted, setIsMuted] = useState(audioMuted || false);
  const [theme, setTheme] = useState('dark');
  const [outFade, setOutFade] = useState(false);

  const canvasRef = useRef(null);
  const bootStreamRef = useRef(null);
  const logPanelRef = useRef(null);
  const statusRowRef = useRef(null);
  const parRef = useRef(null);
  const retRef = useRef(null);
  const wrapperRef = useRef(null);
  const fastRef = useRef(false);
  const curFrameRef = useRef(0);
  const startedRef = useRef(false);
  const cycTimerRef = useRef(null);
  const lastWhisperRef = useRef(0);
  const whisperIdxRef = useRef(0);

  curFrameRef.current = curFrame;
  startedRef.current = started;

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Frame slideshow control
  const showFrame = useCallback((index) => {
    if (index === curFrameRef.current) return;
    setOutFrame(curFrameRef.current);
    setTimeout(() => {
      setOutFrame(null);
    }, 2500);
    setCurFrame(index);
  }, []);

  const startCycle = useCallback(() => {
    if (cycTimerRef.current) clearInterval(cycTimerRef.current);
    cycTimerRef.current = setInterval(() => {
      showFrame((curFrameRef.current + 1) % FRAMES.length);
    }, 8000);
  }, [showFrame]);

  // Gentle, small confetti animation (30 pieces, 3-5px, 70% opacity, ~1.5s duration)
  const triggerConfetti = useCallback(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = ["#d3cb4e", "#f0e7ac", "#2a4a9a", "#c23b2c", "#7a7e2c"];
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * (canvas.height * 0.3),
      s: 3 + Math.random() * 2, // 3-5px
      v: 1.2 + Math.random() * 1.5,
      r: Math.random() * 6,
      w: Math.random() * 0.15 - 0.075,
      c: cols[Math.floor(Math.random() * cols.length)]
    }));

    let frameCount = 0;
    const totalFrames = 90; // ~1.5s at 60fps

    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fadeProgress = frameCount / totalFrames;
      const alpha = Math.max(0, 0.7 * (1 - fadeProgress * fadeProgress));
      ctx.globalAlpha = alpha;

      particles.forEach(p => {
        p.y += p.v;
        p.x += Math.sin(p.y / 35) * 0.8;
        p.r += p.w;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });

      if (++frameCount < totalFrames) {
        requestAnimationFrame(anim);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    };
    anim();
  }, [reducedMotion]);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Typewriter line helper
  const typeLine = async (targetLine, type, updateFn) => {
    if (fastRef.current || reducedMotion) {
      updateFn(targetLine);
      return;
    }
    for (let i = 1; i <= targetLine.length; i++) {
      updateFn(targetLine.slice(0, i));
      if (bootStreamRef.current) bootStreamRef.current.scrollTop = 1e5;
      await sleep(7);
    }
  };

  // Boot sequence typewriter (borderless text directly over artwork)
  const runBoot = useCallback(async () => {
    if (isBooted) return;
    setIsBooting(true);
    setKsText('KERNEL BOOTING…');
    await sleep(fastRef.current ? 0 : 250);

    const rendered = [];
    for (const item of BOOT_LINES) {
      const lineObj = { text: '', type: item.type };
      rendered.push(lineObj);
      setBootLines([...rendered]);

      if (item.type === 'ev') {
        triggerConfetti(); // Fire once on birthday event line
      }

      await typeLine(item.text, item.type, (partial) => {
        lineObj.text = partial;
        setBootLines([...rendered]);
      });

      if (bootStreamRef.current) bootStreamRef.current.scrollTop = 1e5;
      if (!fastRef.current) {
        await sleep(item.type === 'ev' ? 200 : 100);
      }
    }

    setIsBooted(true);
    await sleep(fastRef.current ? 0 : 350);
    setIsBooting(false);
    setKsText('KERNEL ONLINE ✓'); // Shortened status text with no overflow
  }, [isBooted, triggerConfetti, reducedMotion]);

  // Toggle full logs panel (opens above row, scrolled to top, closes on click-outside)
  const toggleLogPanel = (e) => {
    e.stopPropagation();
    setIsLogOpen(prev => {
      const next = !prev;
      if (next && logPanelRef.current) {
        logPanelRef.current.scrollTop = 0;
      }
      return next;
    });
  };

  // Start sequence on Click to Connect
  const begin = (skip) => {
    if (started) return;
    setStarted(true);
    if (onStartAudio) onStartAudio();

    if (skip) {
      fastRef.current = true;
      setHeroStages({ s1: true, s2: true, s3: true });
      runBoot();
      setTimeout(startCycle, 3000);
      return;
    }

    setTimeout(() => setHeroStages(prev => ({ ...prev, s1: true })), 600);
    setTimeout(() => setHeroStages(prev => ({ ...prev, s2: true })), 1800);
    setTimeout(() => setHeroStages(prev => ({ ...prev, s3: true })), 3600);
    setTimeout(runBoot, 4500);
    setTimeout(startCycle, 7000);
  };

  // Skip button handler
  const handleSkip = () => {
    if (!started) {
      begin(true);
    } else {
      fastRef.current = true;
      setHeroStages({ s1: true, s2: true, s3: true });
      runBoot();
    }
  };

  // Enter MANI OS handler (smooth ~500ms fade out)
  const handleEnterOS = () => {
    setOutFade(true);
    setTimeout(() => {
      if (onEnterOS) onEnterOS();
    }, 500);
  };

  // Tagline cycle
  const handleTitleClick = (e) => {
    e.stopPropagation();
    setTagFade(true);
    setTimeout(() => {
      setTagIdx((tagIdx + 1) % TAGLINES.length);
      setTagFade(false);
    }, 220);
  };

  // Open signal popup (NO confetti on 7/7)
  const openSignalPopup = async (id, targetEl) => {
    const sig = SIGNALS.find(s => s.id === id);
    if (!sig) return;

    if (id !== 'complete') {
      setFoundSignals(prev => {
        const next = new Set(prev);
        next.add(id);
        if (next.size === 7) {
          // No confetti on 7/7, just open transmission_complete.txt
          setTimeout(() => {
            openSignalPopup('complete', null);
          }, 1500);
        }
        return next;
      });
    }

    let popupStyle = {};
    if (targetEl && !window.matchMedia('(max-width:700px)').matches) {
      const r = targetEl.getBoundingClientRect();
      let left = r.right + 14;
      let top = r.top - 20;
      if (left + 300 > window.innerWidth - 16) {
        left = Math.max(16, r.left - 314);
      }
      if (top + 180 > window.innerHeight - 50) {
        top = Math.max(70, window.innerHeight - 230);
      }
      if (top < 70) top = 70;
      popupStyle = { left: `${left}px`, top: `${top}px` };
    }

    const lines = sig.text.split('\n');
    setActivePopup({ file: sig.file, lines: lines.map(() => ''), style: popupStyle });

    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      if (reducedMotion || fastRef.current) {
        setActivePopup(prev => {
          if (!prev) return null;
          const nextLines = [...prev.lines];
          nextLines[l] = line || ' ';
          return { ...prev, lines: nextLines };
        });
      } else {
        for (let i = 1; i <= line.length; i++) {
          const partial = line.slice(0, i);
          setActivePopup(prev => {
            if (!prev) return null;
            const nextLines = [...prev.lines];
            nextLines[l] = partial;
            return { ...prev, lines: nextLines };
          });
          await sleep(7);
        }
      }
      if (l < lines.length - 1 && !reducedMotion && !fastRef.current) {
        await sleep(50);
      }
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  // Sound toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (onToggleAudioMute) {
      onToggleAudioMute(next);
    }
  };

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  // Keyboard navigation & Esc popup dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        setIsLogOpen(false);
      }
      if (!startedRef.current) return;
      if (e.key === 'ArrowRight') {
        showFrame((curFrameRef.current + 1) % FRAMES.length);
      }
      if (e.key === 'ArrowLeft') {
        showFrame((curFrameRef.current + FRAMES.length - 1) % FRAMES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (cycTimerRef.current) clearInterval(cycTimerRef.current);
    };
  }, [showFrame]);

  // Parallax & Reticle pointer move
  const handlePointerMove = (e) => {
    if (window.matchMedia('(max-width:700px)').matches) return;
    if (retRef.current) {
      retRef.current.style.left = `${e.clientX}px`;
      retRef.current.style.top = `${e.clientY}px`;
      const isOverInteractive = !!e.target.closest('button, h1, .spot, .log-btn, .enter-btn, .boot-stream');
      retRef.current.classList.toggle('big', isOverInteractive);
    }
    if (!reducedMotion && parRef.current) {
      const x = (e.clientX / window.innerWidth - 0.5) * -22;
      const y = (e.clientY / window.innerHeight - 0.5) * -14;
      parRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  // Artwork click ripple and whisper (also closes open panels on outside click)
  const handleStageClick = (e) => {
    if (isLogOpen) {
      if (!e.target.closest('.log-panel, .log-btn')) {
        setIsLogOpen(false);
      }
    }
    if (activePopup) {
      if (!e.target.closest('#sig-popup, .spot')) {
        closePopup();
        return;
      }
    }
    if (e.target.closest('button, a, .status-row, .log-panel, .spot, #sig-popup, #gate, .top, .foot, h1, #ticks, #skip, .boot-stream')) {
      return;
    }
    if (!started) return;

    const now = performance.now();
    if (now - lastWhisperRef.current < 800) return;
    lastWhisperRef.current = now;

    if (!reducedMotion) {
      const rip = document.createElement('div');
      rip.className = 'artwork-ripple';
      rip.style.left = `${e.clientX}px`;
      rip.style.top = `${e.clientY}px`;
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 850);
    }

    const wsp = document.createElement('div');
    wsp.className = 'artwork-whisper';
    wsp.textContent = WHISPERS[whisperIdxRef.current % WHISPERS.length];
    whisperIdxRef.current++;
    wsp.style.left = `${Math.min(Math.max(e.clientX, 120), window.innerWidth - 140)}px`;
    wsp.style.top = `${Math.max(e.clientY - 20, 30)}px`;
    document.body.appendChild(wsp);
    setTimeout(() => wsp.remove(), 1200);
  };

  return (
    <div
      ref={wrapperRef}
      className={`landing-wrapper ${started ? 'run' : ''} ${isBooted ? 'booted' : ''} ${outFade ? 'out-fade' : ''}`}
      onPointerMove={handlePointerMove}
      onClick={handleStageClick}
    >
      {/* 5 Artwork Frame Layers with Push-in & Parallax */}
      <div className="stage" id="stage">
        <div className="par" id="par" ref={parRef}>
          {FRAMES.map((f, idx) => {
            const isActive = curFrame === idx;
            const isOut = outFrame === idx;
            return (
              <div
                key={idx}
                className={`f ${isActive ? 'on' : ''} ${isOut ? 'out' : ''} frame-${idx}`}
                style={{
                  backgroundImage: `url(${f.src})`,
                  '--tx': f.tx,
                  '--ty': f.ty
                }}
              >
                {/* Clearly visible Hotspots (~30px ring, red center) */}
                {SPOTS.filter(s => s.frame === idx).map(spot => {
                  const isFound = foundSignals.has(spot.id);
                  return (
                    <button
                      key={spot.id}
                      className={`spot ${isFound ? 'found' : ''}`}
                      id={`spot-${spot.id}`}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      aria-label={`Signal: ${spot.file}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openSignalPopup(spot.id, e.currentTarget);
                      }}
                    >
                      <span className="spot-ring" />
                      <span className="spot-dot" />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Lightened ambient overlays */}
        <div className="vig" />
        <div className="haze" />
        <div className="scan" />
        <div className="grain" />
      </div>

      {/* Confetti & Reticle */}
      <canvas id="cf" ref={canvasRef} />
      <div className="ret" id="ret" ref={retRef} />

      {/* Gate Screen */}
      <div id="gate" className={started ? 'gone' : ''}>
        <div>
          <p>&gt; wake up, mani</p>
          <button id="enter" onClick={() => begin(false)}>click to connect</button>
        </div>
      </div>

      {/* Skip Button */}
      {!isBooted && (
        <button id="skip" onClick={handleSkip}>skip ▸</button>
      )}

      {/* Top Bar */}
      <div className="top">
        <span><span className="dot" />ManiOS 6.0</span>
        <div>
          <button id="snd" aria-label="Toggle sound" onClick={toggleSound}>
            {isMuted ? '♪ off' : '♪ on'}
          </button>
          <button id="theme" aria-label="Toggle light and dark theme" onClick={toggleTheme}>
            day / night
          </button>
        </div>
      </div>

      {/* Bottom-left Column: HERO ON TOP → BOOTLOADER ON BOTTOM */}
      <div className="col" id="col">
        {/* 1. Hero Title & Tagline sitting in lower-middle (~55-60% down) */}
        <div className={`hero ${heroStages.s1 ? 's1' : ''} ${heroStages.s2 ? 's2' : ''} ${heroStages.s3 ? 's3' : ''}`} id="hero">
          <div className="lbl">a birthday system, for</div>
          <h1 title="Click to cycle tagline" onClick={handleTitleClick}>MANI</h1>
          <p className="tag" style={{ opacity: tagFade ? 0 : 1 }}>
            {TAGLINES[tagIdx]}
          </p>
        </div>

        {/* 2. Boot Area sitting at bottom with reserved height (zero layout shift) */}
        <div className="boot-area">
          {/* Borderless streaming boot lines over artwork while typing */}
          <div
            ref={bootStreamRef}
            className={`boot-stream ${isBooted ? 'faded' : ''}`}
            onClick={() => { fastRef.current = true; }}
            title="Click to fast-forward"
          >
            {bootLines.map((line, idx) => (
              <div key={idx} className={line.type}>
                {line.text}
              </div>
            ))}
          </div>

          {/* Full log dropdown panel (opens above row on log ▾, scrolled to top) */}
          {isLogOpen && (
            <div ref={logPanelRef} className="log-panel" role="region" aria-label="System Log">
              {FULL_LOGS.map((line, idx) => (
                <div key={idx} className={line.type}>
                  {line.text}
                </div>
              ))}
            </div>
          )}

          {/* Slim Status Row: Single nowrap flex row */}
          {(isBooting || isBooted) && (
            <div ref={statusRowRef} className={`status-row ${isBooted ? 'online' : ''}`}>
              <div className="status-left">
                <span className="kdot" />
                <span>{ksText}</span>
              </div>
              <div className="status-right">
                {isBooted && (
                  <button
                    className="log-btn"
                    onClick={toggleLogPanel}
                    aria-expanded={isLogOpen}
                    aria-label="Toggle system log"
                  >
                    {isLogOpen ? 'log ▴' : 'log ▾'}
                  </button>
                )}
                <button className="enter-btn" onClick={handleEnterOS}>
                  ENTER MANI OS ▸
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signal Popup Modal */}
      {activePopup && (
        <div
          id="sig-popup"
          className="sig-popup"
          style={{ display: 'flex', ...activePopup.style }}
          role="dialog"
          aria-hidden="false"
        >
          <div className="sig-popup-header">
            <span className="sig-popup-title"><span>📄</span> <b>{activePopup.file}</b></span>
            <button id="sig-close" className="sig-close-btn" aria-label="Close popup" onClick={closePopup}>✕</button>
          </div>
          <div className="sig-popup-body">
            <div id="sig-text" className="sig-text">
              {activePopup.lines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation Bar */}
      <div className="foot">
        <div className="ticks" id="ticks" role="group" aria-label="Frames">
          {FRAMES.map((_, i) => (
            <button
              key={i}
              className={curFrame === i ? 'on' : ''}
              aria-label={`Frame ${i + 1}`}
              onClick={() => {
                showFrame(i);
                if (cycTimerRef.current) clearInterval(cycTimerRef.current);
                startCycle();
              }}
            />
          ))}
        </div>
        <span id="sig-cnt" className="sig-counter">
          signals found {foundSignals.size}/7
        </span>
        <span className="foot-msg">no matter where you are, everyone is always connected</span>
      </div>
    </div>
  );
}
