# UX copy: help the person understand and act

Read the words across the task and its states. Establish what the person knows,
what the system actually knows, the consequence, and the next available action.
Keep product terms, factual meaning, values, and commitments consistent.

## Match the message to its job

| Job | Resolve before writing |
|---|---|
| Action | What operation and object does activation affect? Does visible wording agree with its accessible name? |
| Input | What value is needed, which requirements affect success, and where can the person correct it? |
| Waiting | Was intent received, is work running, or is another party's response pending? |
| Completion | Which event proves the outcome, and what result or consequence remains available? |
| Failure | What is known to have failed, which work persists, and what recovery is actually supported? |
| No content | Is this first use, no match, a filter, missing permission, or a failed load? |

Shorten by removing repeated meaning before removing context. A heading and helper
sentence should do different jobs. Use a recognizable verb and object for an
ambiguous action; retain domain language the audience actually understands.
A persistent field label carries identity; an example or placeholder adds help.

Keep a possible retry distinct from a safe retry. An unknown payment or upload
outcome needs reconciliation or a truthful limitation, not an invented error cause
or an instruction that could repeat a consequential effect. Use
[Doherty](doherty.md) and [Interaction patterns](interaction-patterns.md) for state
and recovery decisions. Use [Ethics](ethics.md) for refusal, renewal, and commitment.

## Preserve meaning across languages and access

Write complete messages that can be reordered and pluralized. Preserve variables,
amounts, dates, and localization keys when editing source. Test representative long
strings and actual target languages instead of assuming a fixed expansion quota.
Keep visible labels and accessible names consistent with the same outcome. Provide
meaning through words and semantics as well as icon, color, or motion.

Use a tone appropriate to consequence: calm and actionable for blocked work;
brief and clear for routine completion. Avoid certainty, blame, urgency, or humor
that misrepresents the situation. Changing legal meaning or a factual promise is
a product decision; clarify it when the brief does not authorize the change.

## Deliver and check

For proposed edits, a compact before → after → reason table can make the decision
reviewable. For implementation, change only authorized strings and required
semantics; preserve handlers and data contracts. Read the whole affected path
again to catch conflicting terms, missing recovery, clipped text, and stale
status wording. Distinguish source review from comprehension or assistive-technology
testing. Finish with concrete copy and actual checks, not a list of tone adjectives.
