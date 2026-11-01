---
name: percepta-ux
description: >-
  Use this skill whenever reviewing, designing, or improving how people use an
  interface, or planning or interpreting UX research. Invoke it before giving
  usability findings, state/flow recommendations, UI wording, or interface
  changes, even for a short answer or a familiar control. Applies to screens,
  forms, navigation, checkout, onboarding, accessibility, motion, waiting,
  errors/recovery, misleading success messages, and HTML/CSS/JavaScript or native
  UI source reviews. Also covers Laws of UX, named UX laws, and team design
  principles. Excludes backend-only logic, infrastructure, security audits, and
  visual branding without an interface-use question.
license: MIT
metadata:
  author: lrzdeveloper
  version: "0.2.1"
---

# Percepta UX

Turn a UX obstacle into a concrete change and an observable check. Use the user's
language and product vocabulary. Preserve the requested artifact, scope, stack,
and visual identity. The guides are original operational interpretations of
Jon Yablonski's *Laws of UX*, second edition, with practical extensions.

## Choose a workflow

Accept `/percepta-ux <mode>` in Claude Code, `$percepta-ux <mode>` in Codex,
or a plain-language task. These are fifteen modes of one skill. Infer the mode
from a clear request; name-only invocation uses `help`. When a checker can run, a capped answer is complete
only when the returned text is the checked draft described under
[Return the useful result](#return-the-useful-result).

**Read before deciding.** When the host provides a dedicated file reader such as
`Read`, use that tool to open the recipe and applicable linked guide files before
drafting findings, copy, a plan, or code.
Read the full guide or the complete relevant section, including its limits.
A filename, summary, search hit, or a few matching lines does not complete this step.
Reading an audit recipe alone is insufficient when its control/state or async
branches require guides. Loaded files need no second read.

Only when the host has no dedicated file reader, the optional [context loader](scripts/load-context.mjs)
loads the recipe and default guides from [the catalog](commands.json) in one call:
`node <skill-dir>/scripts/load-context.mjs MODE [EXTRA-GUIDE ...]`.
Add relevant names such as `standards`. Read the unfiltered result and confirm
`CONTEXT_COMPLETE` at its end; a preview or truncated result requires reading the
missing material before continuing. For compound tasks load the modes affecting
the result. If a required resource is unavailable, disclose the gap and bound the
answer. Core UX work does not require installing Node.

| Requested result | Recipe |
|---|---|
| Menu or starting point | [help](workflows/help.md#help) |
| Prioritized findings | [audit](workflows/audit.md#audit) |
| New interface or requested implementation | [design](workflows/design.md#design) |
| Journey decisions, states, and recovery | [flow](workflows/flow.md#flow) |
| Component specification, selection, or implementation | [component](workflows/component.md#component) |
| Refinement within the current identity | [polish](workflows/polish.md#polish) |
| Clear labels, messages, and recovery wording | [clarify](workflows/clarify.md#clarify) |
| Adaptation to a device, input, or native platform | [adapt](workflows/adapt.md#adapt) |
| Resilient content, error, and interruption behavior | [harden](workflows/harden.md#harden) |
| Purposeful movement and accessible alternatives | [motion](workflows/motion.md#motion) |
| Study plan or evidence synthesis | [research](workflows/research.md#research) |
| Product-specific team rules | [principles](workflows/principles.md#principles) |
| Persuasion, agency, defaults, and friction review | [ethics](workflows/ethics.md#ethics) |
| Evidence that a promised change works | [verify](workflows/verify.md#verify) |
| Selecting or adapting an outside example | [references](workflows/references.md#references) |

## Ground the task

Use the conversation and available artifact to establish the person, goal,
current obstacle, constraints, and consequence of error. Inspect source, screens,
research, or the live flow as appropriate. Use existing terms and local design
rules; clarify a term only when its meaning changes the decision.

Resolve inspectable facts from available material before asking the user. Ask a
focused question when an unresolved choice would materially change the result;
state a reasonable assumption for a reversible detail and continue. With no
artifact, give a bounded hypothetical proposal or study plan.

Keep three evidence levels distinct:

- **Observed:** supported by an identified artifact, state, measurement, or study.
- **Inferred:** a plausible effect, with its mechanism and assumption.
- **Unknown:** what this evidence cannot establish and how to check it.

A screenshot establishes appearance, not effective targets, keyboard access,
screen-reader behavior, latency, or conversion. Source inspection supports code
claims; an executed interaction supports that tested path. Neither proves user
success. These boundaries apply even when a law offers a plausible explanation.

## Select the relevant guidance

Use this map when the recipe leaves a relevant mechanism open. Read the matching
guide before applying it; add another only when it changes the remedy or tradeoff.
For a broad audit, assess the categories for relevance and retain material exclusions.

| Decision or symptom | Guide |
|---|---|
| Learned behavior, navigation, migration | [Jakob](references/jakob.md) |
| Target acquisition, accidental taps, input modality | [Fitts](references/fitts.md) |
| Remembering, recognition, chunking | [Miller](references/miller.md) |
| Choice complexity, categories, simplification | [Hick](references/hick.md) |
| Input tolerance, internationalization, ambiguity | [Postel](references/postel.md) |
| Journey frustration, closure, recovery | [Peak-End](references/peak-end.md) |
| Appeal versus observed usability | [Aesthetic-Usability](references/aesthetic-usability.md) |
| Competing emphasis, missed changes | [Von Restorff](references/von-restorff.md) |
| Complexity allocation, disclosure, AI assistance | [Tesler](references/tesler.md) |
| Waiting, responsiveness, truthful progress | [Doherty](references/doherty.md) |
| Unknown needs, taxonomy, workflow, attention | [Research methods](references/research-methods.md) |
| Method-specific study procedures | [Research protocols](references/research-protocols.md) |
| Team priorities and reusable rules | [Team principles](references/team-principles.md) |
| Conflicting mechanisms and whole-flow tradeoffs | [Decision patterns](references/decision-patterns.md) |
| Persuasion, privacy, refusal, protective friction | [Ethics](references/ethics.md) |
| Numeric accessibility or conformance claims | [Standards](references/standards.md) |
| Hierarchy, type, spacing, rendered refinement | [Visual craft](references/visual-craft.md) |
| Semantic primitives, states, integration | [Components](references/components.md) |
| Motion, interruption, reduced motion | [Motion](references/motion.md) |
| Choosing an outside example for a specific gap | [Reference selection](references/reference-selection.md) |
| Tactile controls, changing labels, hold/undo, file drop, durable results | [Interaction patterns](references/interaction-patterns.md) |
| New/redesign scope or conflicting product evidence | [Product context](references/product-context.md) |
| Labels, state messages, terminology, localization | [UX copy](references/ux-copy.md) |
| Checking implemented work or a promised outcome | [Review loop](references/review-loop.md) |
| Attribution and chapter coverage | [Sources](references/sources.md) |

For exact opaque sRGB arithmetic, run the optional [contrast helper](scripts/contrast.mjs)
with Node as described in [Standards](references/standards.md#optional-contrast-calculation).
Execute it for calculation; read its source only for review or debugging. Core UX
guidance remains usable when that runtime is unavailable.

## Make the decision or change

1. Locate the obstacle in a specific task and state. Explain the relevant human
   cost: learning, pointing, remembering, choosing, understanding, or waiting.
2. Specify the smallest useful intervention and the work it shifts elsewhere.
   Resolve conflicting mechanisms through the user's goal and consequence.
3. Include the material failure, recovery, and access paths. Distinguish accepted
   intent, pending work, authoritative outcome, and uncertainty where relevant.
4. Deliver the requested artifact. For implementation, complete one useful path
   with its feedback and recovery, check it, then extend until the requested scope
   is complete. Use existing primitives; document a new dependency when needed.
5. Use [Review loop](references/review-loop.md) to check implemented work with
   available tools. When user research is
   needed, define the task, audience, observable outcome, and decision it will inform.

## Return the useful result

Lead with the decision or implemented change. Match the user's length and format;
for a narrow task, give the concrete answer without a full audit report. For a
substantial recommendation, connect:

**Evidence/location → user cost → change → tradeoff → check.**

Name a law when it explains the decision, with its boundary. Cite real research
for audience claims and authoritative standards for conformance claims. Report
executed checks separately from proposed checks; keep measurements, participants,
and predicted gains grounded in actual evidence.

For a word cap, draft around three quarters of the maximum. When Node and shell
execution are available, pipe the actual final draft to the optional
[word-count check](scripts/word-count.mjs): `node <skill-dir>/scripts/word-count.mjs --max N`.
Pass text through stdin using a quoted here-document, so it remains literal;
no draft file is needed. Exit 1 means shorten and check again. Its JSON returns the exact `draft` text.
Return that checked draft verbatim: do not regenerate, expand, or translate it
after counting. Any subsequent edit needs another check. If execution is unavailable,
keep a conservative margin and do not claim a measured count or install a runtime.

Keep the requested findings and material evidence/recovery limits; remove
preambles and secondary observations. Give a numerical measurement only after an
actual calculation or supplied result; otherwise mark it unmeasured. Check scope
and format. Finish when the requested artifact is concrete, material assumptions
and failure behavior are visible, and each important claim has evidence or a gap.
Missing tools narrow the verification claim while useful authorized work continues.
