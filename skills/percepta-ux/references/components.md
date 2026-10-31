# Components: specify the interaction before choosing the example

## Prefer the smallest fitting foundation

Identify the task, consequence, semantic role, platform, and current component
stack. Inspect the existing primitive, design tokens, state management, and form
or routing contracts. A library reference can improve a missing detail without
requiring migration to its framework or replacement of a working design system.

For a candidate, state the actual benefit and the cost: dependencies, styling
assumptions, runtime/client boundaries, ownership, licensing/access, performance,
and maintenance. Use the current source and official docs for exact props or
installation. Marketing claims of accessibility or production readiness do not
verify the integration in this product.

## Build a state contract

Select the states that matter for this component; explain exclusions when useful.

| Concern | Questions to resolve |
|---|---|
| Semantics | Is this an action, navigation, selection, status, or editable value? Does the element expose that role? |
| Ready and focus | What is operable, how is it named, where does focus go, and what input paths are supported? |
| Hover and press | Do enhancements respect pointer capability and keep touch/keyboard meaning intact? |
| Pending | Has intent been registered? What remains editable? How are repeated effects prevented? |
| Success | Which authoritative event confirms the outcome? Does the user retain a useful result? |
| Failure and unknown | What data persists, what is known, and what correction or safe retry is possible? |
| Unavailable | Is the reason understandable, and is the behavior correct for the actual disabled mechanism? |
| Content and size | Do long labels, localization, larger text, dense data, and constrained layouts remain usable? |
| Motion | Is state understandable with reduced motion and interrupted transitions? |

Use native semantics when appropriate. Custom behavior adds responsibilities;
an ARIA attribute alone does not implement keyboard behavior or block activation.
If an action stays focusable while unavailable, its handlers must enforce that
state. Choose focus and disabled behavior based on context rather than imposing
one component library's pattern on every control.

## Example: a save button

Resolve what Save commits and what confirms persistence. Keep the accessible
name meaningful, indicate pending state, and prevent unintended duplicate effects
using the actual UI/service contract. Preserve focus when the element changes
label or appearance. On a confirmed error, retain entered work and offer the
appropriate correction; on an unknown outcome, avoid falsely claiming success
or failure. Motion can connect states but cannot substitute for their truth.

An async-safe implementation needs more than setting `aria-busy`: check handlers,
request state, rejection, interruption, and repeated activation. Refer to
[Doherty](doherty.md), [Fitts](fitts.md), and [Motion](motion.md) only as relevant.

## Interpret expressive examples

For a draggable control, keep a discoverable non-drag route to the same outcome
where required. For hover reveals, make essential content available to touch and
keyboard users. For morphing payment controls, preserve amount, commitment,
authoritative outcome, focus, and a retrievable receipt. Animation cannot serve
as proof that payment completed.

For a loader, reveal real state without fabricating percentage or duration.
For a chart, consider readable values and an accessible representation alongside
visual interaction. For a card or hero, retain content hierarchy and a useful
action instead of importing decorative behavior wholesale.

## Verify and hand off

Exercise the actual component in relevant states, with the project's real
dependencies and realistic content. Inspect mouse/touch/keyboard behavior as
applicable, focus, narrow layout, and a material failure path. Verify assistive
technology behavior when available, and name unexecuted checks. Document the
integration decision and any new dependency. A copied demo is a starting point.

For tactile controls, resizing labels, confirmation/undo, file drop, or persistent
results, use [Interaction patterns](interaction-patterns.md). For an outside
implementation, use [Reference selection](reference-selection.md).
