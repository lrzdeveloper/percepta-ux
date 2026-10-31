# Contributing

Describe the user task, observed problem and intended outcome. Keep changes scoped
to a workflow, guide, helper or installation behavior. Use synthetic fixtures;
keep credentials, personal data and local evaluation transcripts out of commits.

## Structure

- `skills/percepta-ux/`: the portable Agent Skill and its bundled license.
- `bin/cli.mjs`: installation, command discovery and prompt preparation.
- `scripts/`: repository validation and deterministic ZIP packaging.
- `test/`: automated CLI, helper and packaging checks.
- `evals/`: reusable behavioral scenarios and synthetic fixtures.
- `docs/assets/`: README artwork and third-party font notices.

Follow the [Agent Skills specification](https://agentskills.io/specification).
Keep shared instructions in the entrypoint and method-specific detail in linked
guides. Preserve task scope, evidence boundaries and existing supported behavior.
Changes to sources should retain appropriate attribution.

## Validation

Development requires Node.js 22.20+ and Python 3.10+ with PyYAML:

```bash
npm run setup:hooks
python3 -m pip install -r requirements-dev.txt
npm test
npm run check:repo
python3 -m unittest discover -s test -p 'test_*.py'
python3 scripts/validate.py
python3 scripts/package_skill.py
```

The builder writes `dist/percepta-ux.skill`, a ZIP containing the self-contained
skill directory. It includes `LICENSE` and excludes developer files. Generated
archives and evaluation records are ignored. See [release preparation](docs/releasing.md).

## Publication checks

`npm run setup:hooks` enables this checkout's versioned Git hooks. The commit
hook checks the full staged snapshot; the push hook checks files in every commit
reachable from local branches and tags. CI repeats the history check. Run
`npm run check:repo` explicitly before publishing from a fresh checkout.

Only the documented source paths are accepted. Keep local reports, prompts,
transcripts, downloaded material, archives and credentials outside Git. New source
locations require a deliberate update to `scripts/check_repository.py`. The check
also rejects symlinks, submodules, files over 1 MiB, local home paths and several
recognizable credential formats. Untracked files are excluded because Git does
not publish them. These checks complement manual review; they cannot identify
every kind of sensitive content, and local hooks can be bypassed.

Inspect `git diff --cached` before each commit. Removing a file in a later commit
does not remove it from history. If a real credential is exposed, revoke or rotate
it immediately and remove the affected history before further publication.

For a meaningful instruction change, exercise a representative behavioral scenario
and inspect the actual answer or artifact. Record tool and evidence limits. Keep
model behavior results separate from deterministic code and format checks.

## License and notices

Contributions to original code and documentation are provided under the project's
[MIT License](LICENSE). Preserve [font notices](docs/assets/NOTICE.txt) and the
book/standards attribution in the relevant guides.
