# Context & Project Dossier: Mani OS

## 1. Executive Summary

**Mani OS** is a personalized, cyberpunk-themed interactive terminal operating system created by **Shiva** as a heartfelt birthday gift for his lifelong best friend, **Mani Sharma**.

The project blends retro-futuristic hacker aesthetics (Matrix rain, CRT scanlines, Unix shell commands, and Web Audio SFX) with deeply personal milestones, shared inside jokes, and genuine admiration for Mani's intellect and aspirations.

---

## 2. Who is Mani?

Based on the system logs and profile configurations:
* **Full Identity:** Mani Sharma (`mani@root`)
* **Bond:** Known as Shiva's *"day-zero buddy"* and *"constant since Line 0"*. They have known each other since ~2006 (childhood).
* **Personality Archetype:** **INTP** (*The Logician / The Architect*)
  * Analytical, intensely curious, deep thinker, chaotic good, and deeply kind behind an intellectual firewall.
  * System quirk: Vulnerable to `overthinking.exe` whenever sleep drops below 4 hours.
* **Interests:**
  * Artificial Intelligence & Machine Learning
  * Quantum & Nuclear Physics
  * Anime & Storytelling
  * Crochet & Crafting
  * Chess Strategy
* **Academic & Career Path:**
  * Currently in **2nd year BTech CSE (Artificial Intelligence specialization)**.
  * Technical roadmap: Python ➔ Data Structures & Algorithms (DSA) ➔ AI & Deep Learning ➔ Scientific Research.
  * Ultimate Dream Goal: **Nuclear Research Scientist** (*"Blending atoms with algorithms"*).

---

## 3. The Creator's Narrative (Shiva)

The core emotional heartbeat of this project is expressed through quotes and terminal outputs written by Shiva:
> *"She was there before I could even open my eyes.*  
> *Before I could even speak her name — she already had it in her heart.*  
> *Day one. Always has been.*  
> *You don't just exist in my life — you anchor it.*  
> *The universe got one variable right: you."*

It is designed to celebrate her journey, boost her confidence in her dreams, and provide a memorable interactive experience that appeals directly to her geeky, analytical mindset.

---

## 4. Architectural Evolution

### Phase 1: The Legacy Version ([`alt/`](file:///c:/ShivaPS/ManOS/alt))
The project started as a pair of raw, static HTML files:
* [`alt/index.html`](file:///c:/ShivaPS/ManOS/alt/index.html): Boot screen with basic 2D canvas Matrix rain and a typewriter text log, terminating in a button linking to `terminal.html`.
* [`alt/terminal.html`](file:///c:/ShivaPS/ManOS/alt/terminal.html): Basic terminal interface with hardcoded `switch(command)` logic in vanilla JavaScript.
* [`alt/song.mpeg`](file:///c:/ShivaPS/ManOS/alt/song.mpeg): Background soundtrack embedded with HTML `<audio>`.
* [`alt/.gitlab-ci.yml`](file:///c:/ShivaPS/ManOS/alt/.gitlab-ci.yml): GitLab Pages deployment config.

**The Major Pain Points of the Legacy Setup:**
1. Hard page navigation (`window.location.href='terminal.html'`) killed the audio playback immediately when leaving the boot screen.
2. No command history navigation (could not press ↑ or ↓ to recall commands).
3. No Tab autocompletion.
4. No mobile-friendly input chips.
5. Lack of modularity and modern state management.

---

### Phase 2: The Modern Node.js Architecture ([`frontend/`](file:///c:/ShivaPS/ManOS/frontend))
The project was refactored into a single-page Node.js application built with **Vite + React 18**, **Vanilla CSS tokens**, and the **Web Audio API**:

| Subsystem | Implementation File | Key Features |
| :--- | :--- | :--- |
| **Boot Loader** | [`BootSequence.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/BootSequence.jsx) | Simulated kernel boot with streaming log lines, sound effects, birthday confetti celebration, and fast-forward mode. |
| **Interactive Terminal** | [`Terminal.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/Terminal.jsx) | Full Unix shell emulator with command history buffer (↑/↓), Tab autocompletion, quick command chips, and key-click audio feedback. |
| **Persistent Audio** | [`AudioPlayer.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/AudioPlayer.jsx) | Seamless music player playing [`song.mpeg`](file:///c:/ShivaPS/ManOS/frontend/public/song.mpeg) across all screens with waveform visualizer and volume control. |
| **Sound Synthesizer** | [`sfx.js`](file:///c:/ShivaPS/ManOS/frontend/src/sound/sfx.js) | Pure Web Audio API procedural sound engine (keyboard clicks, boot chimes, command beeps, error buzzers). |
| **Profile Inspector** | [`ProfileModal.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/ProfileModal.jsx) | Deep dive into Mani's INTP traits, academic roadmap, and trust protocol. |
| **Memory Vault** | [`MemoriesVault.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/MemoriesVault.jsx) | Interactive timeline of real shared memories from 2010 to present. |
| **Nuclear Sim Lab** | [`NuclearSim.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/NuclearSim.jsx) | Interactive atomic particle collider celebrating her dream of becoming a Nuclear Research Scientist. |
| **Visual Effects** | [`MatrixBackground.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/MatrixBackground.jsx) & [`CRTOverlay.jsx`](file:///c:/ShivaPS/ManOS/frontend/src/components/CRTOverlay.jsx) | 30 FPS Matrix digital rain and retro phosphor CRT scanline monitor effects. |

---

## 5. How to Run & Develop

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```
3. Open `http://localhost:3000` in any web browser.
