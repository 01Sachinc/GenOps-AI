# GenOps AI — Advanced Generative AI Chat Platform

A premium, modern SaaS-style frontend application built for seamless interactions with local or remote Generative AI models (optimized for local **Ollama + Llama 3** ingestion pipelines).

---

## ✨ Features & Capabilities

- **Ultra-Modern Dark Aesthetics**: Custom deep space styling tokens built atop Tailwind CSS with interactive ambient glow lighting.
- **Glassmorphism Design System**: Sleek frosted glass cards, navigation boundaries, and dynamic input bar layouts.
- **Advanced Markdown Support**: Render rich markdown tokens, lists, blockquotes, and highlighted multi-line code blocks out of the box.
- **Stateful Conversation Management**: Local persistent history stored automatically across browser refresh boundaries via optimized `localStorage` bindings.
- **Live Auto-Scroll Sync**: Intelligent positioning smoothly aligning bottom viewports during active AI generation streams.
- **Delayed Keyframe Animations**: Custom animated typing waveforms replicating contextual LLM reasoning behavior.
- **Multi-line Fluid Controls**: Support pressing `Enter` to submit commands synchronously while `Shift+Enter` cleanly inserts block newlines.

---

## 🛠️ Technology Architecture

- **Core**: React 19 + Vite for ultra-fast Hot Module Replacement bundling.
- **Styling**: Tailwind CSS v3.4 + PostCSS with customized custom keyframe utilities and Roboto global fonts.
- **Network Ingestion**: Axios HTTP POST handling directly targeting configurable local Ollama interfaces.
- **Iconography**: Highly scalable SVG bundles integrated via `react-icons`.

---

## 🚀 Quickstart & Setup Guide

Follow these sequential steps to launch the frontend engine and verify integration with the backend generative reasoning service.

### 1. Initialize Local AI Server (Ollama)
Ensure you have the backend API reachable at port `11434`. Pull and run the context model:
```bash
# Pull and start the official Llama 3 base model
ollama run llama3
```

*Note: If running the Vite client from a browser accessing `localhost:11434`, ensure Ollama permits local CORS overrides if required by your network stack.*

### 2. Install Client Dependencies
Navigate to the frontend module directory and verify dependencies:
```bash
cd genops-ai-frontend
npm install
```

### 3. Launch the Vite Development Server
Start the optimized local dev compiler:
```bash
npm run dev
```

Open your local browser to access the premium interface running at `http://localhost:5173/` (or the dynamically assigned local port).

---

## 📁 Component Directory Structure

```text
src/
 ├── assets/          # Application branding graphics
 ├── components/      # Isolated modular layout/view interfaces
 │    ├── Sidebar.jsx # Recent session lists and context trigger states
 │    ├── Navbar.jsx  # Context title bar and glowing model tags
 │    ├── ChatMessage.jsx # Aligned side-bubble view blocks and Markdown logic
 │    ├── ChatInput.jsx   # Multi-line sticky input wrapper supporting Shift+Enter
 │    ├── WelcomeScreen.jsx # Premium empty state dashboard with pre-populated tasks
 │    └── TypingIndicator.jsx # Keyframe delayed bouncy dots simulation
 ├── hooks/
 │    └── useChat.js  # Reactive local persistence, generation triggers, error handling
 ├── layouts/
 │    └── MainLayout.jsx # Collapsible side drawers and primary shell container
 ├── pages/
 │    └── ChatPage.jsx # Core page logic coupling layout flows with network handlers
 ├── services/
 │    └── aiService.js # Axios API communications module targeting http://localhost:11434/api/generate
 ├── App.jsx          # Top-level functional routing stub
 ├── main.jsx         # React DOM bootstrapper
 └── index.css        # Tailwind styling directives and custom base scrollbars
```
