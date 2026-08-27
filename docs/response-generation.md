# Response Generation & Streaming Engine

## Functional Design

The chatbot engine operates deterministically as a humorous imitation tool. Regardless of the prompt provided by the user, the application avoids invoking external neural inference endpoints, instead serving pre-curated responses that mimic iconic platform downtime notices, refusal notices, and compliance warnings.

## Simulation Pipeline

1. **Submission Phase**: When the user sends a message, the system creates a user message record and immediately appends an assistant message initialized in a thinking state (`isThinking: true`).
2. **Thinking Latency Delay**: A random timer duration between 500 milliseconds (0.5s) and 1500 milliseconds (1.5s) is calculated to simulate network round-trip and initial model reasoning.
3. **Response Selection**: A response is selected uniformly at random from the generator pool.
4. **Streaming Typewriter Phase**:
   - The assistant transitions from thinking to typing (`isThinking: false`, `isTyping: true`).
   - The message content is emitted smoothly in chunks of 2 to 3 characters at a fast cadence of 20ms to 30ms per interval.
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

The response pool is defined modularly, allowing developers to append new static strings or higher-order generator functions responding to local temporal context.
