import React from 'react';

export default function CRTOverlay({ enabled = true }) {
  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        background: `
          linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
          linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))
        `,
        backgroundSize: '100% 3px, 4px 100%',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.7)'
      }}
    />
  );
}
