#!/usr/bin/env node

import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function countWords(text) {
  const value = text.trim();
  return value ? value.split(/\s+/u).length : 0;
}

export function run(args, { read = () => readFileSync(0, 'utf8'), out = (text) => process.stdout.write(text), error = (text) => process.stderr.write(text) } = {}) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    out('Usage: node word-count.mjs --max WORDS < draft.txt\nReads the final draft from stdin; counts whitespace-separated words.\nEmits JSON with count, result and the original draft for verbatim return. No project files or network access.\nExit 0: within limit; 1: over limit; 2: invalid arguments or unreadable stdin.\n');
    return 0;
  }
  if (args.length !== 2 || args[0] !== '--max' || !/^(0|[1-9]\d*)$/.test(args[1]) || !Number.isSafeInteger(Number(args[1]))) {
    error('Provide --max and a nonnegative safe integer. Use --help for usage.\n');
    return 2;
  }
  let draft;
  try { draft = read(); } catch {
    error('Could not read the draft from stdin.\n');
    return 2;
  }
  const words = countWords(draft);
  const maximum = Number(args[1]);
  const withinLimit = words <= maximum;
  out(`${JSON.stringify({ words, maximum, withinLimit, draft, convention: 'whitespace-separated words; includes headings and code' })}\n`);
  return withinLimit ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  process.exitCode = run(process.argv.slice(2));
}
