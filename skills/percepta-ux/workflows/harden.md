# Harden

Inspect the requested flow or component and its real data/service contracts.
Choose the failure and content boundaries that can materially break this task:
long or missing content, localization, permissions, interrupted work, concurrent
changes, validation, or ambiguous outcomes. Prioritize by consequence and exposure.

Read [Components](../references/components.md), [Postel](../references/postel.md),
and [Doherty](../references/doherty.md) for state, interpretation, and recovery;
use [UX copy](../references/ux-copy.md) for useful explanations. Retain entered
work where possible. Describe supported retry, resume, rollback, or deduplication
rather than promising service capabilities the interface cannot establish.

Deliver an executable state/repair plan or requested implementation. Check relevant
boundaries with [Review loop](../references/review-loop.md), keeping unrelated
architecture and visual identity outside scope.

Done: consequential failure paths have usable behavior and truthful status; each
implemented guarantee has a check or a stated service/tool limitation. A passing
happy path or finite checklist does not prove production readiness.
