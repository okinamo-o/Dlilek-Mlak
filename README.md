# دليلك ملاك — Dlilek Mlak 🎁

A host-controlled, TV game show web application clone of the famous Tunisian show **"Dlilek Mlak" (دليلك ملاك)** (Deal or No Deal adaptation). Built for private parties, livestreams, and projector displays.

---

## 🌟 Features

- **Host Setup Mode (لوحة تحكم المضيف)**:
  - Presets: 9, 12, 16, 20, 24 (Classic TV format), 26 (Deal or No Deal) + custom count (4 to 30).
  - Free-text prize entries with automatic regex parsing for monetary values (e.g. `5000 دينار`, `10 ملاين`, `0.5 DT`).
  - Manual cash override for physical / gag gifts (e.g. `كردونة`, `iPhone`, `سيارة`).
  - One-click classic Tunisian prize templates (`💡 تعبئة جوائز دليلك ملاك الأصلية`).
  - Position shuffle (`🎲 خلط أماكن الجوائز`) and `localStorage` preset saving/loading.

- **Contestant Play Mode (شاشة اللعب والجمهور)**:
  - TV studio atmosphere with stage spotlights, golden 3D chests, and glowing counters.
  - Contestant lucky box selection with center stage podium.
  - Suspenseful chest-opening elimination rounds.
  - **Live Prize Board**: Dual-column TV board (Blue for low/gag prizes, Red for jackpots) that greys out eliminated prizes in real time with line-through and `X` indicators.
  - **Banker Phone Calls (📞 اتصال البنكار)**: Animated ringing vintage phone, dynamic offer calculations based on remaining values & tension multiplier, Deal / No Deal choices, and historical offer tracking.
  - **Final 2-Chest Standoff**: Classic **🔄 بدّل (Swap)** vs **🔒 نبقى (Keep)** decision.
  - **Celebratory Result Screen**: Trophy, confetti burst, fanfare, comparison with contestant's original box, and full board audit reveal.
  - **Instant Reset Escape Button (`⏹ إنهاء اللعبة / عودة للإعدادات`)**: Immediate 1-click return to Host Setup.

- **Audio & Localization**:
  - Web Audio API procedural synthesizer (100% offline, zero external audio asset dependencies):
    - Dual-frequency vintage telephone ringing for Banker.
    - Audience laughter and chuckles (`😂`) on gag/small prizes.
    - Dramatic weeping sad music (`🎻`) on jackpot losses.
    - Crowd applause & cheering (`👏`).
    - Suspense riser and victory fanfare.
  - Bilingual support: Tunisian Arabic (RTL) & French (LTR) toggle.

---

## 🚀 Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** + **TailwindCSS 4**
- **Lucide Icons**
- **Canvas-Confetti**
- **Web Audio API**

---

## 🛠️ Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
The production bundle will be created in `dist/`.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.
