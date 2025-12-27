# BoHack Social - Onboarding Prototype

A playful, vibrant onboarding experience for a hackathon social matching app.

## 🎨 Design Philosophy

**Aesthetic Direction**: Playful pop art meets modern social app
- Warm gradients (orange → pink → yellow)
- Bubbly, friendly interface
- Energetic animations and micro-interactions
- Approachable over technical/geeky

## ✨ Features

### Onboarding Flow (6 Steps)

1. **Welcome Screen** - Friendly hero greeting with animated emoji
2. **Mood Selection** - Multi-select current status with emoji buttons
3. **Interest Selection** - Multi-select topics of interest
4. **Project & Contact** - Text inputs for project description and WeChat ID
5. **AI Chat** - Interactive 3-question chat with typing indicators
6. **Profile Preview** - Animated profile card reveal

### Design Highlights

- **Typography**: Fredoka (playful, rounded display font) + DM Sans (clean body text)
- **Color Palette**: Warm gradients with CSS variables
- **Animations**:
  - Smooth fade-in/slide-up on step transitions
  - Staggered reveals for option buttons
  - Typing indicators in chat
  - Bounce effects on emojis
  - Card flip animation on profile reveal
  - Progress bar with glow effect
- **Responsive**: Mobile-first design that adapts to desktop
- **Interactive States**:
  - Hover effects with elevation
  - Active states with ripple effects
  - Selected states with gradient backgrounds

## 🚀 Usage

Simply open `index.html` in a browser. No build process needed!

```bash
open index.html
```

Or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📱 Screens

1. **Welcome** - Hero intro with CTA
2. **Mood** - 6 emoji-based status options
3. **Interests** - 8 topic categories
4. **Details** - Project description + WeChat ID
5. **Chat** - 3 AI questions with conversational UI
6. **Profile** - Generated profile card with gradient header

## 🎯 Mock Data

All functionality is simulated:
- Multi-select toggles work visually
- Chat has canned questions with typing simulation
- Profile card shows example data
- No backend integration needed

## 🎨 Customization

Key CSS variables in `:root`:
- `--primary-gradient`: Main brand gradient
- `--secondary-gradient`: Accent gradient
- `--warm-bg`: Background color
- `--border-radius`: Global border radius (24px)

## 💡 Technical Notes

- Pure HTML/CSS/JavaScript
- Google Fonts: Fredoka + DM Sans
- Smooth animations using CSS cubic-bezier
- Glassmorphism effects with backdrop-filter
- No framework dependencies
- Fully self-contained single file
