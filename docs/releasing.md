# Release preparation

The current release is **0.2.1**. Keep package metadata, skill metadata, README
badge and changelog aligned with the version being released.

1. Enable local hooks with `npm run setup:hooks`, review the staged diff and run
   the checks in [Contributing](../CONTRIBUTING.md#validation). Run
   `npm run check:repo` against all local branches and tags before pushing.
   Keep credentials, transcripts, local paths and generated archives outside Git.
2. Commit the final source and wait for CI. Build from an isolated export of that
   exact commit, using `python3 scripts/package_skill.py --output dist/percepta-ux-v0.2.1.zip`.
3. Tag the source commit. Preserve published tag identity unless the maintainer
   explicitly authorizes replacing a release.
4. Publish concise feature notes with one uploaded portable ZIP. For an authorized
   update to an existing release, replace that asset and edit its notes.
5. Publish npm through the **Publish to npm** GitHub Actions workflow. It runs
   when a release is published or can be started manually for an existing version
   tag. Configure an npm publishing token as the repository secret `NPM_TOKEN`;
   keep it outside Git. The workflow validates the tagged source and publishes
   with provenance. Token permissions must cover the package, and npm applies
   its own authentication policy. No repository rule requires contributors to
   enable account-level 2FA.
6. Registry versions are immutable: after a version is published, any package
   content change requires a new version. Keep its published Git tag fixed.
7. Verify the source tag, CI, archive integrity, bundled license and installation.
   Compare the uploaded asset digest with the local build. Verify
   `npm view @lrzdeveloper/percepta-ux version` and an installation from the registry.
   Keep working records outside the repository.
8. Check the public skills.sh page after a normal direct skills installation.
   Catalog indexing and page caches can take time to update.

GitHub supplies source-code archives automatically. Separate provenance files,
checksums, duplicate `.skill`/`.zip` uploads and npm tarballs are not release assets.
The npm package provides the installer and bundled guidance. Its install command
uses the matching GitHub version tag through the pinned skills CLI. Keep the npm
package, GitHub tag and portable release archive aligned. GitHub does not expose
saved secret values: a token configured in a different repository must be supplied
again through repository secrets, or replaced by an appropriately scoped token.
For staged versions, npm requires separate approval; a token that bypasses 2FA for
direct publishing does not bypass staged-package approval. Avoid staging when the
intended release process is direct CI publishing.
