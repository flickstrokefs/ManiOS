import React, { useState } from 'react';
import MatrixBackground from './components/MatrixBackground';
import CRTOverlay from './components/CRTOverlay';
import BootSequence from './components/BootSequence';
import TopBar from './components/TopBar';
import Terminal from './components/Terminal';
import AudioPlayer from './components/AudioPlayer';
import ProfileModal from './components/ProfileModal';
import MemoriesVault from './components/MemoriesVault';
import NuclearSim from './components/NuclearSim';
import { Power, RotateCcw } from 'lucide-react';
import { sfx } from './sound/sfx';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [startAudioTrigger, setStartAudioTrigger] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [nuclearOpen, setNuclearOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isShutDown, setIsShutDown] = useState(false);

  const handleBootComplete = () => {
    setBooted(true);
  };

  const handleStartAudio = () => {
    setStartAudioTrigger(true);
  };

  const handleShutdown = () => {
    setIsShutDown(true);
  };

  const handleRestart = () => {
    sfx.playBootChime();
    setIsShutDown(false);
    setBooted(false);
  };

  if (isShutDown) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#020305',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          color: 'var(--accent-green)',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <CRTOverlay enabled={crtEnabled} />
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          System Powered Off 🖤
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.95rem' }}>
          Friendship Kernel safely unmounted. Thank you for being you, Mani.
        </p>
        <button
          className="cyber-btn cyber-btn-primary"
          onClick={handleRestart}
          style={{ padding: '0.75rem 1.8rem', fontSize: '1rem' }}
        >
          <RotateCcw size={16} /> REBOOT SYSTEM
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Matrix Rain */}
      <MatrixBackground opacity={booted ? 0.45 : 0.85} themeColor="#00ff9d" />

      {/* CRT Scanline Overlay */}
      <CRTOverlay enabled={crtEnabled} />

      {/* Boot Screen Sequence */}
      {!booted && (
        <BootSequence
          onBootComplete={handleBootComplete}
          onStartAudio={handleStartAudio}
        />
      )}

      {/* Desktop OS Environment */}
      {booted && (
        <>
          <TopBar
            onOpenProfile={() => setProfileOpen(true)}
            onOpenMemories={() => setMemoriesOpen(true)}
            onOpenNuclear={() => setNuclearOpen(true)}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            onResetBoot={() => setBooted(false)}
          />

          <main
            style={{
              flex: 1,
              display: 'flex',
              padding: '1.25rem',
              gap: '1rem',
              zIndex: 10,
              maxWidth: '1400px',
              width: '100%',
              margin: '0 auto',
              overflow: 'hidden'
            }}
          >
            {/* Main Interactive Terminal */}
            <div style={{ flex: 1, height: '100%', minWidth: 0 }}>
              <Terminal
                onExit={handleShutdown}
                onOpenWindow={(name) => {
                  if (name === 'profile') setProfileOpen(true);
                  if (name === 'memories') setMemoriesOpen(true);
                  if (name === 'nuclear') setNuclearOpen(true);
                }}
              />
            </div>
          </main>

          {/* Persistent Background Music Player */}
          <AudioPlayer autoPlayTrigger={startAudioTrigger} />

          {/* Modals & Sub-Modules */}
          {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
          {memoriesOpen && <MemoriesVault onClose={() => setMemoriesOpen(false)} />}
          {nuclearOpen && <NuclearSim onClose={() => setNuclearOpen(false)} />}
        </>
      )}
    </div>
  );
}
