# Standards: scope numeric claims

The book's 2024 examples are historical context. For a conformance claim, identify
the target standard/version, level, platform, units, applicable exceptions, and
actual measurement. Recheck official guidance when using this reference for
current compliance. If browsing is unavailable, disclose that verification limit.

## Verified web reference points

Checked against W3C on 2026-10-31:

- **WCAG 2.2, SC 2.5.8, Level AA:** targets are at least 24 × 24 CSS px, or an
  applicable exception is satisfied. The spacing exception uses 24 CSS px
  diameter circles centered on undersized target bounding boxes and checks their
  intersection with other targets or such circles. Equivalent control, inline,
  user-agent, and essential exceptions are also specified. Read the actual
  criterion before applying an exception.
  [W3C target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- **WCAG 2.2, SC 2.5.5, Level AAA:** 44 × 44 CSS px targets, with specified
  exceptions. This is not the blanket AA minimum.
  [W3C target size enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html).
- **WCAG 2.2, SC 1.4.3, Level AA:** text generally needs 4.5:1 contrast; qualifying
  large text needs 3:1. Large text is at least 18 pt, or 14 pt bold, subject to
  the criterion's definitions and exceptions. This does not establish non-text
  contrast, color independence, focus, or whole-interface conformance.
  [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

These statements are reference points, not a complete accessibility audit.
WCAG Understanding pages explain the normative criteria linked within them.
Measure actual hit regions and resolve foreground/background values in the relevant
state, including composition where applicable. For text, use specified/computed
colors rather than antialiased edge pixels.

## Platform and modality

CSS pixels, typographic points, platform points, density-independent pixels,
physical pixels, and physical size are not interchangeable measurements. Do not
convert them without the actual platform and display context. Consult current
official platform guidance for touch, pointer, gaze, spatial interaction, text
scaling, and assistive technology rather than importing a table from the book.

Distinguish a conformance minimum from a usable design target. A control meeting
one minimum can still be hard to acquire or understand in its actual task.

## Performance

The historical Doherty threshold is not a modern web performance standard or an
accessibility criterion. Define what was measured: input acknowledgement, content
availability, operation acceptance, or final outcome. Avoid treating a loading
animation as evidence that an operation or performance target succeeded.

## Optional contrast calculation

When a resolved opaque sRGB pair needs arithmetic, use the bundled
[contrast helper](../scripts/contrast.mjs) if Node is available:

```bash
node <skill-folder>/scripts/contrast.mjs '#777777' '#FFFFFF'
```

It accepts #RGB or #RRGGBB and returns an unrounded numeric ratio as JSON. It reads
no files, uses no network, and changes no project configuration. Alpha, CSS variables,
named colors, gradients, and other color spaces need resolution or another tool;
unknown colors remain unknown. Core guidance works without this optional helper.

The implementation follows the W3C sRGB relative-luminance and contrast-ratio
definitions linked under [contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
Compare the raw ratio to an applicable threshold before rounding for display:
4.478:1 is below 4.5:1. Identify the foreground/background source, actual state,
text category, and exceptions. The helper does not inspect rendering, choose the
applicable criterion, or establish whole-interface conformance.

### Execution and recovery

Run the bundled script directly for ordinary calculations; reading or regenerating
its implementation is unnecessary. `--help` prints usage without a measurement.
Two valid color arguments produce JSON and exit 0; that status means arithmetic
succeeded, not that a criterion passed. The `ratio` field retains full precision.

Unsupported input or wrong argument count exits 2 and prints an explanation to
stderr without a ratio. Resolve the actual input before retrying; preserve an
unknown foreground/background as unknown instead of substituting a convenient
color. When Node, script access, or execution is unavailable, continue the UX work
and mark this check unexecuted, or use an available calculator with the same W3C
formula and identify the method. The optional helper does not justify installing
a runtime or changing project configuration as an unrequested side effect.
