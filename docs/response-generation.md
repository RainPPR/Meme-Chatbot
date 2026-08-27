# Response Generation & Streaming Engine

## Functional Design

The chatbot engine operates deterministically as a humorous imitation tool. Regardless of the prompt provided by the user, the application avoids invoking external neural inference endpoints, instead serving pre-curated responses that mimic iconic platform downtime notices, refusal notices, and compliance warnings.

## High-Quality Entropy & Anti-Clustering Selection

To prevent the common clustering, repetition, and bias issues inherent to `Math.random()` (e.g. birthday paradox clustering, repeating the same meme reply multiple times consecutively):

1. **Web Crypto Entropy**: Floating point numbers and integer ranges are generated via `window.crypto.getRandomValues()` / `crypto.getRandomValues()` (with fallback to high-entropy 32-bit PRNG seeding in non-browser environments).
2. **Anti-Clustering Ring Buffer (`AntiClusteringPicker`)**:
   - Maintains a sliding history window of recently chosen responses.
   - For a pool of `N` responses, recent items are filtered out from immediate candidate selection, guaranteeing zero consecutive repetitions and balanced distribution across the entire response pool.

## Simulation Pipeline

1. **Submission Phase**: When the user sends a message, the system creates a user message record with a cryptographically secure ID and immediately appends an assistant message initialized in a thinking state (`isThinking: true`).
2. **Thinking Latency Delay**: A cryptographically uniform delay between 500 milliseconds (0.5s) and 1500 milliseconds (1.5s) is calculated via `getRandomThinkingDelay()` to simulate network round-trip and initial model reasoning.
3. **Response Selection**: A response is selected using the anti-clustering algorithm from the generator pool.
4. **Streaming Typewriter Phase**:
   - The assistant transitions from thinking to typing (`isThinking: false`, `isTyping: true`).
   - The message content is emitted smoothly in chunks of 5 to 10 characters at a fast cadence of 10ms to 20ms per interval (calculated via uniform integer sampling).
   - Punctuation pauses have been eliminated to authentically reflect real LLM token streaming speed rather than human typing habits.
   - A blinking cursor indicator is visually attached to the active stream tail.
5. **Resolution & Interactive Cancellation**:
   - Once all characters are revealed, the message is marked complete (`isTyping: false`) and synced to persistent storage.
   - If the user clicks "Stop Generating" (or switches chats) during either the thinking or typing phase, streaming halts immediately, preserving the current typed text.

## Dynamic Date Calculation Logic

For compliance-themed responses requiring an expiration notice date:
- The system reads the user's current local date.
- It calculates an offset of at least 8 days into the future.
- From that future threshold, it finds the immediately succeeding Friday.
- The resulting date is formatted in Chinese calendar notation (Month, Day, and Friday suffix).

## Extensibility

The response pool is defined modularly in `lib/responses.ts`, allowing developers to append new static strings or higher-order generator functions responding to local temporal context.

