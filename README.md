<div align="center">

# বাঘ ও ছাগল — TIGER & GOAT
### *এক চালেই বদলে যায় খেলা • One Move Changes Everything*

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-A9513B.svg)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%20%2F%20ESNext-3178C6.svg)](#)
[![Canvas](https://img.shields.io/badge/Graphics-HTML5%20Canvas%202.5D-E8DCBE.svg)](#)
[![Audio](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio%20API-566548.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-C19A58.svg)](LICENSE)

*A culturally immersive, asymmetrical traditional strategy game inspired by the centuries-old Bangladeshi folk pastime, re-engineered for modern mobile and web platforms.*

---

</div>

## 🌿 The Vision & Cultural Heritage

Long before glowing digital screens, monsoon afternoons in rural Bengal were spent on clay courtyards, school verandas, and wooden benches. With a piece of chalk, a stick drawn through damp earth, or a pen on the back of an old notebook, twenty-five intersections were marked. Four tigers faced twenty goats.

**বাঘ ও ছাগল (Tiger & Goat)** preserves this nostalgic memory while transforming it into a polished, art-directed strategy experience. Every sound, shadow, wood scar, and particle has been handcrafted to capture the quiet, contemplative soul of traditional South Asian tabletop strategy.

---

## 🎮 Core Rules & Asymmetric Strategy

The game is played on a canonical $5 \times 5$ intersection topology (25 nodes connected by 56 bidirectional orthogonal and diagonal edges).

```text
(0,0)---(0,1)---(0,2)---(0,3)---(0,4)
  | \     |     / | \     |     / |
(1,0)---(1,1)---(1,2)---(1,3)---(1,4)
  |   /   |   \   |   /   |   \   |
(2,0)---(2,1)---(2,2)---(2,3)---(2,4)
  | \     |     / | \     |     / |
(3,0)---(3,1)---(3,2)---(3,3)---(3,4)
  |   /   |   \   |   /   |   \   |
(4,0)---(4,1)---(4,2)---(4,3)---(4,4)
1. The Forces
Tigers (৪টি বাঘ): Stationed at the 4 board corners: (0,0), (0,4), (4,0), (4,4).
Goats (২০টি ছাগল): Start in reserve (goatsToPlace = 20). Goats move first.
2. Phases of Play
Phase 1: Placement (চলতি চাল ও বসানো): Goats are placed one by one onto vacant intersections. Tigers move 1 step along connected lines or perform jump-captures over an adjacent goat into an immediately vacant landing node.
Phase 2: Movement (ঘূর্ণন চাল): Once all 20 goats are placed, goats move 1 step to adjacent vacant nodes. Goats cannot jump or capture.
3. Victory Conditions
Goats Win (বাঘ বন্দি): All 4 tigers are completely immobilized with zero legal steps or jump-captures available.
Tigers Win (বাঘের জয়): Tigers successfully capture 5 goats, rendering the remaining herd mathematically incapable of trapping all 4 apex predators.
✨ Features & Architecture
🐅 1. Handcrafted 3D Folk Medallions (ঘুঁটি)
2.5D Cylindrical Extrusion: Multi-layered procedural beveling with directional drop shadows and contact shading.
Kalighat Folk Art Relief:
Tiger: Royal Bengal tiger trident forehead stripes (ত্রিশূল নকশা), almond feline eyes, and an embossed beaded rim.
Goat: Carved spiral horns (বাঁকানো শিং) with ridge notches, muzzle bevel, and earthen clay styling.
Dynamic Physics: Pieces physically elevate on the 
Z
Z
-axis upon selection and hop across the grid with an animated ease-out arc.
🌧️ 2. Real-Time Atmospheric Particle Engine
🏡 গ্রামের উঠান (Village Courtyard): Drifting banyan/mango leaves swaying across the board, golden dust motes, and diagonal sunbeams (god-rays).
🌧️ বর্ষার বিকেল (Monsoon Slate): Diagonal rain streaks, expanding water ripples on the wet slate board mat, and misty ambiance.
🐅 সুন্দরবনের গহীন (Sundarban Forest): Deep mangrove moss with glowing bioluminescent fireflies (জোনাকি পোকা) pulsing with green-gold light.
🏫 স্কুলের কাঠের ডেস্ক (School Wood Desk): Weathered classroom desk with chalk dust and pencil grooves.
🔊 3. Zero-Asset Procedural Web Audio Engine
No external audio files required. All soundscapes are synthesized natively via the Web Audio API:
Wooden Piece Tap: Resonant damped sine and noise burst simulating a carved wooden piece striking baked earth.
🐐 Goat Bleat Scream: Frequency-modulated nasal vocal tract bleat ("ম্যাঁ-অ্যাঁ-হ!") triggered upon capture.
🐅 Trapped Tiger Roar: Sub-bass guttural growl ("গ্ররর-আউ!") with throat flutter when tigers are immobilized.
🩸 Blood Splatter: Jump captures leave a temporary crimson stain with organic droplets that seep into the wood and fade over 4.5 seconds.
জয়ের রাগ/সুর: Traditional Bengali folk pentatonic flute melody (Sa-Re-Ga-Pa-Dha) celebrating victory.
🧠 4. Tactical Minimax AI
সহজ (Easy): Depth 1–2 with a 25% tactical blunder margin for casual and young players.
মাঝারি (Medium): Depth 3 with jump-priority move ordering and vulnerability assessment.
ওস্তাদ (Expert): Depth 4 Alpha-Beta search calculating trap coordinates, cluster formations, and fork threats.
🗺️ 5. Adventure Campaign Mode
10 curated puzzle levels with custom board topologies, limited move counters, and star ratings:
১. উঠানের প্রথম পাঠ (Courtyard First Lesson)
২. কোণার ফাঁদ (Corner Ambush)
৩. শিকারির চোখ (Hunter's Eye)
৪. কঞ্চি বেড়া (The Bamboo Fence)
৫. স্কুলের টিফিন (School Break Duel)
৬. বর্ষার বিকেল (Monsoon Afternoon)
৭. দ্বিমুখী আক্রমণ (Double Threat)
৮. পুরান ঢাকার অলিগলি (Old Dhaka Alley)
৯. সুন্দরবনের ছায়া (Sundarban Shadows)
১০. বাঘের রাজ্য — সুন্দরবনের অধিপতি (The Tiger King)
🛠️ Tech Stack & Directory Structure
Language: TypeScript / ESNext
Bundler & Server: Vite 5
Rendering: HTML5 Canvas (Hardware-accelerated 2D context)
Audio: Web Audio API (Synthesizers & Noise Generators)
Cross-Platform Shell: Capacitor 6 (Android & iOS Native)
code
Text
tiger-and-goat/
├── public/
│   ├── assets/icon.svg           # Handcrafted vector app icon
│   └── manifest.json             # PWA standalone manifest
├── src/
│   ├── ai/
│   │   ├── Evaluator.ts          # Mobility & trapping heuristics
│   │   └── MinimaxAI.ts          # Alpha-Beta pruning search
│   ├── audio/
│   │   └── SoundManager.ts       # Procedural audio engine
│   ├── cosmetics/
│   │   └── ScenarioRegistry.ts   # 4 environmental themes
│   ├── engine/
│   │   ├── BoardTopology.ts      # 25-node topology & jump paths
│   │   └── RulesEngine.ts        # Turn management & victory logic
│   ├── adventure/
│   │   └── CampaignLevels.ts     # 10 curated campaign levels
│   ├── storage/
│   │   └── StorageManager.ts     # Local persistence & XP system
│   ├── ui/
│   │   ├── AtmosphereEngine.ts   # Particle weather simulation
│   │   ├── BoardCanvas.ts        # High-DPI canvas & touch controller
│   │   └── PieceRenderer.ts      # 3D Guti medallion renderer
│   ├── main.ts                   # Game lifecycle & studio UI
│   └── style.css                 # Earthen palette & animations
├── capacitor.config.ts           # Native mobile configuration
└── package.json
🚀 Quick Start
1. Clone & Install
code
Bash
git clone https://github.com/MejbahZidan/tiger-and-goat.git
cd tiger-and-goat
npm install
2. Run Local Development Server
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
3. Play on Mobile (Same Wi-Fi)
code
Bash
npx vite --host
Open the network IP shown in your phone's browser, then tap Add to Home screen for a standalone fullscreen mobile app experience.
4. Build Native Android APK
code
Bash
npm run build
npx cap add android
npx cap open android
In Android Studio: Build 
→
→
 Build Bundle(s) / APK(s) 
→
→
 Build APK(s).
📜 License & Acknowledgments
This project is open-source under the MIT License.
Dedicated to the children who played Bagh-Chal in village courtyards across Bangladesh, and to everyone keeping traditional folk games alive in the modern digital era.
<div align="center">
<b>বাঘ ও ছাগল • এক চালেই বদলে যায় খেলা।</b>
</div>
