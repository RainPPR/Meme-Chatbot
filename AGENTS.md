# AGENTS.md

This file provides dedicated context, conventions, and instructions for AI coding agents working on this repository.

## 1. Project Overview

This repository is a lightweight, high-craftsmanship Next.js application designed as a meme/prank AI chatbot that appears visually identical to a standard modern LLM chat interface (such as ChatGPT, Claude, or DeepSeek), but always returns pre-configured meme responses with realistic thinking delays and dynamic typewriter streaming animations.

### Core Capabilities:
- **SSG Static Export Compatible**: Can be exported via `OUTPUT_EXPORT=true next build` into a clean static `out/` folder for GitHub Pages.
- **Lockfile & CI Ready**: Preserves `package-lock.json` so GitHub Actions caching and `npm ci` work out-of-the-box.
- **Client-Side Persistence**: Stores all chat sessions, messages, and theme preferences entirely within the browser (`localStorage`).
- **Dynamic Meme Engine**: Randomly selects responses from a generator pool in `lib/responses.ts` and simulates a realistic 500ms–1500ms thinking phase followed by high-frequency typewriter streaming.
- **Fast Token Typing Stream**: Emits 2–3 character chunks at rapid 20ms–30ms interval delays without human punctuation pauses, matching genuine neural network token throughput with interactive stop generation controls.
- **Date Calculation**: Computes the first Friday that is `>= 8 days` in the future relative to the user's local time for compliance meme messages.
- **Pure Client Logic**: Zero external AI dependencies (no `@google/genai` or cloud endpoints).

## 2. Build and Test Commands

- **Development Server**: `npm run dev` (Runs on port 3000)
- **Production Build (Container/Standalone)**: `npm run build`
- **Static Export (GitHub Pages)**: `OUTPUT_EXPORT=true npm run build` (Outputs pure static HTML to `./out`)
- **Linting**: `npm run lint`

## 3. Architecture & Code Conventions

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS v4 using utility classes directly.
- **Icons**: Exclusively imported from `lucide-react`.
- **State Management**: React state synced with `localStorage` in `lib/chat-store.ts`.
- **Response Extensions**: When adding new meme responses, edit `lib/responses.ts`. Responses can be static strings or functions taking `{ now: Date }`.
- **Accessibility & IDs**: All interactive elements (buttons, inputs, message cards, session items) must include unique `id` attributes.

## 4. GitHub Actions & Static Hosting

- The workflow is located at `.github/workflows/deploy.yml`.
- Stable standard actions `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4` are used.
- When `GITHUB_ACTIONS` or `OUTPUT_EXPORT` is `true`, `next.config.ts` sets `output: 'export'` and `images.unoptimized = true`.
- Artifact path is `./out`.

## 5. Maintenance Obligations

- Keep `README.md`, `AGENTS.md`, and flat Markdown files in `docs/` updated across iterative turns.
