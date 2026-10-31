# Motion: preserve meaning while things move

## State the purpose

Identify what the person needs to understand or control: a response to input,
a spatial relationship, a state transition, progress, or a meaningful moment.
Match expression to frequency, consequence, device, and surface. A promotional
sequence can be expressive while a repeatedly used operational control needs
clarity and efficient repetition. “More animated” is not a complete interaction
specification.

## Define the contract

For consequential movement, specify:

- Trigger and actual state transition; the movement's purpose.
- What moves, where it comes from/goes, and what remains stable.
- Timing and easing/pacing appropriate to the task, with interruption and reversal.
- Focus, reading order, accessible name/status, and input alternatives.
- Reduced-motion behavior that preserves the final state and useful feedback.
- Real success/error/unknown states and data retained during transition.
- A proportionate performance and responsive check on the target environment.

Examples and spring presets can inform a starting point. Adapt them to the
project's motion tokens and observed use; neither a fixed duration nor a specific
animation library is a psychological law. Avoid stacking competing reveals or
delaying frequent actions solely to play a transition.

## Support interruption and access

Repeated activation, quick navigation, changing content, and cancellation should
not strand focus, orphan overlays, duplicate effects, or leave stale labels.
Keep state legible if the animation never plays or is interrupted. A reduced-motion
branch should preserve the outcome rather than removing feedback. Avoid relying
on looping motion, flashing, large travel, parallax, blur, or sound for essential
meaning. Recheck contrast and legibility during a transition, not only at rest.

Hover, drag, swipe, press-and-hold, and pointer attraction require consideration
of keyboard, coarse pointer, motor, and assistive input. Use a visible equivalent
where the gesture is not available. A drag or swipe affordance should not be the
only discoverable route to a necessary action.

## Keep progress and commitment truthful

A loader may communicate “working” without knowing how much remains. Do not
convert an expressive sequence into a fabricated percentage or completion claim.
For payment, booking, deletion, or permission, distinguish animation completion
from confirmed system outcome. Provide a persistent result or recovery route
appropriate to the task. Use [Doherty](doherty.md) and [Ethics](ethics.md) for those
decisions.

## Measure the relevant work

Prefer properties that avoid unnecessary layout work where they fit the effect,
but do not claim that transform/opacity alone guarantees performance. Inspect
large lists, observers, reflows, effects, canvas/WebGL load, and concurrent motion
when relevant. Use actual profiling or observation before reporting frame rates
or smoothness guarantees. Test the supported low-power/coarse-input context
where material to the feature.

An expressive demo can suggest a clear transition or tactile response. Build the
smallest useful version and check it in the real task before adding more effects.
For a launch film or exported motion asset, treat rendering/export as a separate
artifact workflow; a UI skill does not imply a 4K exporter or sound-generation tool.

For concrete tactile, label-change, confirmation, upload, or result patterns, use
[Interaction patterns](interaction-patterns.md). Treat their timing and expression
as product decisions to verify in context.
