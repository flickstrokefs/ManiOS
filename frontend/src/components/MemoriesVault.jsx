import React from 'react';
import { X, Calendar, Bookmark, Heart, Sparkles } from 'lucide-react';
import { SYSTEM_DATA } from '../data/systemData';

export default function MemoriesVault({ onClose }) {
  const { memories } = SYSTEM_DATA;

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
          maxWidth: '720px',
          width: '100%',
          maxHeight: '88vh',
          borderRadius: 'var(--radius-lg)',
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid rgba(0, 229, 255, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
              <Bookmark size={20} />
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                Shared System Logs
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Uncorrupted kernel memories across the timeline
            </p>
          </div>

          <button
            className="cyber-btn cyber-btn-ghost"
            onClick={onClose}
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Timeline Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
          {memories.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                borderLeft: '4px solid var(--accent-green)',
                background: 'rgba(15, 23, 38, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="cyber-badge cyber-badge-amber">
                    <Calendar size={12} /> {m.year}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    {m.title}
                  </h3>
                </div>

                <span className="cyber-badge cyber-badge-cyan">
                  {m.badge}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                PROTOCOL: [{m.tag}]
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.65' }}>
                {m.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <Sparkles size={16} />
          <span>More logs being written every single day...</span>
        </div>
      </div>
    </div>
  );
}
