# System Architecture & Technical Design

## Architectural Overview

The application is structured as a client-first Single Page Application with Next.js 15 App Router, designed for dual-target execution:
1. Containerized server environment (Google AI Studio / Cloud Run)
2. Pure Static Site Generation (GitHub Pages SSG)

## Component Breakdown

- **Root Viewport**: Coordinates layout structure, handles hydration verification, and mounts the sidebar navigation alongside the active chat viewport.
- **Sidebar**: Manages the conversation list, search/filter inputs, session creation, renaming, session deletion with safety guards, and theme toggling.
- **Header**: Displays the active session context, inline title editor, quick new chat trigger, conversation transcript export, and theme switcher.
- **Empty State**: Displays an inviting initial state with quick-start prompt suggestions for new sessions.
- **Message List**: Renders user and assistant message cards with distinct role avatars, timestamps, copy-to-clipboard utilities, thinking indicators, and response regeneration triggers.
- **Input Bar**: Auto-expanding textarea supporting standard keyboard shortcuts (Enter to send, Shift+Enter for new line), composition event safety for East Asian input methods, and cancellation of in-flight thinking timers.

## Data Persistence & State Flow

- **Storage Engine**: All user sessions and messages are persisted synchronously to the browser's local storage under versioned keys.
- **Session Lifecycle**: When no existing session is found, a default initial session is scaffolded.
- **Title Derivation**: Upon receiving the first user message in a new session, the system automatically derives a truncated title to reflect user intent.
- **Theme Preference**: Dark and light theme modes are retained across browser reloads via dedicated storage entries and applied to the root document element.
