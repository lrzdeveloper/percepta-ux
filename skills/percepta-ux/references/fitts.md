# Fitts: acquiring a target

## Mechanism and boundary

Pointing difficulty depends on travel distance and the target's effective extent
along the approach. A bigger, closer selectable area generally demands less
precision. Selection includes a speed–accuracy tradeoff, not a promise that every
large control will be faster for every person. Visual size, hit area, reachability,
and neighboring targets are separate properties.

Do not use a pointing model to explain decision time. The book presents the
index of difficulty `ID = log2(2D/W)`, with travel distance D and target width W.
That index alone is not a completion time. For quantitative prediction, document
the chosen formulation, geometry, units, and parameters calibrated for the task
and input method. Most reviews need geometry and observed errors rather than
an uncalibrated numerical prediction.

## Diagnose and act

- Inspect the effective interactive bounds and gaps, including overlapping hit
  regions. Enlarge the hit area without creating competing or invisible overlaps.
  Associate labels with inputs and make actionable rows behave consistently.
- Place repeated next actions near the preceding work, while keeping destructive
  actions sufficiently distinct from frequent safe ones. The nearest location
  is not automatically the safest.
- Test realistic hand use, device sizes, text scaling, keyboard appearance,
  scrolling, and motor constraints. Avoid treating a single thumb-zone diagram
  as universal. Shape, position, labeling, and tactile distinctions can reduce
  errors under distraction; investigate the system before blaming the operator.
- Screen-edge benefits depend on an actual pointer boundary. They do not
  transfer unchanged to an internal browser panel, a multi-monitor seam,
  touch input, or gaze. For spatial input, check field of view, depth changes,
  focus behavior, and actual platform guidance.
- Support keyboard and assistive input as independent interaction paths.

For numeric thresholds and platform units, read [Standards](standards.md).
Distinguish conformance minimums from comfortable task targets. A screenshot
cannot establish an effective hit area or a user's actual reach.

## Verify

Record mis-taps, adjacent activations, retries, acquisition time, and recovery
cost in the relevant context. Check accessible names and focus behavior in the
running implementation. If context matters more than known geometry, plan a
contextual inquiry using [Research methods](research-methods.md).

## Original example

In a stock-count app, Save and Discard have small adjacent hit regions above an
open keyboard. Give Save a reachable, adequately sized area; separate Discard
and provide appropriate recovery. Test at larger text sizes with the keyboard
present. Enlarging both into overlapping rectangles would preserve the defect.

Source basis: ch. 2, printed pp. 15–26; acquisition, human factors, target size,
spacing, reach, desktop edges, spatial computing, and contextual inquiry.
Implementation checks and test criteria here are Percepta extensions.
