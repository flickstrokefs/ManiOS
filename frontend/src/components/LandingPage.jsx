import React from 'react';
import ManiLanding from './ManiLanding';

export default function LandingPage({ onBoot, onStartAudio }) {
  return (
    <ManiLanding
      onEnterOS={onBoot}
      onStartAudio={onStartAudio}
    />
  );
}
