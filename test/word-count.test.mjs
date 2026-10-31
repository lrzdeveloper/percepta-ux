import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { countWords, run } from '../skills/percepta-ux/scripts/word-count.mjs';
const script = fileURLToPath(new URL('../skills/percepta-ux/scripts/word-count.mjs', import.meta.url));

test('word count handles Unicode whitespace, empty drafts, headings and exact boundaries', () => {
  assert.equal(countWords(' \n\t '), 0);
  assert.equal(countWords('Città\u00a0e\tunità\n# Titolo'), 5);
  const exact = spawnSync(process.execPath, [script, '--max', '3'], { input: 'Uno due tre', encoding: 'utf8' });
  assert.equal(exact.status, 0);
  assert.deepEqual(JSON.parse(exact.stdout), { words: 3, maximum: 3, withinLimit: true, draft: 'Uno due tre', convention: 'whitespace-separated words; includes headings and code' });
});

test('word count reports an over-limit draft and returns its original text', () => {
  const over = spawnSync(process.execPath, [script, '--max', '2'], { input: 'sample draft contents', encoding: 'utf8' });
  assert.equal(over.status, 1);
  assert.equal(JSON.parse(over.stdout).words, 3);
  assert.equal(JSON.parse(over.stdout).withinLimit, false);
  assert.equal(JSON.parse(over.stdout).draft, 'sample draft contents');
  assert.equal(over.stderr, '');
});

test('word count help and invalid input do not read or validate a draft', () => {
  let output = '', diagnostics = '';
  const io = { read: () => { throw Error('must not read'); }, out: s => output += s, error: s => diagnostics += s };
  assert.equal(run(['--help'], io), 0);
  assert.match(output, /stdin/);
  for (const args of [[], ['--max', '-1'], ['--max', '1.5'], ['--max', '1e3'], ['--max', 'Infinity'], ['--max', '9007199254740992'], ['--max', '2', 'extra']]) {
    output = ''; diagnostics = '';
    assert.equal(run(args, io), 2);
    assert.equal(output, '');
    assert.match(diagnostics, /Provide/);
  }
  output = ''; diagnostics = '';
  assert.equal(run(['--max', '2'], io), 2);
  assert.equal(output, '');
  assert.match(diagnostics, /stdin/);
});
