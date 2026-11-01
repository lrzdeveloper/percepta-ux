#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadContext, skillRoot } from '../skills/percepta-ux/scripts/load-context.mjs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const catalog = JSON.parse(readFileSync(new URL('../skills/percepta-ux/commands.json', import.meta.url), 'utf8'));
export const SKILLS_VERSION = '1.7.4';
const SOURCE = `https://github.com/lrzdeveloper/percepta-ux/tree/v${manifest.version}`;
const NAME = 'percepta-ux';

const HELP = `Percepta UX ${manifest.version}

Usage:
  percepta-ux                              Choose agents and installation scope
  percepta-ux install [-a agent...] [-g] [-y] [--copy]
  percepta-ux install --list               Discover the skill without installing
  percepta-ux install --dry-run            Print the command without running it
  percepta-ux list [options]               List installed skills via skills
  percepta-ux uninstall [options]          Remove Percepta UX via skills
  percepta-ux update [options]             Update Percepta UX via skills
  percepta-ux doctor                       Check local installation prerequisites
  percepta-ux commands [--json]            Show the agent workflow menu, offline
  percepta-ux prompt <workflow> <task>      Print a prompt for your agent; does not run an AI
  percepta-ux prompt --with-context <workflow> <task>  Include full skill and workflow guides

Examples:
  npx @lrzdeveloper/percepta-ux
  npx @lrzdeveloper/percepta-ux install -g -a claude-code codex
  npx skills add lrzdeveloper/percepta-ux --skill percepta-ux
  percepta-ux prompt component "Improve the save button and its error state"

In your agent:
  /percepta-ux audit <task>                 Claude Code
  $percepta-ux motion <task>                Codex
Use commands to see every workflow. Agent workflows are not installer commands.

Uses skills@${SKILLS_VERSION} for agent discovery, scope selection and installation.
This installer selects the skill from the matching v${manifest.version} Git tag.
Default scope is selected by skills; use -g for a global install.
Requires Git access to the source repository and npm/npx.
Telemetry and security-audit requests are disabled for this installer invocation.
No MCP configuration is required.
`;

export function supportsNode(version) {
  const [major, minor] = version.split('.').map(Number);
  return major > 22 || (major === 22 && minor >= 20);
}

export function plan(argv) {
  const args = [...argv];
  const dryRun = args.includes('--dry-run');
  const forwarded = args.filter((arg) => arg !== '--dry-run');
  let command = forwarded[0]?.startsWith('-') || !forwarded.length ? 'install' : forwarded.shift();
  if (command === 'remove') command = 'uninstall';
  const commands = {
    install: ['add', SOURCE, '--skill', NAME],
    list: ['list'],
    uninstall: ['remove', NAME],
    update: ['update', NAME],
  };
  if (!commands[command]) throw new Error(`Unknown command: ${command}. Run percepta-ux --help.`);
  if (forwarded.some((arg) => arg === '--skill' || arg === '-s' || arg.startsWith('--skill='))) {
    throw new Error('This installer targets percepta-ux. Use skills directly to select other skills.');
  }
  return { dryRun, args: ['--yes', `skills@${SKILLS_VERSION}`, ...commands[command], ...forwarded] };
}

export function run(argv, {
  execute = spawnSync,
  out = (value) => process.stdout.write(value),
  error = (value) => process.stderr.write(value),
  env = process.env,
  nodeVersion = process.versions.node,
} = {}) {
  if (argv[0] === '--help' || argv[0] === '-h' || argv[0] === 'help') {
    out(HELP);
    return 0;
  }
  if (argv[0] === '--version' || argv[0] === '-v') {
    out(`${manifest.version}\n`);
    return 0;
  }
  if (!supportsNode(nodeVersion)) {
    error(`Percepta UX requires Node.js >=22.20.0; found ${nodeVersion}.\n`);
    return 1;
  }
  if (argv[0] === 'commands') {
    if (argv.length > 2 || (argv[1] && argv[1] !== '--json')) {
      error('Usage: percepta-ux commands [--json]\n');
      return 1;
    }
    out(argv[1] === '--json'
      ? `${JSON.stringify(catalog, null, 2)}\n`
      : `Percepta UX workflows\n\n${catalog.commands.map(command => `  ${command.name.padEnd(12)} ${command.summary}`).join('\n')}\n\nUse /percepta-ux <workflow> in Claude Code or $percepta-ux <workflow> in Codex.\n`);
    return 0;
  }
  if (argv[0] === 'prompt') {
    const withContext = argv[1] === '--with-context';
    const [name, ...taskParts] = argv.slice(withContext ? 2 : 1);
    const command = catalog.commands.find(item => item.name === name);
    const task = taskParts.join(' ').trim();
    if (!command || (!task && name !== 'help')) {
      error('Usage: percepta-ux prompt [--with-context] <workflow> <task>. Run percepta-ux commands for the menu.\n');
      return 1;
    }
    if (withContext) {
      try {
        const initial = loadContext(name);
        const linked = [...initial.files[0].content.matchAll(/\]\(\.\.\/references\/([a-z]+(?:-[a-z]+)*)\.md(?:#[^)]+)?\)/g)].map(match => match[1]);
        const context = loadContext(name, linked);
        const entry = readFileSync(new URL('../skills/percepta-ux/SKILL.md', import.meta.url), 'utf8');
        out(`# Percepta UX — prepared ${name} request\n\nThe skill entrypoint, workflow and its directly linked guides are supplied in full below. Treat these files as loaded; no second read is required. Other task-specific guides can still be read if they change the decision. Local helpers are in ${skillRoot}/scripts. Preserve the task's scope and length limit. This prompt does not authorize additional edits or external actions.\n\n## Task\n\n${task || 'Show the workflow menu and examples; wait for a task.'}\n\n## File: SKILL.md\n\n${entry}\nEND_FILE: SKILL.md\n\n${context.files.map(file => `## File: ${file.path}\n\n${file.content}\nEND_FILE: ${file.path}`).join('\n\n')}\n\nPREPARED_CONTEXT_COMPLETE: ${context.files.length + 1} files\n`);
      } catch (failure) {
        error(`Could not prepare complete context: ${failure.message}\n`);
        return 1;
      }
    } else {
      out(`Use the installed Percepta UX skill in ${name} mode.\n\n${task ? `Task:\n${task}` : 'Show the workflow menu and examples; wait for a task.'}\n\nFollow the matching workflow in the installed skill. Report actual checks separately from remaining verification.\n`);
    }
    return 0;
  }
  if (catalog.commands.some(command => command.name === argv[0])) {
    error(`${argv[0]} is an agent workflow, not an installer command. Use /percepta-ux ${argv[0]} in your agent, or percepta-ux prompt ${argv[0]} "your task" to print a prompt.\n`);
    return 1;
  }
  if (argv[0] === 'doctor') {
    const git = execute('git', ['--version'], { encoding: 'utf8', shell: false });
    const npx = execute('npx', ['--version'], { encoding: 'utf8', shell: false });
    const bundled = existsSync(new URL('../skills/percepta-ux/SKILL.md', import.meta.url));
    out(`Node.js: ${nodeVersion}\nGit: ${git.status === 0 ? 'available' : 'missing'}\nnpx: ${npx.status === 0 ? 'available' : 'missing'}\nBundled skill: ${bundled ? 'present' : 'missing'}\n`);
    out('Repository access is checked by the actual Git operation.\n');
    return git.status === 0 && npx.status === 0 && bundled ? 0 : 1;
  }
  let invocation;
  try {
    invocation = plan(argv);
  } catch (failure) {
    error(`${failure.message}\n`);
    return 1;
  }
  if (invocation.dryRun) {
    out(`${JSON.stringify({ executable: 'npx', args: invocation.args, telemetry: false }, null, 2)}\n`);
    return 0;
  }
  if (process.platform === 'win32') {
    error('This wrapper supports macOS and Linux. On Windows use: npx skills add lrzdeveloper/percepta-ux --skill percepta-ux\n');
    return 1;
  }
  const result = execute('npx', invocation.args, {
    stdio: 'inherit',
    shell: false,
    env: { ...env, DISABLE_TELEMETRY: '1', DO_NOT_TRACK: '1' },
  });
  if (result.error) {
    error(`Could not start skills: ${result.error.message}. Check that npm/npx is available.\n`);
    return 1;
  }
  if (result.signal) {
    error(`Installation command stopped (${result.signal}).\n`);
    return result.signal === 'SIGINT' ? 130 : 1;
  }
  if (result.status !== 0) {
    error('The skills command did not complete successfully. Check its error above and GitHub repository access.\n');
  }
  return result.status ?? 1;
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = run(process.argv.slice(2));
}
