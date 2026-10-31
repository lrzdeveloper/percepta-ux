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
5. Verify the source tag, CI, archive integrity, bundled license and installation.
   Compare the uploaded asset digest with the local build. Keep working records
   outside the repository.

GitHub supplies source-code archives automatically. Separate provenance files,
checksums, duplicate `.skill`/`.zip` uploads and npm tarballs are not release assets.
The installer downloads Git source and selects its matching version tag; the npm
package is not published to a registry.
