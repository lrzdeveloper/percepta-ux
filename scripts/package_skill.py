#!/usr/bin/env python3
"""Build a validated, deterministic .skill ZIP without source or developer files."""

from __future__ import annotations

import argparse
import tempfile
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from validate import ROOT, SKILL, package_files, validate


def build(output: Path) -> list[str]:
    validate()
    files = package_files()
    output = output.resolve()
    if output.is_relative_to(SKILL):
        raise ValueError("Write the archive outside the runtime skill directory")
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(prefix=".percepta-", suffix=".tmp", dir=output.parent, delete=False) as stream:
            temporary = Path(stream.name)
        with ZipFile(temporary, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
            for source in files:
                relative = Path(SKILL.name) / source.relative_to(SKILL)
                info = ZipInfo(relative.as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
                info.create_system = 3
                info.compress_type = ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, source.read_bytes())
        with ZipFile(temporary) as archive:
            if archive.testzip() is not None:
                raise ValueError("Archive integrity check failed")
            names = archive.namelist()
            expected = [f"{SKILL.name}/{source.relative_to(SKILL).as_posix()}" for source in files]
            if names != expected:
                raise ValueError("Archive manifest mismatch")
        temporary.replace(output)
        return names
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / "percepta-ux.skill")
    args = parser.parse_args()
    try:
        names = build(args.output)
    except (OSError, ValueError) as exc:
        raise SystemExit(f"Packaging failed: {exc}")
    print(f"Built {args.output.resolve()} ({len(names)} runtime files)")
