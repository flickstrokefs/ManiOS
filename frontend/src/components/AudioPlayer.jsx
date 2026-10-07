import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Music } from 'lucide-react';
import { sfx } from '../sound/sfx';

export default function AudioPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy fallback
        });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    sfx.playKeyClick();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    sfx.playKeyClick();
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/song.mpeg"
        loop
        onTimeUpdate={handleTimeUpdate}
      />

      <div
        className="glass-panel"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 40,
          borderRadius: 'var(--radius-md)',
          padding: minimized ? '0.5rem 0.8rem' : '0.85rem 1.15rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: minimized ? 'auto' : '340px',
          width: minimized ? 'auto' : 'calc(100vw - 2.5rem)',
          boxShadow: 'var(--shadow-card)',
          transition: 'all 0.3s ease',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => setMinimized(!minimized)}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0, 255, 157, 0.15)',
                border: '1px solid var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isPlaying ? 'pulseGlow 2s infinite' : 'none'
              }}
            >
              <Music size={16} color="var(--accent-green)" />
            </div>

            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Mani OS Soundtrack
                {isPlaying && (
                  <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'flex-end', height: '12px' }}>
                    <span style={{ width: 2, height: '100%', background: 'var(--accent-green)', animation: 'blink 0.6s infinite' }} />
                    <span style={{ width: 2, height: '60%', background: 'var(--accent-green)', animation: 'blink 0.4s infinite alternate' }} />
                    <span style={{ width: 2, height: '80%', background: 'var(--accent-green)', animation: 'blink 0.8s infinite' }} />
                  </span>
                )}
              </div>
              {!minimized && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  song.mpeg • Friendship Kernel OST
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              className="cyber-btn"
              onClick={togglePlay}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)'
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {minimized ? '' : isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              className="cyber-btn cyber-btn-ghost"
              onClick={() => setMinimized(!minimized)}
              style={{ padding: '0.35rem', fontSize: '0.75rem' }}
              title={minimized ? 'Expand Player' : 'Collapse Player'}
            >
              <Disc size={14} />
            </button>
          </div>
        </div>

        {!minimized && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = pos * duration;
                }
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${duration ? (progress / duration) * 100 : 0}%`,
                  background: 'var(--accent-green)',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>{formatTime(progress)}</span>

              {/* Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span onClick={toggleMute} style={{ cursor: 'pointer' }}>
                  {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ width: '60px', accentColor: 'var(--accent-green)', height: '3px', cursor: 'pointer' }}
                />
              </div>

              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
