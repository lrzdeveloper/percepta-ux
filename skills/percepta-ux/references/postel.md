# Postel: tolerant interaction, dependable interpretation

## Mechanism and boundary

People vary in language, ability, input method, context, and attention. An interface
can absorb harmless variation instead of forcing everyone to behave like its data
schema. It should return understandable, consistent results across those contexts.

This UX interpretation of the robustness principle is not permission to accept
unsafe data, weaken authorization, bypass schema validation, or silently guess a
consequential meaning. Distinguish forgiving presentation from trustworthy system
boundaries. Normalize when semantics are clear; ask for clarification when they
are not.

## Diagnose and act

- Ask only for information needed at this point. Reuse known information with a
  visible correction path. Explain necessary constraints before failure.
- Accept harmless separators, spacing, and relevant Unicode where valid. Check
  actual name and address requirements instead of assuming a Western naming
  structure. Preserve the original input when changing it would lose meaning.
- Make locale assumptions explicit for dates, decimal separators, currencies,
  time zones, and units. “03/04” or “1,234” may require disambiguation; a plausible
  parse is not evidence of intent.
- Give actionable, field-related errors without blaming the person. Preserve
  unrelated work and move or announce focus appropriately. Server validation
  remains authoritative; client validation should help rather than surprise.
- Support baseline content and core actions across devices and input methods.
  Add enhancements as capabilities permit. Provide an alternative to a feature
  that requires voice, biometrics, fine gestures, or a powerful device.
- Inspect text expansion, right-to-left content, user text scaling, zoom, layout
  reflow, constrained screens, interruption, and poor connectivity. Access to
  necessary functions should survive adaptation.

At a design-system level, accept feedback from varied disciplines and users, then
publish clear, coherent patterns and guidance. A shared component needs robust
states, not just its attractive default appearance.

## Verify

Use representative valid and invalid input, including international variations,
ambiguous values, paste/autofill, correction, and resubmission. Exercise relevant
assistive input and reflow states. Interviews can uncover terminology and
expectations; observation is needed to check actual interaction behavior.

## Original example

An expense app can remove spaces around a pasted invoice ID without changing its
meaning. For “1.234” it shows the currency and locale interpretation and asks when
the amount is ambiguous. The user can correct it before submission. Broad input
acceptance is paired with a precise, reviewable financial value.

Source basis: ch. 5, printed pp. 53–63; variable input, accessible output, responsive
design, progressive enhancement, design systems, interviews, and resilience.
Security boundaries and explicit disambiguation are Percepta implementation
extensions, not claims that the book specifies a validation architecture.
