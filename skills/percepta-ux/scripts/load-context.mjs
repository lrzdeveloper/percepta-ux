#!/usr/bin/env node

import { readFileSync, realpathSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

export const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function loadContext(mode, extra = [], root = skillRoot) {
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(mode || '') || extra.some(name => !/^[a-z]+(?:-[a-z]+)*$/.test(name))) {
    throw Error('Use a workflow name and optional guide names without paths or extensions.');
  }
  const catalog = JSON.parse(readFileSync(resolve(root, 'commands.json'), 'utf8'));
  const workflow = catalog.commands.find(command => command.name === mode);
  if (!workflow) throw Error(`Unknown workflow: ${mode}. Use --help.`);
  const paths = [...new Set([workflow.guide.split('#')[0], ...(workflow.references || []), ...extra.map(name => `references/${name}.md`), ...(mode === 'help' ? ['commands.json'] : [])])];
  const canonicalRoot = realpathSync(root);
  const files = paths.map(path => {
    if (!/^(?:workflows|references)\/[a-z]+(?:-[a-z]+)*\.md$/.test(path) && path !== 'commands.json') throw Error('Invalid context resource in catalog.');
    const target = realpathSync(resolve(root, path));
    const within = relative(canonicalRoot, target);
    if (within.startsWith('..') || isAbsolute(within)) throw Error('Context resources must remain inside this skill.');
    return { path, content: readFileSync(target, 'utf8') };
  });
  return { mode, files };
}

export function run(args, { out = text => process.stdout.write(text), error = text => process.stderr.write(text) } = {}) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    out('Usage: node load-context.mjs MODE [GUIDE ...]\nLoads the workflow recipe and its default guides in full. Extra guide names omit references/ and .md.\nExample: node load-context.mjs audit standards\nReads only bundled skill resources; no project files, network, or writes.\nExit 0: all requested resources loaded; exit 2: invalid or missing resource, no partial context.\n');
    return 0;
  }
  try {
    const context = loadContext(args[0], args.slice(1));
    out(`# Loaded ${context.mode} context\n\n${context.files.map(file => `## File: ${file.path}\n\n${file.content}\nEND_FILE: ${file.path}`).join('\n\n')}\n\nCONTEXT_COMPLETE: ${context.files.length} files\n`);
    return 0;
  } catch (exception) {
    error(`${exception.message}\n`);
    return 2;
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = run(process.argv.slice(2));
