import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, User, Bookmark, Atom, Monitor, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sfx } from '../sound/sfx';

export default function TopBar({
  onOpenProfile,
  onOpenMemories,
  onOpenNuclear,
  crtEnabled,
  onToggleCrt,
  onResetBoot
}) {
  const [time, setTime] = useState('');
  const [isSfxMuted, setIsSfxMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSfx = () => {
    const next = !isSfxMuted;
    setIsSfxMuted(next);
    sfx.setMuted(next);
  };

  return (
    <header
      style={{
        height: '48px',
        background: 'rgba(11, 16, 26, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 30,
        userSelect: 'none'
      }}
    >
      {/* Left: Branding & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
            Mani OS <span style={{ color: 'var(--accent-green)' }}>v5.0</span>
          </span>
          <span className="cyber-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
            ONLINE
          </span>
        </div>
      </div>

      {/* Center: Module Launchers */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={() => { sfx.playKeyClick(); onOpenProfile(); }}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          title="Open User Profile"
        >
          <User size={13} color="var(--accent-green)" />
          <span>Profile</span>
        </button>

        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={() => { sfx.playKeyClick(); onOpenMemories(); }}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          title="Open Shared System Logs"
        >
          <Bookmark size={13} color="var(--accent-amber)" />
          <span>Memories</span>
        </button>

        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={() => { sfx.playKeyClick(); onOpenNuclear(); }}
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          title="Open Nuclear Simulation Lab"
        >
          <Atom size={13} color="var(--accent-cyan)" />
          <span>Nuclear Lab</span>
        </button>
      </nav>

      {/* Right: Controls & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={onToggleCrt}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: crtEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}
          title="Toggle CRT Screen Scanlines"
        >
          <Monitor size={14} />
          <span style={{ display: 'none' }}>CRT</span>
        </button>

        <button
          className="cyber-btn cyber-btn-ghost"
          onClick={toggleSfx}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: !isSfxMuted ? 'var(--accent-green)' : 'var(--text-muted)' }}
          title="Toggle SFX Synthesizer"
        >
          {isSfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {time}
        </div>
      </div>
    </header>
  );
}
