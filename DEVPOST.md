# 🐾 Commit Critter — Devpost Submission Copy

*Copy and paste these sections directly into your Devpost submission form!*

---

### Project Title
**Commit Critter**

### Tagline / Elevator Pitch
A browser-based virtual pet that lives in a retro Tamagotchi handheld and evolves with your real-time GitHub commit history!

---

### Inspiration
The hackathon is called **First Commit** — a celebration of taking your first step as a developer. But staying consistent as a beginner can be daunting: code commits can often feel abstract, cold, and lonely.

We asked ourselves: *What if every commit you pushed nourished a digital companion?* What if your daily streak helped a tiny, speckled egg evolve into an Ascended Mythic Dragon, while your top programming language bestowed it with elemental powers? 

That was the spark for **Commit Critter**: transforming Git activity from a routine task into a joyful, nostalgic, and habit-forming Tamagotchi adventure.

---

### What it does
- 🐾 **Zero-Friction Onboarding**: Enter any public GitHub username (or click one of our curated famous profiles like Linus Torvalds or Dan Abramov) — no signups, no OAuth, instant payoff.
- ⚡ **Biological State Engine**:
  - **Energy**: Decays with inactivity; restored by fresh `git push` events.
  - **Happiness**: Grows with consistent streaks; boosted by petting and scratching.
  - **Hunger**: Increases if you don't commit for days; fed with tasty "commit snacks".
- 🧬 **5-Stage Evolution & 6 Elemental Affinities**:
  - Evolves from **Egg $\rightarrow$ Hatchling $\rightarrow$ Juvenile $\rightarrow$ Adult $\rightarrow$ Mythic Sovereign** based on lifetime commit volume.
  - Elemental skins dynamically adapt to your top language: **Flora** (Python/Java), **Volt** (JavaScript/TypeScript), **Ferro** (Rust/C++), **Tidal** (Go/Ruby), **Prism** (HTML/CSS/Swift), or **Void** (Cosmic).
- 🔊 **Procedural 8-bit Sound Engine**: Uses the browser's Web Audio API to synthesize authentic retro chirps, eating crunches, purrs, and RPG level-up fanfares without a single external audio file.
- 🕹️ **Handheld Tamagotchi Shell**: 4 interchangeable shell themes (DMG-01 Classic GameBoy, Cyberpunk 2077, Sakura Kawaii, Atomic 90s) with tactile A/B/C action buttons and authentic CRT scanlines.
- 🛠️ **Judge Sandbox / Time Machine**: Built specifically for judges and demo videos — scrub days forward to test inactivity decay, simulate git pushes, and trigger evolutions on demand.
- 📸 **Spotify-Wrapped Style "Critter Passport"**: Renders a high-res 1200x630 shareable PNG card with stats, QR code, and personal quirks ready for Twitter/X or LinkedIn.
- 📱 **PWA & Offline Capable**: Manifest and Service Worker support "Add to Home Screen" on mobile devices with browser notifications when your critter misses you.

---

### How we built it
- **Frontend Framework**: React 18 with TypeScript for robust type-safety and rapid rendering.
- **Styling & Retro CRT Effects**: Tailwind CSS with custom pixel keyframes, scanline gradients, and retro typography (*Press Start 2P*, *VT323*, *JetBrains Mono*).
- **Audio Synthesis**: Native HTML5 Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
- **Card Generator**: HTML5 Canvas 2D context for high-DPI procedural graphic export.
- **Data Ingestion**: Public GitHub REST API (`/users`, `/events/public`, `/repos`) paired with smart `localStorage` caching to mitigate rate limits.
- **Animations & Celebrations**: Dynamic inline SVG state morphing and `canvas-confetti`.

---

### Challenges we ran into
1. **GitHub Unauthenticated Rate Limits**: GitHub limits unauthenticated requests to 60/hr per IP. To ensure judges never encounter a blank screen or 403 error, we engineered a multi-layer strategy: client-side caching with TTL, curated mock fixtures, and friendly rate-limit warnings.
2. **Web Audio Wave Synthesis**: Designing believable, charming retro sound effects from pure math (sine, square, sawtooth, and noise frequencies) required careful tuning of attack/decay envelopes and arpeggio intervals.
3. **Responsive Pixel Graphics**: Building a morphing SVG creature that looks cohesive across 5 distinct evolutionary stages and 6 elemental skins while maintaining high-framerate idle and reaction animations.

---

### Accomplishments that we're proud of
- **100% Client-Side Independence**: Zero server overhead, zero external sound asset dependencies, zero API keys required.
- **The Judge Sandbox**: Ensuring that a judge with only 3 minutes to review can experience the full arc of a 30-day coding journey.
- **Design Polish**: The authentic feel of the Tamagotchi shell, tactile buttons, sound design, and Spotify-Wrapped style passport.

---

### What we learned
- How to model living digital biological behavior using Finite State Machines (FSM).
- Procedural audio synthesis with the Web Audio API.
- Procedural image rendering and canvas composition using HTML5 Canvas.
- Progressive Web App caching strategies with Service Workers.

---

### What's next for Commit Critter
- A **VS Code Extension** and **GitHub CLI Companion** (`gh critter`) so your pet can live in your terminal or status bar while you code!
- **Multiplayer Critter Battles**: Challenge friends to friendly battles powered by commit streaks and PR activity!

---

### Built With
`react`, `typescript`, `vite`, `tailwindcss`, `web-audio-api`, `html5-canvas`, `github-api`, `pwa`, `service-worker`
