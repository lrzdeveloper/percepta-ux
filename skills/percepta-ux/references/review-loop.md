# Review loop: verify the promised outcome

Use this for implemented design, refinement, adaptation, hardening, or an explicit
verification request. Scale the loop to the changed behavior. A small copy edit
does not require the same checks as a redesigned payment flow.

## Set the comparison

State what changed and what should remain stable. Identify the actual route,
component, platform, data, theme, and relevant state. Use a before capture when
available. A committed screenshot is useful only when it matches this target and
its current tokens, content, and variant; label older captures as historical.

Choose checks that can contradict the intended result:

| Changed concern | Useful check |
|---|---|
| Hierarchy or layout | Actual render at a relevant narrow and normal width, with real content and text scaling |
| Control or navigation | Supported input paths, focus/order, destination, repeated activation, and meaningful unavailable state |
| Copy or form | Comprehensible labels, correction, retained input, long/localized strings, and announced state |
| Async operation | Pending, rejection, interruption, unknown outcome, recovery, and authoritative completion |
| Motion | Interrupted transition, reduced motion, stable targets, and legible final state |
| Numeric claim | Actual measurement, applicable standard/context, and unrounded comparison |

For native targets, use available platform checks and units; a browser viewport
is not a native-device test. Include affected themes and supported variants rather
than adding new themes just to satisfy a universal checklist.

For batch or consequential edits, preview affected targets, intended changes, and
protected facts/variables before applying the batch. Check that targets exist and
that the proposed change preserves those invariants. This preview can stay in
working notes; a small edit needs no separate plan file.

## Inspect, repair, check again

Use existing tools and project checks. Observe the affected result, batch related
findings, fix those within scope, then revisit the changed path and a nearby
invariant. Keep a working control or information path intact while refining it.
Passing a source scan does not establish visual quality, runtime accessibility,
or success with users.

Continue until the requested outcome and its material recovery behavior are
concrete and relevant checks pass. If a check is blocked or a concern exceeds
scope, finish independent work and record the exact gap or remaining decision.
Do not loop unchanged captures or install a missing detector as a hidden dependency.

## Return evidence proportional to the task

For each material promise, report supported, contradicted, or unverified, with
its artifact, state, or measurement. Keep executed checks separate from suggested
studies. A short record can be enough: changed behavior, check performed, outcome,
and outstanding gap. Use a focused screenshot when it helps review visual work;
text-only artifacts and source-only tasks need no invented image evidence.

For an opaque sRGB color pair, [Standards](standards.md#optional-contrast-calculation)
documents the bundled arithmetic helper. The ratio is one measurement, not a
whole-interface accessibility result. Cite authoritative standards for a disputed
threshold, and user evidence for a claim about actual comprehension or task success.
