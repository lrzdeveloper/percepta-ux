# Doherty: feedback that sustains the task

## Mechanism and boundary

Slow or missing response interrupts work and leaves people uncertain whether an
action registered. The historical roughly 400 ms guideline encourages responsive
interaction; it is not a guarantee of flow, a universal loading budget, or a reason
to report completion early. Acknowledgement, useful partial content, server
acceptance, and final completion are different milestones.

Flow also depends on clear goals, feedback, and a challenge suited to the person's
skill. Fast animation alone does not create it. Optimize real performance and
meaningful continuity before adding a more entertaining wait.

## Diagnose and act

- Separate input response from the actual operation. Acknowledge promptly,
  communicate the real state, and preserve control over long work.
- Inspect payloads, scripts, media, blocking work, and repeat requests when source
  and tools permit. Measure actual delays rather than deriving them from a screen.
- Reserve space for incoming content. Use skeletons when the eventual structure
  is predictable; show useful content early and avoid perpetual skeleton states.
  Low-resolution image previews can improve perceived continuity without changing
  when full-quality content is actually ready.
- Use measured progress when the system knows progress. Otherwise show an honest
  indeterminate state, stage, and realistic estimate when available. Do not invent
  percentages, fake checks, or an estimate unsupported by operational data.
- For long operations, provide cancellation where possible, background continuation
  or later retrieval where appropriate, and a persistent outcome. Explain what
  is known after interruption or timeout.

## Optimistic updates and failure

Optimism is appropriate for low-risk reversible actions with a predictable success
path, visible pending state when needed, and reconciliation or rollback on failure.
Preserve intent and expose an actionable error. Confirmation of payment, booking,
access, deletion, or another consequential operation must reflect authoritative
state. A transport timeout may leave outcome unknown; it is not proof of failure.
Prevent duplicate effects when retrying, using the system's actual idempotency or
status-check capabilities rather than claiming a UI alone guarantees this.

## Useful friction

The book discusses delays that change perceived trust or allow comprehension.
Percepta uses truthful pacing: keep important results visible, explain real work,
and add deliberate review before irreversible actions when helpful. Artificial
waiting or simulated thoroughness is not a default recommendation. A brief stable
status or review step can support comprehension without lying about processing.

## Verify

Measure input-to-acknowledgement, time-to-useful-content, final completion, error
rate, and recovery. Record device/network and relevant percentile distributions
when performance is the question. Exercise slow, rejected, interrupted, and unknown
outcomes. Separate measured time from reported waiting experience.

## Original example

After a six-second document export, show a truthful “Preparing export” state,
allow continued work if supported, and retain the finished file for retrieval.
If it fails, preserve configuration and offer a safe retry. A fabricated 95%
indicator would offer reassurance without dependable information.

Source basis: ch. 10, printed pp. 119–129; responsiveness, flow, skeletons, image
previews, progress, optimistic UI, and friction. Outcome-state discipline,
idempotency considerations, and measurement criteria are Percepta extensions.
