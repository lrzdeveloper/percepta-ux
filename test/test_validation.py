"""Exercise portable-package rejection at the public validation boundary."""
import importlib.util
import shutil
import tempfile
import unittest
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("percepta_validation", SOURCE_ROOT / "scripts" / "validate.py")
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


class PortableValidationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name).resolve()
        self.skill = self.root / "skills" / "percepta-ux"
        shutil.copytree(SOURCE_ROOT / "skills" / "percepta-ux", self.skill)
        shutil.copy2(SOURCE_ROOT / "package.json", self.root / "package.json")
        shutil.copy2(SOURCE_ROOT / "LICENSE", self.root / "LICENSE")
        (self.root / "evals").mkdir()
        shutil.copy2(SOURCE_ROOT / "evals" / "cases.json", self.root / "evals" / "cases.json")
        self.original_roots = validator.ROOT, validator.SKILL
        validator.ROOT, validator.SKILL = self.root, self.skill

    def tearDown(self):
        validator.ROOT, validator.SKILL = self.original_roots
        self.temporary.cleanup()

    def test_existing_portable_skill_is_valid(self):
        validator.validate()

    def test_missing_distribution_license_is_rejected(self):
        (self.skill / "LICENSE").unlink()
        with self.assertRaisesRegex(ValueError, "Missing bundled LICENSE"):
            validator.validate()

    def test_human_readme_is_not_a_runtime_resource(self):
        (self.skill / "README.md").write_text("# Human installation instructions\n")
        with self.assertRaisesRegex(ValueError, "README"):
            validator.validate()

    def test_duplicate_frontmatter_cannot_silently_override_a_name(self):
        entry = self.skill / "SKILL.md"
        entry.write_text(entry.read_text().replace("name: percepta-ux", "name: silently-ignored\nname: percepta-ux", 1))
        with self.assertRaisesRegex(ValueError, "Duplicate YAML key"):
            validator.validate()

    def test_unlisted_executable_is_rejected_without_running_it(self):
        (self.skill / "scripts" / "unlisted.mjs").write_text("throw new Error('must never execute');\n")
        with self.assertRaisesRegex(ValueError, "Unexpected runtime resource"):
            validator.validate()


if __name__ == "__main__":
    unittest.main()
