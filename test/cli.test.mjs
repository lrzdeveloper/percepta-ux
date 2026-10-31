import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { run } from '../bin/cli.mjs';

const releaseVersion = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

function capture(argv, outcome = { status: 0 }, extra = {}) {
  const calls = [];
  let stdout = '';
  let stderr = '';
  const status = run(argv, {
    execute: (...args) => { calls.push(args); return outcome; },
    out: (value) => { stdout += value; },
    error: (value) => { stderr += value; },
    env: { PATH: '/configured/bin', DISABLE_TELEMETRY: '0' },
    nodeVersion: '22.20.0',
    ...extra,
  });
  return { calls, status, stdout, stderr };
}

test('help, version and dry-run never launch the installer', () => {
  for (const argv of [['--help'], ['--version'], ['install', '--dry-run']]) {
    const result = capture(argv);
    assert.equal(result.status, 0);
    assert.equal(result.calls.length, 0);
    assert.ok(result.stdout.length > 0);
  }
});

test('default install leaves agent and scope selection to skills', () => {
  const result = capture([]);
  assert.equal(result.status, 0);
  assert.equal(result.calls.length, 1);
  const [executable, args, options] = result.calls[0];
  assert.equal(executable, 'npx');
  assert.ok(args.includes(`https://github.com/lrzdeveloper/percepta-ux/tree/v${releaseVersion}`));
  assert.ok(!args.includes('-g') && !args.includes('--all') && !args.includes('-y'));
  assert.equal(options.stdio, 'inherit');
  assert.equal(options.shell, false);
  assert.equal(options.env.DISABLE_TELEMETRY, '1');
  assert.equal(options.env.DO_NOT_TRACK, '1');
  assert.equal(options.env.PATH, '/configured/bin');
});

test('agent arguments reach the child as discrete arguments without shell interpretation', () => {
  const sentinel = 'literal $(touch must-not-exist)';
  const result = capture(['install', '-g', '-a', 'claude-code', sentinel, '-y']);
  const args = result.calls[0][1];
  assert.ok(args.includes(sentinel));
  assert.deepEqual(args.slice(-5), ['-g', '-a', 'claude-code', sentinel, '-y']);
  assert.equal(result.calls[0][2].shell, false);
});

test('errors and interruption are not reported as a successful installation', () => {
  assert.equal(capture(['install'], { status: 7 }).status, 7);
  assert.equal(capture(['install'], { status: null, error: new Error('ENOENT') }).status, 1);
  assert.equal(capture(['install'], { status: null, signal: 'SIGINT' }).status, 130);
});

test('unknown commands and alternate skill selection fail before launching', () => {
  for (const argv of [['publish'], ['install', '--skill', 'another-skill']]) {
    const result = capture(argv);
    assert.equal(result.status, 1);
    assert.equal(result.calls.length, 0);
  }
});

test('management commands name Percepta without silently removing all skills', () => {
  for (const command of ['uninstall', 'remove', 'update']) {
    const result = capture([command]);
    const args = result.calls[0][1];
    assert.ok(args.includes('percepta-ux'));
    assert.ok(!args.includes('--all') && !args.includes('-y') && !args.includes('-g'));
  }
});

test('unsupported runtime fails before installation; help stays usable', () => {
  for (const nodeVersion of ['20.19.0', '22.19.9']) {
    const result = capture([], { status: 0 }, { nodeVersion });
    assert.equal(result.status, 1);
    assert.equal(result.calls.length, 0);
  }
  assert.equal(capture(['--help'], { status: 0 }, { nodeVersion: '20.19.0' }).status, 0);
});

test('doctor checks prerequisites without claiming authentication was tested', () => {
  const result = capture(['doctor']);
  assert.equal(result.status, 0);
  assert.equal(result.calls.length, 2);
  assert.ok(result.calls.every(([, args]) => args[0] === '--version'));
  assert.match(result.stdout, /Repository access is checked by the actual Git operation/);
});

test('workflow discovery is offline and provides structured command metadata', () => {
  const result = capture(['commands', '--json']);
  assert.equal(result.status, 0);
  assert.equal(result.calls.length, 0);
  const catalog = JSON.parse(result.stdout);
  assert.equal(new Set(catalog.commands.map(command => command.name)).size, catalog.commands.length);
  for (const name of ['audit', 'component', 'motion', 'research', 'verify', 'clarify', 'adapt', 'harden']) {
    assert.ok(catalog.commands.some(command => command.name === name));
  }
});

test('prompt generation preserves literal task text and never launches installation or an AI', () => {
  const literal = 'Keep $currency and $(not-a-command); preserve the existing brand.';
  const result = capture(['prompt', 'polish', literal]);
  assert.equal(result.status, 0);
  assert.equal(result.calls.length, 0);
  assert.ok(result.stdout.includes(literal));
  assert.match(result.stdout, /in polish mode/);
});

test('invalid or incomplete workflows cannot fall through into installation', () => {
  for (const argv of [['prompt'], ['prompt', 'audit'], ['prompt', 'unknown', 'task'], ['audit', 'task'], ['clarify', 'task'], ['adapt', 'task'], ['harden', 'task'], ['commands', '--global']]) {
    const result = capture(argv);
    assert.equal(result.status, 1);
    assert.equal(result.calls.length, 0);
  }
  assert.equal(capture(['prompt', 'help']).status, 0);
});


test('prepared prompts contain the complete entrypoint, workflow and directly linked guides without execution', () => {
  let text = '', launched = 0;
  const status = run(['prompt', '--with-context', 'research', 'Piano locale; $(keep-literal) — massimo 120 parole'], { out: value => text += value, execute: () => { launched++; } });
  assert.equal(status, 0);
  assert.equal(launched, 0);
  assert.ok(text.includes('Piano locale; $(keep-literal) — massimo 120 parole'));
  for (const name of ['SKILL.md', 'workflows/research.md', 'references/research-methods.md', 'references/research-protocols.md']) {
    assert.ok(text.includes(`## File: ${name}\n`));
    assert.ok(text.includes(`END_FILE: ${name}`));
    assert.ok(text.includes(readFileSync(new URL(`../skills/percepta-ux/${name}`, import.meta.url), 'utf8')));
  }
  assert.ok(text.endsWith('PREPARED_CONTEXT_COMPLETE: 4 files\n'));
  assert.ok(text.includes('## Eye tracking'));
  assert.ok(text.includes('## Interpret and decide'));
});
