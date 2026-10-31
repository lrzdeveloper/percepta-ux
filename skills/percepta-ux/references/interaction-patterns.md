# Interaction patterns: expression with a state contract

Use a pattern only when it helps this task. Start with the component's
[semantic and state contract](components.md); use [Motion](motion.md) for
interruption and reduced motion. The recipes below are original practical
extensions, not additional psychological laws or ready-made implementations.

## Tactile action

A small surface compression, edge change, or depth cue can acknowledge a press.
Keep the hit region stable and the label/focus indicator readable throughout.
A pointer-following effect should move decoration rather than make the target
harder to acquire. Respect coarse inputs and offer ordinary focus/press feedback.

Separate pressed appearance from accepted intent and confirmed outcome. A
physical metaphor can clarify action without adding a mandatory animation delay,
sound, or pretend hardware feedback. Use the product's existing tokens and check
repeated use before adding depth or spring movement to every control.

## Changing label or width

Keep one semantic control and stable focus while its action state changes.
Use meaningful ready/pending/success/error text; keep measurement or transition
copies out of the accessibility tree. The accessible name and operable action
must agree even if outgoing text remains briefly visible.

Choose content-fit or stable/full width by the layout. Resizing is useful only
when it does not shift nearby targets under a pointer or clip translated/larger
text. Check long labels, font loading, narrow layouts, rapid state changes, and
reduced motion. Prefer intrinsic sizing; if measurement or observation is needed,
clean it up and avoid repeated layout work without a functional benefit.

Done: the state is truthful and understandable without the transition, focus is
retained, and realistic labels fit without displacing a necessary nearby action.

## Deliberate confirmation and undo

Match protective effort to consequence and reversibility. Holding can communicate
intent, but do not make sustained pressure the only way to complete the task.
Provide an operable alternative such as an ordinary confirmation dialog, with
clear consequences and usable keyboard/assistive-input behavior. Do not impose
a universal hold duration or timed challenge.

If holding is used, define start, early release, leaving the target, cancellation,
blur, interrupted input, repeated activation, and completion. Progress in the hold
means confirmed intent, not successful deletion. Reduced motion can remove the
fill animation while preserving status and a usable confirmation route.

Offer Undo only if the system can restore the affected data. Distinguish a staged
action awaiting commit, a reversible committed change, and irreversible removal.
If recovery expires, state what remains recoverable, make timing understandable,
and retain a suitable recovery route where possible. Do not close the only place
to undo merely because a celebration finished. Handle rollback failure honestly.

Done: cancellation prevents the intended action, commitment follows the real
service contract, and any offered restoration has an actual implementation.

## File acquisition with drag feedback

Keep a labeled file-picker route alongside dropping. Decorative attraction must
not move the actual acceptance region away from the incoming file or fight the
pointer. Show accepted types and material limits before commitment. A drag-over
highlight means a potential target, not a validated or uploaded file.

Specify the relevant transitions: selected/dropped, validation, uploading,
processing, success, rejection, cancellation, and unknown outcome. Preserve useful
selection details on a recoverable error. Advertise retry or resume only when the
underlying upload protocol supports it; otherwise explain what must be repeated.
Touch, keyboard, and reduced-motion paths retain the same useful result.

Done: choosing and dropping converge on the same validation and upload behavior;
acceptance, progress, and authoritative completion remain distinguishable.

## Durable outcome with optional ceremony

A receipt reveal, ticket, signature stroke, or tactile object can provide closure
when it matches the product. Keep the underlying result available as ordinary
readable content. Receipt identity, amount, status, retrieval, or download must
come from the actual service where applicable. A signature animation is not proof
of a signed agreement, and a printed-looking receipt is not proof of payment.

Allow the user to continue without waiting for decorative completion. Preserve
the result across reduced motion, interruption, rerendering, and relevant
navigation. If a metaphor suggests an action, such as tearing or pulling, either
support that action accessibly or avoid making it look necessary.

Done: the person can understand and retrieve the outcome even when the ceremony
never plays. See [Peak-End](peak-end.md) for closure and recovery across the journey.
