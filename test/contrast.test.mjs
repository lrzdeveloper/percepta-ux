import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { measureContrast } from '../skills/percepta-ux/scripts/contrast.mjs';

const script = fileURLToPath(new URL('../skills/percepta-ux/scripts/contrast.mjs', import.meta.url));

test('contrast returns worked sRGB ratios without rounding a near-threshold result into a pass', () => {
  assert.equal(measureContrast('#000', '#fff').ratio, 21);
  assert.equal(measureContrast('#abc', '#ABC').ratio, 1);
  // Independently worked example using the W3C sRGB definition, not the helper.
  const nearThreshold = measureContrast('#777', '#fff').ratio;
  assert.ok(Math.abs(nearThreshold - 4.478089453577214) < 1e-12);
  assert.ok(nearThreshold < 4.5);
  assert.equal(measureContrast('#fff', '#777').ratio, nearThreshold);
});

test('contrast normalizes short hex and rejects unresolved or unsupported color inputs', () => {
  assert.equal(measureContrast(' #abc ', '#000000').foreground, '#AABBCC');
  for (const invalid of ['red', 'var(--ink)', '#fff8', '#ffffff80', '#12', '#gggggg', {}, null]) {
    assert.throws(() => measureContrast(invalid, '#fff'), /opaque sRGB/);
  }
});

test('contrast CLI emits scoped JSON and fails invalid arguments without a measurement', () => {
  const valid = spawnSync(process.execPath, [script, '#777', '#fff'], { encoding: 'utf8', shell: false });
  assert.equal(valid.status, 0, valid.stderr);
  const result = JSON.parse(valid.stdout);
  assert.equal(result.foreground, '#777777');
  assert.ok(result.ratio < 4.5);
  assert.match(result.scope, /conformance are not inspected/);
  const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8', shell: false });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage:/);
  assert.match(help.stdout, /#RRGGBB/);
  assert.equal(help.stderr, '');
  for (const args of [[], ['#fff'], ['#fff', '#000', 'extra'], ['#fff8', '#000']]) {
    const invalid = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', shell: false });
    assert.equal(invalid.status, 2);
    assert.equal(invalid.stdout, '');
    assert.ok(invalid.stderr.trim());
  }
});
