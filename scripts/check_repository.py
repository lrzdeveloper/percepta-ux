#!/usr/bin/env python3
"""Check publishable paths and recognizable credentials without printing their values."""
from __future__ import annotations

import argparse
from collections import defaultdict
from pathlib import Path
import re
import subprocess
import sys

ROOT_FILES = {
    '.gitignore', '.gitattributes', '.editorconfig', 'README.md', 'LICENSE',
    'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md',
    'AGENTS.md', 'CLAUDE.md', 'package.json', 'package-lock.json', 'requirements-dev.txt',
}
PATH_RULES = [
    r'\.github/workflows/[a-z0-9_-]+\.ya?ml',
    r'\.githooks/pre-(?:commit|push)',
    r'bin/[a-z0-9_-]+\.mjs',
    r'scripts/[a-z0-9_-]+\.py',
    r'test/[a-z0-9_.-]+\.(?:py|mjs)',
    r'docs/releasing\.md',
    r'docs/assets/(?:icons/)?[a-z0-9_-]+\.(?:svg|png|jpg|webp)',
    r'docs/assets/(?:NOTICE|OFL)\.txt',
    r'evals/(?:README\.md|cases\.json|fixtures/[a-z0-9_-]+\.html)',
    r'skills/percepta-ux/(?:SKILL\.md|LICENSE|commands\.json|agents/openai\.yaml)',
    r'skills/percepta-ux/(?:references|workflows)/[a-z0-9-]+\.md',
    r'skills/percepta-ux/scripts/[a-z0-9-]+\.mjs',
]
SECRET_RULES = {
    'npm credential': re.compile(rb'\bnpm_[A-Za-z0-9]{30,}\b'),
    'GitHub credential': re.compile(rb'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b'),
    'API credential': re.compile(rb'\b(?:sk-ant-[A-Za-z0-9_-]{40,}|sk-proj-[A-Za-z0-9_-]{40,}|sk-svcacct-[A-Za-z0-9_-]{40,})\b'),
    'AWS access key': re.compile(rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'private key': re.compile(rb'-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----'),
    'local home path': re.compile(rb'/(?:Users|home)/[A-Za-z0-9._-]+/'),
}
MAX_BLOB_BYTES = 1024 * 1024


def git(root: Path, *args: str, data: bytes | None = None) -> bytes:
    return subprocess.run(['git', '-C', str(root), *args], input=data,
                          check=True, capture_output=True).stdout


def approved_path(path: str) -> bool:
    return path in ROOT_FILES or any(re.fullmatch(rule, path) for rule in PATH_RULES)


def entries(root: Path, staged: bool) -> dict[str, set[tuple[str, str]]]:
    result = defaultdict(set)
    if staged:
        chunks = git(root, 'ls-files', '--stage', '-z').split(b'\0')
        for chunk in filter(None, chunks):
            metadata, path = chunk.split(b'\t', 1)
            mode, oid, stage = metadata.decode().split()
            result[oid].add((path.decode('utf-8', 'surrogateescape'), mode if stage == '0' else 'unmerged'))
    else:
        commits = git(root, 'rev-list', '--all').decode().splitlines()
        for commit in commits:
            for chunk in filter(None, git(root, 'ls-tree', '-rz', commit).split(b'\0')):
                metadata, path = chunk.split(b'\t', 1)
                mode, kind, oid = metadata.decode().split()
                result[oid].add((path.decode('utf-8', 'surrogateescape'), mode if kind == 'blob' else 'gitlink'))
    return result


def inspect(root: Path, staged: bool = False) -> list[tuple[str, str]]:
    objects = entries(root, staged)
    findings = set()
    if not objects:
        return []
    for paths in objects.values():
        for path, mode in paths:
            if not approved_path(path):
                findings.add((path, 'unapproved publication path'))
            if mode not in {'100644', '100755'}:
                findings.add((path, 'symlink, submodule or unresolved index entry'))
    ids = sorted(objects)
    sizes = git(root, 'cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)',
                data=('\n'.join(ids) + '\n').encode()).decode().splitlines()
    readable = []
    for line in sizes:
        oid, kind, size = line.split()
        if kind != 'blob':
            continue
        if int(size) > MAX_BLOB_BYTES:
            findings.update((path, 'oversized committed file') for path, _ in objects[oid])
        else:
            readable.append(oid)
    if readable:
        stream = git(root, 'cat-file', '--batch', data=('\n'.join(readable) + '\n').encode())
        position = 0
        for oid in readable:
            end = stream.index(b'\n', position)
            size = int(stream[position:end].split()[-1])
            content = stream[end + 1:end + 1 + size]
            position = end + size + 2
            for name, rule in SECRET_RULES.items():
                if rule.search(content):
                    findings.update((path, name) for path, _ in objects[oid])
    return sorted(findings)


def safe_path(path: str) -> str:
    raw = path.encode('utf-8', 'backslashreplace')
    for rule in SECRET_RULES.values():
        raw = rule.sub(b'[redacted]', raw)
    return repr(raw.decode('utf-8', 'backslashreplace'))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--staged', action='store_true', help='Check the index before a commit; default checks every reachable commit.')
    parser.add_argument('--repo', type=Path, default=Path.cwd(), help='Repository to inspect.')
    args = parser.parse_args()
    try:
        findings = inspect(args.repo, args.staged)
    except (OSError, subprocess.CalledProcessError, ValueError):
        print('Repository check could not read Git data; nothing was approved.', file=sys.stderr)
        return 2
    if findings:
        for path, reason in findings:
            print(f'Blocked {safe_path(path)}: {reason}', file=sys.stderr)
        print('Remove local artifacts or credentials before publishing. Detected values are not printed.', file=sys.stderr)
        return 1
    print('Publication check passed: approved files and no recognized credential patterns.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
