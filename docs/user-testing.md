# User Testing — PROXY

## Overview

PROXY was evaluated with three participants representing different neurodivergent experiences. Testing was conducted through direct conversation, with participants using the live application and sharing feedback in their own words. Each session focused on real usage rather than scripted tasks.

Feedback from all three sessions directly shaped the current version of PROXY.

---

## Participant 1 — ADHD

### Feedback

- The AI understood the issue quickly, which felt reassuring.
- There was initial uncertainty about whether the AI had understood correctly before anything was shown.
- Seeing a confirmation of the barrier before the pathway appeared increased trust in the system.
- Some step descriptions were too long. Lengthy explanations reduced focus and made it harder to stay engaged.

### Changes Made

- Added a barrier confirmation step. The AI now summarises what it understood and asks the student to confirm before generating the pathway. This directly addresses the trust concern.
- Shortened instructional content throughout the interface. The intake prompt, loading messages, error messages, and step descriptions were all reduced in length. One idea per sentence became the standard.

---

## Participant 2 — Dyslexia

### Feedback

- Most text was readable and the layout was generally clear.
- A few sections felt like dense blocks of text that required more effort to process.
- Some language felt formal or institutional — unnecessarily complex for the context.
- More spacing between sections improved readability noticeably.

### Changes Made

- Simplified wording across the interface. Formal phrases such as "compensates for a documented functional barrier" were replaced with plain equivalents. Node type labels were changed from internal terms (UNDERSTAND, ACT) to plain language (Learn, Do).
- Increased whitespace between elements in the accommodations panel and step cards.
- Reduced paragraph length in the landing page problem statement and accommodation descriptions. Long sentences were split into shorter ones.
- Removed institutional language from the accommodations panel header — "You are entitled to" became "You can ask for".

---

## Participant 3 — Autism

### Feedback

- Appreciated that only one task was shown at a time. This made the interface feel manageable rather than overwhelming.
- The overall layout did not feel cluttered or stressful to navigate.
- Wanted to know what would happen after completing each step. Uncertainty about what came next created mild anxiety during the experience.

### Changes Made

- Added a "Next up" preview directly below the action button on each active step. It shows only the title of the following step — no description, no interaction. This gives the student a sense of what is coming without exposing the full pathway at once.
- The one-task-at-a-time principle was preserved completely. Future steps remain collapsed and visually muted. The preview is a single quiet line, not a new section.

---

## How User Feedback Shaped PROXY

PROXY was not designed in isolation. Each round of testing revealed a gap between what was built and what neurodivergent users actually needed. The barrier confirmation step, the shortened content, the plain language pass, and the "Next up" preview all exist because real participants identified real friction. The product improved in response to lived experience, not assumptions. This approach — testing with the community the product is designed for and iterating directly from their feedback — is reflected throughout the codebase and will continue as PROXY develops.