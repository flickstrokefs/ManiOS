import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Power, ChevronRight, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SYSTEM_DATA } from '../data/systemData';
import { sfx } from '../sound/sfx';

export default function BootSequence({ onBootComplete, onStartAudio }) {
  const [bootStarted, setBootStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const scrollRef = useRef(null);

  const startBoot = () => {
    sfx.playBootChime();
    onStartAudio();
    setBootStarted(true);
  };

  useEffect(() => {
    if (!bootStarted) return;

    if (currentLineIndex < SYSTEM_DATA.bootSequenceLines.length) {
      const timer = setTimeout(() => {
        sfx.playKeyClick();
        setCurrentLineIndex((prev) => prev + 1);

        // Auto-scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        // Fire confetti when birthday mode activates
        if (SYSTEM_DATA.bootSequenceLines[currentLineIndex]?.type === 'highlight') {
          sfx.playSuccess();
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00ff9d', '#00e5ff', '#ffffff', '#fbbf24']
            });
          } catch {
            // fallback
          }
        }
      }, 130);

      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      sfx.playSuccess();
    }
  }, [bootStarted, currentLineIndex]);

  const handleSkip = () => {
    setCurrentLineIndex(SYSTEM_DATA.bootSequenceLines.length);
    setIsFinished(true);
    sfx.playCommandExecute();
  };

  const handleEnterOS = () => {
    sfx.playCommandExecute();
    onBootComplete();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'radial-gradient(ellipse at center, rgba(10, 16, 26, 0.95) 0%, rgba(5, 7, 11, 0.98) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(8px)'
      }}
    >
      {!bootStarted ? (
        <div
          className="glass-panel-elevated"
          style={{
            maxWidth: '540px',
            width: '100%',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            animation: 'pulseGlow 3s infinite alternate'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '2px solid var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Power size={36} color="var(--accent-green)" />
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#fff',
                marginBottom: '0.35rem'
              }}
            >
              {SYSTEM_DATA.osName} <span style={{ color: 'var(--accent-green)' }}>v{SYSTEM_DATA.version}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {SYSTEM_DATA.systemConfig.releaseTag}
            </p>
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Volume2 size={16} color="var(--accent-green)" />
            <span>Soundtrack enabled & calibrated for playback</span>
          </div>

          <button
            className="cyber-btn cyber-btn-primary"
            onClick={startBoot}
            style={{
              fontSize: '1.05rem',
              padding: '0.85rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              marginTop: '0.5rem',
              letterSpacing: '0.05em'
            }}
          >
            <Power size={18} />
            INITIALIZE SYSTEM
          </button>
        </div>
      ) : (
        <div
          className="glass-panel-elevated"
          style={{
            maxWidth: '860px',
            width: '100%',
            height: '80vh',
            maxHeight: '680px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TerminalIcon size={18} color="var(--accent-green)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                BIOS :: Kernel Boot Loader
              </span>
            </div>

            {!isFinished && (
              <button
                className="cyber-btn cyber-btn-ghost"
                onClick={handleSkip}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Fast Forward ▶▶
              </button>
            )}
          </div>

          {/* Terminal log stream */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              lineHeight: '1.7',
              color: 'var(--text-main)'
            }}
          >
            {SYSTEM_DATA.bootSequenceLines.slice(0, currentLineIndex).map((line, idx) => {
              let color = 'var(--text-muted)';
              let icon = '';

              if (line.type === 'success') color = 'var(--accent-green)';
              if (line.type === 'accent') color = 'var(--accent-cyan)';
              if (line.type === 'highlight') {
                color = '#fff';
                return (
                  <div
                    key={idx}
                    style={{
                      margin: '1.2rem 0',
                      padding: '0.85rem 1.2rem',
                      background: 'rgba(0, 255, 157, 0.12)',
                      borderLeft: '4px solid var(--accent-green)',
                      borderRadius: '0 8px 8px 0',
                      color: 'var(--accent-green)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <Sparkles size={20} color="var(--accent-green)" />
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'quote') {
                return (
                  <div
                    key={idx}
                    style={{
                      fontStyle: 'italic',
                      color: '#d1fae5',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid rgba(0, 255, 157, 0.4)',
                      margin: '0.4rem 0'
                    }}
                  >
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'signature') {
                return (
                  <div
                    key={idx}
                    style={{
                      fontWeight: 700,
                      color: 'var(--accent-amber)',
                      marginTop: '0.5rem',
                      marginBottom: '0.8rem'
                    }}
                  >
                    {line.text}
                  </div>
                );
              }

              return (
                <div key={idx} style={{ color, wordBreak: 'break-word' }}>
                  {icon} {line.text}
                </div>
              );
            })}

            {!isFinished && <span className="cursor-blink" />}
          </div>

          {/* Footer action */}
          {isFinished && (
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border-color)',
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Kernel Status: <b style={{ color: 'var(--accent-green)' }}>ONLINE & VERIFIED</b>
              </span>
              <button
                className="cyber-btn cyber-btn-primary"
                onClick={handleEnterOS}
                style={{ fontSize: '0.95rem' }}
              >
                ENTER {SYSTEM_DATA.osName.toUpperCase()} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
