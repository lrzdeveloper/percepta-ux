"""Exercise publication checks against real temporary Git objects and history."""
import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'check_repository.py'
spec = importlib.util.spec_from_file_location('repository_hygiene', SCRIPT)
hygiene = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hygiene)


class RepositoryHygieneTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.git('init', '-q')
        self.git('config', 'user.name', 'Fixture Author')
        self.git('config', 'user.email', 'fixture@example.invalid')

    def git(self, *args):
        return subprocess.run(['git', '-C', str(self.root), *args], check=True,
                              capture_output=True).stdout

    def stage(self, name, content):
        target = self.root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
        self.git('add', '--', name)

    def commit(self):
        self.git('commit', '-qm', 'Fixture update')

    def test_clean_index_and_history_pass(self):
        self.stage('README.md', 'A portable skill.\n')
        self.assertEqual(hygiene.inspect(self.root, staged=True), [])
        self.commit()
        self.assertEqual(hygiene.inspect(self.root), [])

    def test_unapproved_artifact_is_blocked(self):
        self.stage('evals/runs/session.json', '{}')
        self.assertIn(('evals/runs/session.json', 'unapproved publication path'),
                      hygiene.inspect(self.root, staged=True))

    def test_secret_is_blocked_without_printing_value(self):
        credential = 'gh' + 'p_' + 'X' * 36
        self.stage('README.md', credential)
        result = subprocess.run([sys.executable, str(SCRIPT), '--repo', str(self.root), '--staged'],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn('GitHub credential', result.stderr)
        self.assertNotIn(credential, result.stderr + result.stdout)

    def test_npm_credential_is_blocked(self):
        credential = 'np' + 'm_' + 'X' * 36
        self.stage('README.md', credential)
        result = subprocess.run([sys.executable, str(SCRIPT), '--repo', str(self.root), '--staged'],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn('npm credential', result.stderr)
        self.assertNotIn(credential, result.stdout + result.stderr)

    def test_removed_secret_stays_blocked_in_history(self):
        self.stage('README.md', 'gh' + 'p_' + 'X' * 36)
        self.commit()
        self.stage('README.md', 'Clean now.\n')
        self.commit()
        self.assertEqual(hygiene.inspect(self.root, staged=True), [])
        self.assertIn(('README.md', 'GitHub credential'), hygiene.inspect(self.root))

    def test_untracked_local_files_are_ignored(self):
        self.stage('README.md', 'Clean.\n')
        self.commit()
        (self.root / '.env').write_text('LOCAL_ONLY=example')
        self.assertEqual(hygiene.inspect(self.root, staged=True), [])
        self.assertEqual(hygiene.inspect(self.root), [])

    def test_symlink_and_oversized_blob_are_blocked(self):
        (self.root / 'README.md').symlink_to('LICENSE')
        self.git('add', 'README.md')
        self.assertIn(('README.md', 'symlink, submodule or unresolved index entry'),
                      hygiene.inspect(self.root, staged=True))
        self.stage('LICENSE', 'x' * (hygiene.MAX_BLOB_BYTES + 1))
        self.assertIn(('LICENSE', 'oversized committed file'),
                      hygiene.inspect(self.root, staged=True))

    def test_other_branch_history_is_checked(self):
        self.stage('README.md', 'Clean.\n')
        self.commit()
        initial = self.git('rev-parse', 'HEAD').decode().strip()
        self.stage('README.md', 'sk-' + 'ant-' + 'X' * 44)
        self.commit()
        self.git('branch', 'unsafe-fixture')
        self.git('reset', '--hard', initial)
        self.assertIn(('README.md', 'API credential'), hygiene.inspect(self.root))


if __name__ == '__main__':
    unittest.main()
