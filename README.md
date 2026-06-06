<![CDATA[<div align="center">

# 🎵 MoodSync

### Mood-Based Music & Study Productivity Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](https://opensource.org/licenses/ISC)

**Sync your mood. Fuel your focus.**

*A full-stack web application that pairs mood-based Spotify playlists with a Pomodoro study timer — built for students who want to study smarter with the right music for their headspace.*

[Get Started](#-how-to-run) · [Features](#-key-features) · [Tech Stack](#-tech-stack) · [API Docs](#-api-endpoints)

---

</div>

## 📖 About

**MoodSync** was born from a simple observation: *mood influences productivity*. When you're studying with music that matches how you feel, you focus better, retain more, and actually enjoy the process.

MoodSync bridges the gap between emotion and productivity by letting students:
1. **Select their current mood** — Happy 😊, Relaxing 🌿, Sad 🌧, or Energetic ⚡
2. **Get matched with curated Spotify playlists** tailored to that mood
3. **Start a Pomodoro study timer** with an animated SVG progress ring
4. **Track study sessions & mood history** through a personalized dashboard

The entire interface dynamically adapts — gradient backgrounds, floating music-note particles, and colour themes shift to reflect the selected mood, creating an immersive study environment.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎭 **Mood-Based Music** | Choose Happy, Relaxing, Sad, or Energetic — get instant playlist matches |
| 🎧 **Spotify Integration** | One-click redirect to curated public Spotify playlists |
| ⏱ **Pomodoro Timer** | 15 / 25 / 50-minute sessions with SVG ring animation & audio chime |
| 🔐 **Server-Side Auth** | Signup & login with bcrypt password hashing and token sessions |
| 🌗 **Dark / Light Mode** | Toggleable theme persisted via localStorage |
| 📊 **Dashboard & Stats** | Personalized dashboard with study history, mood logs, and session stats |
| 🌈 **Dynamic Themes** | Background gradients & particles adapt to the selected mood |
| 💎 **Glassmorphism UI** | Modern frosted-glass design with neon glow effects |
| 📱 **Responsive Design** | Fully responsive across mobile, tablet, and desktop |
| 🎨 **Floating Particles** | Canvas-rendered animated music notes for visual depth |

---

## 👩‍💻 Team

<div align="center">

| <img src="assets/avatar_gursirat.png" width="100" alt="Gursirat Kaur"/> | <img src="assets/avatar_aditi.png" width="100" alt="Aditi Thakur"/> |
|:---:|:---:|
| **Gursirat Kaur** | **Aditi Thakur** |
| Co-Creator & Developer | Co-Creator & Developer |

</div>

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5 | Semantic page structure (Single Page App shell) |
| | CSS3 | Glassmorphism styling, keyframe animations, responsive layouts |
| | JavaScript (ES6+) | SPA routing, mood logic, timer, canvas particles, API client |
| **Backend** | Node.js | Server-side runtime |
| | Express.js v5 | RESTful API framework |
| | bcrypt.js | Secure password hashing |
| | UUID | Session token generation |
| **Data** | JSON File DB | Lightweight file-based persistence (users, sessions, moods) |

---

## 📦 How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/MOODSYNC.git
cd MOODSYNC

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

4. Open your browser and navigate to: **http://localhost:3000**

> **💡 Tip:** On Windows, you can also double-click `Start_MoodSync.bat` to launch the server automatically.

---

## 🌐 Pages (15 Total)

MoodSync is a **Single Page Application (SPA)** with hash-based routing — all 15 pages render dynamically within a single `index.html` shell.

| # | Page | Route | Description |
|:-:|------|-------|-------------|
| 1 | **Home** | `#/` | Hero section with animated waveform bars and CTA |
| 2 | **Sign Up** | `#/signup` | Account creation with real-time validation |
| 3 | **Login** | `#/login` | User authentication with server-side sessions |
| 4 | **About** | `#/about` | Team profiles, timeline, and mission statement |
| 5 | **Features** | `#/features` | 6 feature cards with descriptions |
| 6 | **Moods** | `#/moods` | 4 interactive mood selection cards |
| 7 | **Playlist** | `#/playlist` | Spotify-linked songs for the selected mood |
| 8 | **Timer** | `#/timer` | Pomodoro timer with SVG ring and motivational quotes |
| 9 | **How It Works** | `#/how-it-works` | 5-step visual onboarding guide |
| 10 | **Tech Stack** | `#/tech` | Technologies used in the project |
| 11 | **Dashboard** | `#/dashboard` | Personalized user dashboard with activity feed |
| 12 | **Profile** | `#/profile` | User stats, mood history chart, and profile editing |
| 13 | **Settings** | `#/settings` | Theme, timer, mood preferences, and danger zone |
| 14 | **Contact** | `#/contact` | Contact form and creator info |
| 15 | **Outcomes** | `#/outcomes` | Impact stats and testimonials |

---

## 📁 Project Structure

```
MOODSYNC/
├── server.js                # Express server entry point
├── package.json             # Dependencies & scripts
├── index.html               # SPA shell (single HTML file)
├── Start_MoodSync.bat       # Windows quick-launch script
│
├── server/                  # ── Backend ──
│   ├── db.js                # JSON file database (CRUD operations)
│   ├── session.js           # Token-based session management
│   └── routes/
│       ├── auth.js          # POST /signup, /login, /logout, GET /me
│       ├── users.js         # GET/PUT /profile, /preferences
│       └── sessions.js      # POST/GET study sessions & mood tracking
│
├── data/                    # ── Persisted Data (auto-created) ──
│   ├── users.json           # User accounts (hashed passwords)
│   ├── sessions.json        # Study session logs
│   └── moods.json           # Mood selection history
│
├── css/                     # ── Stylesheets ──
│   ├── variables.css        # Design tokens (colors, fonts, spacing)
│   ├── base.css             # Global reset & typography
│   ├── components.css       # Reusable UI components (cards, buttons, forms)
│   ├── layout.css           # Navbar & footer
│   ├── animations.css       # Keyframe animations & transitions
│   └── pages.css            # Page-specific styles
│
├── js/                      # ── Frontend Scripts ──
│   ├── app.js               # Main entry point & initialization
│   ├── router.js            # Hash-based SPA router
│   ├── api.js               # API client (frontend ↔ backend)
│   ├── auth.js              # Authentication state management
│   ├── pages.js             # All 15 page render functions
│   ├── timer.js             # Pomodoro timer with SVG ring progress
│   ├── theme.js             # Dark/light mode toggle
│   ├── particles.js         # Canvas-based floating music notes
│   └── utils.js             # Helpers, validation, quotes
│
└── assets/                  # ── Static Assets ──
    ├── avatar_gursirat.png  # Team avatar
    └── avatar_aditi.png     # Team avatar
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
| `GET` | `/health` | ✗ | Server health check |
| `POST` | `/auth/signup` | ✗ | Create a new account |
| `POST` | `/auth/login` | ✗ | Authenticate and receive session token |
| `POST` | `/auth/logout` | ✓ | Invalidate current session |
| `GET` | `/auth/me` | ✓ | Get current authenticated user |
| `GET` | `/users/profile` | ✓ | Fetch user profile with study stats |
| `PUT` | `/users/profile` | ✓ | Update name and email |
| `PUT` | `/users/preferences` | ✓ | Update timer and mood settings |
| `POST` | `/sessions` | ✓ | Log a completed study session |
| `GET` | `/sessions/stats` | ✓ | Get aggregated study statistics |
| `POST` | `/moods` | ✓ | Log a mood selection |
| `GET` | `/moods` | ✓ | Get mood selection history |

---

## 🎨 Design Philosophy

| Aspect | Details |
|--------|---------|
| **Color Palette** | Deep Purple `#0D001A` · Hot Pink `#FF2D9B` · Lavender `#C084FC` |
| **Typography** | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (headings) + [Inter](https://fonts.google.com/specimen/Inter) (body) |
| **UI Style** | Glassmorphism with frosted-glass cards, neon glow accents, gradient backgrounds |
| **Animations** | Fade-in-up entrances, staggered card reveals, waveform bars, floating music notes |
| **Mood** | Energetic, youthful, focused — like a late-night study session with great music 🎧 |

---

## 🛠 Development

```bash
# Run in development mode
npm run dev

# The server starts on http://localhost:3000
# Data files are auto-created in /data on first run
```

### Environment

- No external database required — uses JSON file storage
- No environment variables needed — works out of the box
- CORS enabled for local development

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**Built with 💜 by [Gursirat Kaur](https://github.com/) & [Aditi Thakur](https://github.com/)**

*© 2025 MoodSync*

</div>
]]>
