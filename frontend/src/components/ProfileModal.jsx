import React from 'react';
import { User, X, Brain, Atom, Sparkles, CheckCircle2, ShieldCheck, Heart, Tv, Trophy, Cpu } from 'lucide-react';
import { SYSTEM_DATA, PERSONAL_DATA } from '../data/systemData';

export default function ProfileModal({ onClose }) {
  const { profile } = SYSTEM_DATA;

  const getInterestIcon = (name) => {
    switch (name) {
      case 'Brain':
        return <Brain size={16} color="var(--accent-green)" />;
      case 'Atom':
        return <Atom size={16} color="var(--accent-cyan)" />;
      case 'Tv':
        return <Tv size={16} color="#fbbf24" />;
      case 'Sparkles':
        return <Sparkles size={16} color="#e879f9" />;
      case 'Trophy':
        return <Trophy size={16} color="#38bdf8" />;
      default:
        return <Sparkles size={16} color="var(--accent-green)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0, 0, 0, 0.75)',
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
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg)',
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid var(--accent-green)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(0, 255, 157, 0.15)',
                border: '2px solid var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <User size={28} color="var(--accent-green)" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.6rem', color: '#fff', fontWeight: 700 }}>
                {profile.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <span className="cyber-badge">{profile.personality}</span>
                <span className="cyber-badge cyber-badge-cyan">{profile.academic.status}</span>
                <span className="cyber-badge cyber-badge-amber">{profile.role}</span>
              </div>
            </div>
          </div>

          <button
            className="cyber-btn cyber-btn-ghost"
            onClick={onClose}
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Traits */}
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            CORE ATTRIBUTES & TRAITS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
            {profile.traits.map((trait, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                <Sparkles size={14} color="var(--accent-green)" />
                <span style={{ color: 'var(--text-main)' }}>{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            AUTHENTIC PERSONAL INTERESTS:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
            {profile.interests.map((interest, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontSize: '0.85rem'
                }}
              >
                {getInterestIcon(interest.icon)}
                <span style={{ color: 'var(--text-main)' }}>{interest.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strength Protocols */}
        {profile.strengthProtocols && (
          <div
            style={{
              background: 'rgba(0, 255, 157, 0.05)',
              border: '1px solid rgba(0, 255, 157, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Cpu size={16} />
              <span>Strength Protocols & Cognitive Architecture</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
              {profile.strengthProtocols.map((sp, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 255, 157, 0.2)',
                    color: '#e2e8f0'
                  }}
                >
                  ⚡ {sp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dream Node */}
        <div
          style={{
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <Atom size={20} />
            <span>Target Life Node: {profile.academic.targetGoal}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            "{profile.academic.targetGoalSubtitle}"
          </div>
          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            {profile.academic.currentFocus}
          </p>

          <div style={{ marginTop: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Roadmap Sequence:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
              {profile.academic.roadmap.map((step, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.76rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)'
                  }}
                >
                  {idx + 1}. {step}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* System Protocols & Trust */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontWeight: 700 }}>
            <ShieldCheck size={18} />
            <span>Friendship Kernel Security & Trust Protocol</span>
          </div>
          {profile.systemNotes.map((note, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <CheckCircle2 size={14} color="var(--accent-green)" />
              <span>{note}</span>
            </div>
          ))}
        </div>

        {/* Footer quote */}
        <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Heart size={16} fill="var(--accent-green)" color="var(--accent-green)" />
          <span>Constant since Line 0 • Crafted by {SYSTEM_DATA.developer}</span>
        </div>
      </div>
    </div>
  );
}
