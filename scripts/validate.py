#!/usr/bin/env python3
"""Check portable skill structure, repository references, and package hygiene."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

try:
    import yaml
except ImportError:
    raise SystemExit("Install development dependencies: python3 -m pip install -r requirements-dev.txt")

class UniqueSafeLoader(yaml.SafeLoader):
    """Reject ambiguous mappings while retaining safe YAML construction."""


def unique_mapping(loader, node, deep=False):
    loader.flatten_mapping(node)
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        try:
            duplicate = key in result
        except TypeError as exc:
            raise ValueError("YAML mapping keys must be scalar") from exc
        if duplicate:
            raise ValueError(f"Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueSafeLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def load_yaml(text):
    return yaml.load(text, Loader=UniqueSafeLoader)


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "percepta-ux"
LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^\s)]+)(?:\s+\"[^\"]*\")?\)")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def headings(text: str) -> set[str]:
    result: set[str] = set()
    counts: dict[str, int] = {}
    for match in re.finditer(r"(?m)^#{1,6}\s+(.+?)\s*#*\s*$", text):
        title = re.sub(r"[`*_]", "", match.group(1)).lower()
        slug = re.sub(r"[^\w\- ]", "", title).replace(" ", "-")
        number = counts.get(slug, 0)
        counts[slug] = number + 1
        result.add(f"{slug}-{number}" if number else slug)
    return result


def local_links(document: Path, text: str) -> set[Path]:
    reached: set[Path] = set()
    for raw in LINK.findall(text):
        uri = urlsplit(raw)
        if uri.scheme:
            require(uri.scheme in {"https", "http", "mailto"}, f"Unsupported URI in {document}: {raw}")
            continue
        require(not uri.netloc, f"Unscoped link in {document}: {raw}")
        target = (document.parent / unquote(uri.path)).resolve() if uri.path else document.resolve()
        require(target.is_relative_to(ROOT), f"Link escapes repository: {document}: {raw}")
        require(target.is_file(), f"Missing link target: {document}: {raw}")
        if document.is_relative_to(SKILL):
            require(target.is_relative_to(SKILL), f"Installed skill depends on repository-only file: {raw}")
        if uri.fragment and target.suffix == ".md":
            require(unquote(uri.fragment) in headings(target.read_text()), f"Missing anchor: {document}: {raw}")
        reached.add(target)
    return reached


def package_files() -> list[Path]:
    allowed = {".md", ".yaml"}
    files: list[Path] = []
    for path in sorted(SKILL.rglob("*")):
        require(not path.is_symlink(), f"Symlink is not portable: {path}")
        if path.is_file():
            require(path.name.lower() != "readme.md", f"Keep README outside the runtime skill: {path}")
            require(path.suffix in allowed or path in {SKILL / "commands.json", SKILL / "LICENSE", SKILL / "scripts" / "contrast.mjs", SKILL / "scripts" / "word-count.mjs", SKILL / "scripts" / "load-context.mjs"}, f"Unexpected runtime resource: {path}")
            require(not any(part.startswith(".") for part in path.relative_to(SKILL).parts), f"Hidden runtime file: {path}")
            files.append(path)
    require(bool(files), "Skill package is empty")
    return files


def validate() -> dict[str, int]:
    entry = SKILL / "SKILL.md"
    text = entry.read_text()
    parts = text.split("---", 2)
    require(len(parts) == 3 and not parts[0].strip(), "SKILL.md needs leading YAML frontmatter")
    front = load_yaml(parts[1])
    require(isinstance(front, dict), "Frontmatter must be a mapping")
    name = front.get("name")
    require(isinstance(name, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) is not None, "Invalid skill name")
    require(len(name) <= 64 and name == SKILL.name, "Name must match the directory and be at most 64 characters")
    description = front.get("description")
    require(isinstance(description, str) and 0 < len(description) <= 1024, "Description must be 1–1024 characters")
    require("<" not in description and ">" not in description, "Description contains angle brackets")
    require(len(text.splitlines()) < 500, "Move conditional detail out of SKILL.md")
    require(len(text.split()) < 5000, "Entrypoint exceeds the recommended content budget")
    metadata = front.get("metadata", {})
    require(isinstance(metadata, dict) and all(isinstance(k, str) and isinstance(v, str) for k, v in metadata.items()), "Metadata must contain string keys and values")
    manifest = json.loads((ROOT / "package.json").read_text())
    require(metadata.get("version") == manifest.get("version"), "Skill and npm manifest versions differ")

    require(front.get("license") == manifest.get("license") == "MIT", "Skill and package must declare MIT")
    license_file = SKILL / "LICENSE"
    require(license_file.is_file(), "Missing bundled LICENSE")
    require(license_file.read_bytes() == (ROOT / "LICENSE").read_bytes(), "Bundled LICENSE differs from root LICENSE")

    ui = load_yaml((SKILL / "agents" / "openai.yaml").read_text())
    interface = ui.get("interface", {})
    require(isinstance(interface.get("display_name"), str), "Missing UI display name")
    short = interface.get("short_description", "")
    require(isinstance(short, str) and 25 <= len(short) <= 64, "UI short description must be 25–64 characters")
    require(f"${name}" in interface.get("default_prompt", ""), "Default prompt must mention the skill")

    runtime = package_files()
    catalog_path = SKILL / "commands.json"
    catalog = json.loads(catalog_path.read_text())
    require(catalog.get("schema_version") == 1, "Unsupported command catalog version")
    commands = catalog.get("commands")
    require(isinstance(commands, list) and bool(commands), "Missing workflow catalog")
    names = [command.get("name") for command in commands]
    require(all(isinstance(name, str) and re.fullmatch(r"[a-z]+(?:-[a-z]+)*", name) for name in names), "Invalid workflow name")
    require(len(names) == len(set(names)), "Duplicate workflow names")
    require("help" in names, "Missing help workflow")
    for command in commands:
        require(isinstance(command.get("summary"), str) and 0 < len(command["summary"]) <= 120, "Invalid workflow summary")
        require(isinstance(command.get("guide"), str) and "#" in command["guide"], "Workflow needs a guide section")
        local_links(catalog_path, f"[guide]({command['guide']})")
        references = command.get("references", [])
        require(isinstance(references, list) and all(isinstance(path, str) and re.fullmatch(r"references/[a-z]+(?:-[a-z]+)*\.md", path) for path in references), "Invalid workflow references")
        require(len(references) == len(set(references)), "Duplicate workflow references")
        for reference in references:
            local_links(catalog_path, f"[reference]({reference})")
    documents = [p for p in ROOT.rglob("*.md") if not {".git", "dist"}.intersection(p.relative_to(ROOT).parts)]
    directly_linked = local_links(entry, text)
    refs = set((SKILL / "references").glob("*.md"))
    recipes = set((SKILL / "workflows").glob("*.md"))
    catalog_guides = {(SKILL / urlsplit(command["guide"]).path).resolve() for command in commands}
    require(recipes == catalog_guides, "Workflow recipes and catalog guides differ")
    require(recipes.issubset(directly_linked), "A workflow recipe is not directly discoverable from SKILL.md")
    require(refs.issubset(directly_linked), "A reference is not directly discoverable from SKILL.md")
    for document in documents:
        content = document.read_text()
        local_links(document, content)
        require(not re.search(r"\b(?:TODO|TBD|FIXME)\b|\[INSERT[^\]]*\]", content), f"Unfinished scaffold in {document}")
        require("/Users/" not in content, f"Machine-specific absolute path in {document}")
    for path in runtime:
        content = path.read_text()
        require(not re.search(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}", content), f"Potential credential in {path}")

    cases = json.loads((ROOT / "evals" / "cases.json").read_text())["cases"]
    require(bool(cases), "No behavioral cases")
    ids = [case["id"] for case in cases]
    require(len(ids) == len(set(ids)), "Duplicate evaluation case IDs")
    for case in cases:
        require(isinstance(case.get("should_trigger"), bool), f"Missing discovery expectation: {case['id']}")
        require(isinstance(case.get("prompt"), str) and bool(case["prompt"].strip()), f"Missing prompt: {case['id']}")
        checks = case.get("checks")
        require(isinstance(checks, list) and bool(checks) and all(isinstance(c, str) and c.strip() for c in checks), f"Missing observable checks: {case['id']}")
    require(any(not case["should_trigger"] for case in cases), "Add a negative discovery case")
    return {"runtime_files": len(runtime), "references": len(refs), "workflows": len(commands), "workflow_recipes": len(recipes), "entrypoint_lines": len(text.splitlines()), "behavioral_fixtures": len(cases)}


if __name__ == "__main__":
    try:
        print(json.dumps({"structural_validation": "passed", **validate()}, indent=2))
    except (ValueError, KeyError, OSError, yaml.YAMLError, json.JSONDecodeError) as exc:
        print(f"Validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
