# Audit

## Read for this audit

Before diagnosing controls or state feedback, read [Components](../references/components.md).
For asynchronous work, completion, errors, or retry, also read [Doherty](../references/doherty.md).
Before stating a contrast ratio, size threshold, or conformance conclusion, read
[Standards](../references/standards.md); calculate a ratio with an available tool
or leave the number unmeasured. Choose other psychology guides from the task.
Reading this recipe alone does not complete these branches: their rules govern
the findings, not just later implementation.

## Inspect and report

Inspect the supplied artifact and trace its main task. Identify actual obstacles
through the relevant psychology guides. Assess all guide categories for a broad
audit; include only findings that change a decision.

For each finding, state location/evidence, observed or inferred status, user cost,
proposed change, and a check. Prioritize by impact, exposure, consequence, and
recovery cost; keep confidence separate from severity. Explain dependencies before
assigning numerical priorities. A law name or aggregate UX score is not a diagnosis.

Trace actual service calls before naming transaction effects: a local animation
or timer cannot establish that a payment was submitted or charged. Recommend
idempotency only with a supporting service contract; an uncertain outcome needs
status reconciliation before retry. Keep hypothetical service risks distinct from
observed code behavior.

Check material feedback, failure, access, and responsive paths. With source only,
separate implementation evidence from untested behavior. With no artifact, bound
the review as hypotheses. Source changes require a request to fix as well as review.

For a brief capped review, use one compact item per requested finding: source
evidence and the correction, with a shared verification limit stated once. Keep
secondary issues out when they would exceed the requested scope or length.

Done: traceable, prioritized findings fit the requested scope and format; advisory
work leaves the artifact unchanged.
