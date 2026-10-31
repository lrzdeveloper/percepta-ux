# Tesler: who carries the complexity?

## Mechanism and boundary

A task has information, decisions, and constraints that must be handled somewhere.
A simpler interface can move work into the system, another person, setup, support,
or later recovery. Treat conservation of complexity as a design heuristic, not a
physical law or proof that the current process is irreducible. Some requirements
can disappear when the task or policy is reconsidered.

Complexity bias can make an elaborate solution seem more credible than a simple
one. Diagnose the actual problem before adopting more abstraction or automation.
An interface with fewer controls can create more hidden reasoning work.

## Diagnose and act

- Inventory necessary inputs, business constraints, decisions, exceptional cases,
  and handoffs. Separate essential task work from accidental implementation work.
- For each burden, state who supplies it, when, how often, and who recovers from
  mistakes. Move repeated mechanical work into the system where it is reliable.
- Reuse data, offer editable defaults, avoid duplicate entry, and keep source and
  consequences visible. Automation needs correction and fallback, not just the
  convenient default case.
- Use progressive disclosure for infrequent or advanced choices when a discoverable
  entry point remains. Essential price, commitment, status, and safety information
  should be available before the relevant decision. Inspect added navigation cost.
- The active-user paradox predicts that people start working before reading
  manuals. Put concise help in context, enable safe exploration, preserve state,
  and reveal useful shortcuts after people have a reason to learn them.

## AI and intent-based interfaces

Natural-language interaction can move command knowledge into the system. It can
also export complexity to prompt writing, resolving ambiguity, checking output,
and repairing an incorrect result. Make interpreted intent, relevant assumptions,
scope, data provenance, and editable parameters visible when they affect the task.
Use preview and confirmation where consequences warrant them; retain a structured
path for precise or repeated work when appropriate. This is Percepta's practical
extension of the book's discussion of intent-based interaction, not a claim that
the book specifies modern model reliability techniques.

## Verify

Compare end-to-end work, not just visible controls or clicks. Include setup,
correction, backtracking, and support effort. Test novice discovery and expert
repetition where relevant. Check whether new automation saves more work than it
creates and whether people can detect and repair its mistakes.

## Original example

A report builder replaces twelve filters with a chat box. Provide suggested
starting questions and expose the interpreted filters as editable state. Preserve
a direct filter path for analysts repeating exact reports. Count verification and
correction effort before calling the new experience simpler.

Source basis: ch. 9, printed pp. 107–117; burden allocation, complexity bias,
automation, natural-language intent, active users, and progressive disclosure.
The burden inventory, AI verification criteria, and example are Percepta extensions.
