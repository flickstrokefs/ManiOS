import React, { useState } from 'react';
import ManiLanding from './components/ManiLanding';
import MatrixBackground from './components/MatrixBackground';
import CRTOverlay from './components/CRTOverlay';
import TopBar from './components/TopBar';
import Terminal from './components/Terminal';
import AudioPlayer from './components/AudioPlayer';
import ProfileModal from './components/ProfileModal';
import MemoriesVault from './components/MemoriesVault';
import NuclearSim from './components/NuclearSim';
import { Power, RotateCcw } from 'lucide-react';
import { sfx } from './sound/sfx';
import { SYSTEM_DATA } from './data/systemData';

export default function App() {
  const [inLanding, setInLanding] = useState(true);
  const [booted, setBooted] = useState(false);
  const [startAudioTrigger, setStartAudioTrigger] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [nuclearOpen, setNuclearOpen] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isShutDown, setIsShutDown] = useState(false);

  const handleStartAudio = () => {
    setStartAudioTrigger(true);
  };

  const handleToggleAudioMute = (muted) => {
    setAudioMuted(muted);
  };

  const handleEnterOS = () => {
    sfx.playBootChime();
    setInLanding(false);
    setBooted(true);
  };

  const handleShutdown = () => {
    setIsShutDown(true);
  };

  const handleRestart = () => {
    sfx.playBootChime();
    setIsShutDown(false);
    setBooted(false);
    setInLanding(true);
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
          Friendship Kernel safely unmounted. Thank you for being you, {SYSTEM_DATA.profile.nickname || SYSTEM_DATA.user}.
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
      {/* Background Matrix Rain (Desktop) */}
      {!inLanding && (
        <MatrixBackground opacity={booted ? 0.45 : 0.85} themeColor="#00ff9d" />
      )}

      {/* CRT Scanline Overlay (Desktop) */}
      {!inLanding && (
        <CRTOverlay enabled={crtEnabled} />
      )}

      {/* Mani OS Landing + Boot Experience */}
      {inLanding && (
        <ManiLanding
          onEnterOS={handleEnterOS}
          onStartAudio={handleStartAudio}
          audioMuted={audioMuted}
          onToggleAudioMute={handleToggleAudioMute}
        />
      )}

      {/* Desktop OS Environment */}
      {!inLanding && booted && (
        <>
          <TopBar
            onOpenProfile={() => setProfileOpen(true)}
            onOpenMemories={() => setMemoriesOpen(true)}
            onOpenNuclear={() => setNuclearOpen(true)}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            onResetBoot={() => {
              setBooted(false);
              setInLanding(true);
            }}
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

          {/* Modals & Sub-Modules */}
          {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
          {memoriesOpen && <MemoriesVault onClose={() => setMemoriesOpen(false)} />}
          {nuclearOpen && <NuclearSim onClose={() => setNuclearOpen(false)} />}
        </>
      )}

      {/* Persistent Background Music Player (continuous across landing and desktop) */}
      <AudioPlayer
        autoPlayTrigger={startAudioTrigger}
        visible={!inLanding && booted}
        isMutedExternal={audioMuted}
        onToggleMuteExternal={handleToggleAudioMute}
      />
    </div>
  );
}
