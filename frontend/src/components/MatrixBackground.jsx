import React, { useEffect, useRef } from 'react';

export default function MatrixBackground({ opacity = 0.85, themeColor = '#00ff9d' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '01MANISHIVAKERNEL2026AIQUANTUMPHYSICSCSE{}[]<>$#@%*+=~^0123456789';
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
    };

    window.addEventListener('resize', handleResize);

    let lastDraw = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for authentic terminal feel and low CPU usage

    const render = (timestamp) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = timestamp - lastDraw;
      if (elapsed < fpsInterval) return;
      lastDraw = timestamp - (elapsed % fpsInterval);

      // Semi-transparent black overlay for fade trail
      ctx.fillStyle = 'rgba(5, 7, 11, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = themeColor;
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Occasional brighter leader glyph
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x, y);
          ctx.fillStyle = themeColor;
        } else {
          ctx.fillText(text, x, y);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: opacity,
        transition: 'opacity 0.6s ease'
      }}
    />
  );
}
