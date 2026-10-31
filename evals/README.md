# Behavioral scenarios

`cases.json` defines 44 requests and observable review criteria. The fixtures in
`fixtures/` are small synthetic interfaces for source-based checks. These scenarios
support manual evaluation; their presence is not a claim that a model passed them.

## Run a scenario

1. Give a fresh agent the user request and only the required fixture. Keep expected
   criteria outside its visible project. To check automatic discovery, expose the
   skill normally rather than naming it in the request.
2. Record whether the entrypoint and relevant guidance were loaded. Distinguish
   full file reads, complete relevant sections, previews, and supplied context.
3. Review the actual artifact or answer against each criterion. Check scope,
   factual grounding, recovery, output length, and what was really executed.
4. Save local records under ignored `evals/runs/` or outside the repository. Record
   client/model, date, tools, prompt and limitations. Repeat important discovery
   cases; one successful selection does not establish reliability.

A comparison needs the same task, artifacts and available tools. Keep source-only
reviews separate from browser, assistive-technology, service and participant tests.
Critical failures include fabricated measurements or research, unsupported
completion claims, ambiguous consequential input, and obstructed refusal or exit.

## Context and execution limits

A model may omit a guide or rewrite a counted draft. `prompt --with-context`
supplies the selected entrypoint, recipe and directly linked guides in full;
it guarantees input preparation, not model adherence. The optional word checker
measures the submitted draft; a subsequent edit needs another check.

When an artifact or tool is missing, assess the evidence boundary and proposed
next check. Keep incomplete checks explicit. These scenarios complement the
[automated checks](../CONTRIBUTING.md#validation), not user research or product
accessibility certification.
