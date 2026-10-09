import React, { useState, useEffect, useRef } from 'react';
import { X, Atom, Zap, RefreshCw, Sparkles } from 'lucide-react';
import { sfx } from '../sound/sfx';
import { SYSTEM_DATA } from '../data/systemData';

export default function NuclearSim({ onClose }) {
  const canvasRef = useRef(null);
  const [energyLevel, setEnergyLevel] = useState(75);
  const [particleCount, setParticleCount] = useState(40);
  const [collisionCount, setCollisionCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    const width = (canvas.width = 560);
    const height = (canvas.height = 340);

    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (energyLevel / 20),
      vy: (Math.random() - 0.5) * (energyLevel / 20),
      radius: 3 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#00ff9d' : '#00e5ff'
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 18, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Center atom core
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 28, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 157, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#00ff9d';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Orbit rings
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 110, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.stroke();

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off bounds
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw entanglement links
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 55) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 157, ${1 - dist / 55})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [energyLevel, particleCount]);

  const handleEnergize = () => {
    sfx.playCommandExecute();
    setEnergyLevel((prev) => Math.min(100, prev + 10));
    setCollisionCount((prev) => prev + 12);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-elevated"
        style={{
          maxWidth: '640px',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          border: '1px solid var(--accent-cyan)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-cyan)' }}>
            <Atom size={22} />
            <div>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
                {SYSTEM_DATA.systemConfig.nuclearLab.title}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {SYSTEM_DATA.systemConfig.nuclearLab.subtitle}
              </div>
            </div>
          </div>

          <button className="cyber-btn cyber-btn-ghost" onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Simulation Canvas */}
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', background: '#070b12' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plasma Flux Containment:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>
              {energyLevel} MeV • {collisionCount} Fusions Recorded
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="cyber-btn cyber-btn-primary" onClick={handleEnergize}>
              <Zap size={14} /> Inject Energy
            </button>
            <button className="cyber-btn cyber-btn-ghost" onClick={() => { setEnergyLevel(50); setCollisionCount(0); }}>
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
