import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('npm ships the executable and complete portable skill, excluding developer and source files', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'percepta-package-'));
  try {
    const result = spawnSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      encoding: 'utf8',
      shell: false,
      env: { ...process.env, npm_config_cache: join(temporary, 'npm-cache') },
    });
    assert.equal(result.status, 0, result.stderr);
    const [{ files }] = JSON.parse(result.stdout);
    const names = files.map((file) => file.path);
    assert.ok(names.includes('package.json'));
    assert.ok(names.includes('LICENSE'));
    assert.ok(names.includes('skills/percepta-ux/LICENSE'));
    assert.ok(names.includes('bin/cli.mjs'));
    assert.ok(names.includes('skills/percepta-ux/SKILL.md'));
    assert.ok(names.includes('skills/percepta-ux/agents/openai.yaml'));
    assert.ok(names.includes('skills/percepta-ux/commands.json'));
    assert.ok(names.includes('skills/percepta-ux/scripts/contrast.mjs'));
    assert.ok(names.includes('skills/percepta-ux/scripts/word-count.mjs'));
    assert.ok(names.includes('skills/percepta-ux/scripts/load-context.mjs'));
    assert.ok(names.includes('docs/assets/percepta-header.svg'));
    assert.ok(names.includes('docs/assets/percepta-header-compact.svg'));
    for (const directory of ['references', 'workflows']) {
      const source = new URL(`../skills/percepta-ux/${directory}/`, import.meta.url);
      const expected = readdirSync(source).filter(name => name.endsWith('.md')).map(name => `skills/percepta-ux/${directory}/${name}`).sort();
      assert.deepEqual(names.filter(name => name.startsWith(`skills/percepta-ux/${directory}/`)).sort(), expected);
    }
    assert.ok(names.every((name) => name === 'package.json' || name === 'README.md' || name === 'LICENSE' || name.startsWith('bin/') || name.startsWith('skills/') || name.startsWith('docs/assets/')));
    assert.ok(names.every((name) => !name.endsWith('.pdf') && !name.includes('.env')));
    assert.ok(files.find((file) => file.path === 'bin/cli.mjs').mode & 0o111);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
