import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, mkdirSync, symlinkSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadContext, skillRoot } from '../skills/percepta-ux/scripts/load-context.mjs';

const loader = join(skillRoot, 'scripts/load-context.mjs');
test('context loader returns full recipe and required guides, with unique requested extras', () => {
  const result = loadContext('audit', ['standards', 'components']);
  assert.deepEqual(result.files.map(file => file.path), ['workflows/audit.md', 'references/components.md', 'references/doherty.md', 'references/standards.md']);
  for (const file of result.files) assert.equal(file.content, readFileSync(join(skillRoot, file.path), 'utf8'));
  const cli = spawnSync(process.execPath, [loader, 'audit', 'standards'], { encoding: 'utf8' });
  assert.equal(cli.status, 0);
  for (const file of result.files) assert.ok(cli.stdout.includes(file.content));
  assert.ok(cli.stdout.endsWith('CONTEXT_COMPLETE: 4 files\n'));
  const catalog = JSON.parse(readFileSync(join(skillRoot, 'commands.json'), 'utf8'));
  for (const command of catalog.commands) assert.ok(loadContext(command.name).files.length > 0);
  assert.ok(loadContext('help').files.some(file => file.path === 'commands.json'));
});

test('context loader rejects missing resources and path traversal without printing partial context', () => {
  for (const args of [[], ['not-a-mode'], ['audit', '../secret'], ['research', 'missing-guide']]) {
    const result = spawnSync(process.execPath, [loader, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.length > 0);
  }
  const help = spawnSync(process.execPath, [loader, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage:/);
});

test('context loader refuses a bundled path redirected outside the skill', { skip: process.platform === 'win32' }, () => {
  const temporary = mkdtempSync(join(tmpdir(), 'percepta-context-'));
  try {
    const skill = join(temporary, 'skill');
    mkdirSync(join(skill, 'workflows'), { recursive: true });
    writeFileSync(join(temporary, 'outside.md'), '# Must not load\n');
    symlinkSync(join(temporary, 'outside.md'), join(skill, 'workflows/audit.md'));
    writeFileSync(join(skill, 'commands.json'), JSON.stringify({ commands: [{ name: 'audit', guide: 'workflows/audit.md#audit', references: [] }] }));
    assert.throws(() => loadContext('audit', [], skill), /inside this skill/);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});

test('all helper CLIs execute through a symlinked skill directory', { skip: process.platform === 'win32' }, () => {
  const temporary = mkdtempSync(join(tmpdir(), 'percepta-link-'));
  try {
    const link = join(temporary, 'linked');
    symlinkSync(skillRoot, link, 'dir');
    const context = spawnSync(process.execPath, [join(link, 'scripts/load-context.mjs'), 'research'], { encoding: 'utf8' });
    assert.equal(context.status, 0);
    assert.ok(context.stdout.includes('## File: references/research-methods.md'));
    const contrast = spawnSync(process.execPath, [join(link, 'scripts/contrast.mjs'), '#777', '#fff'], { encoding: 'utf8' });
    assert.equal(contrast.status, 0);
    assert.ok(JSON.parse(contrast.stdout).ratio < 4.5);
    const word = spawnSync(process.execPath, [join(link, 'scripts/word-count.mjs'), '--max', '3'], { input: 'one two three', encoding: 'utf8' });
    assert.equal(word.status, 0);
    assert.equal(JSON.parse(word.stdout).words, 3);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
