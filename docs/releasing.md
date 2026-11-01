# Release preparation

The current release is **0.2.0**. Keep package metadata, skill metadata, README
badge and changelog aligned with the version being released.

1. Enable local hooks with `npm run setup:hooks`, review the staged diff and run
   the checks in [Contributing](../CONTRIBUTING.md#validation). Run
   `npm run check:repo` against all local branches and tags before pushing.
   Keep credentials, transcripts, local paths and generated archives outside Git.
2. Commit the final source and wait for CI. Build from an isolated export of that
   exact commit, using `python3 scripts/package_skill.py --output dist/percepta-ux-v0.2.0.zip`.
3. Tag the source commit. Preserve published tag identity unless the maintainer
   explicitly authorizes replacing a release.
4. Publish concise feature notes with one uploaded portable ZIP. For an authorized
   update to an existing release, replace that asset and edit its notes.
5. Publish the npm package from the tested tag with `npm publish --access public`.
   Use the signed-in maintainer account and complete npm's authentication check.
   Registry versions are immutable: after `0.2.0` is published, any package content
   change requires a new version. Do not move a tag used by a published npm version.
6. Verify the source tag, CI, archive integrity, bundled license and installation.
   Compare the uploaded asset digest with the local build. Verify
   `npm view @lrzdeveloper/percepta-ux version` and an installation from the registry.
   Keep working records outside the repository.
7. Check the public skills.sh page after a normal direct skills installation.
   Catalog indexing and page caches can take time to update.

GitHub supplies source-code archives automatically. Separate provenance files,
checksums, duplicate `.skill`/`.zip` uploads and npm tarballs are not release assets.
The npm package provides the installer and bundled guidance. Its install command
uses the matching GitHub version tag through the pinned skills CLI. Keep the npm
package, GitHub tag and portable release archive aligned. A first publication uses
maintainer authentication; optional future CI publishing should use npm trusted
publishing with a workflow scoped to this repository, without storing tokens in Git.
