# Response Generation Engine

## Functional Design

The chatbot engine operates deterministically as a humorous imitation tool. Regardless of the prompt provided by the user, the application avoids invoking external neural inference endpoints, instead serving pre-curated responses that mimic iconic platform downtime notices and error states.

## Simulation Pipeline

1. **Submission Phase**: When the user sends a message, the system creates a user message record and immediately appends an assistant message initialized in a thinking state.
2. **Timing Delay**: A random timer duration between 500 milliseconds (0.5s) and 1500 milliseconds (1.5s) is calculated to simulate network latency and model inference.
3. **Selection Mechanism**: A response is selected uniformly at random from the generator pool.
4. **Resolution Phase**: Upon timer expiration, the assistant message transitions from thinking state to output delivery.

## Dynamic Date Calculation Logic

For compliance-themed responses requiring an expiration notice date:
- The system reads the user's current local date.
- It calculates an offset of at least 8 days into the future.
- From that future threshold, it finds the immediately succeeding Friday.
- The resulting date is formatted in Chinese calendar notation (Month, Day, and Friday suffix).

## Extensibility

The response pool is defined modularly, allowing developers to append new static strings or higher-order generator functions responding to local temporal context.
