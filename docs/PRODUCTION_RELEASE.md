# Driver Pay Pro — Production Release

Release name: Calendar and Reports Stable Milestone

Release date: 2026-07-26

Status: Release Candidate

This milestone is a stable Production release of Calendar UX Freeze Version 1,
Reports UX Freeze Version 1, and Foundation Cleanup Version 1. It is not the
complete Driver Pay Pro V1 release.

## Release Identity

- Release branch: `codex/production-release-20260726`
- Base branch: `origin/codex/foundation-cleanup-20260726`
- Base commit: `1166d571c1b152ef84ebef3dfd61c99c2533a45d`
- Main before merge: `dd7b26cf3d6b411e8efd55d4aecfa10dcbd2c11f`
- Merge base: `c40e2721fdb2ef00293967ec77cd3ccaef74632c`
- Release commit: pending Release Candidate documentation commit
- Pull Request: pending
- Main merge commit: pending

## Included Stable Milestones

- Calendar UX Freeze Version 1:
  `2c8b30fb588e2a262a69b24e82f548a3b253d639`
- Reports 5A Specification:
  `f3cf76320ccc1cea489291aaae0fb97269fafa91`
- Reports 5B1 Weekly and Monthly Core:
  `732929f4980b55eddb913604e0b4024a085c31ad`
- Reports 5B2 Platform, Drill-Down, and Hardening:
  `62b0be08eb5f27d95d2e39f30b5aa9f9ceb52be4`
- Reports UX Freeze Version 1:
  `293c1878d09f95e507311e7ae2b531b7718ac62b`
- Foundation Cleanup Version 1:
  - `14a3937` — lint and static Production validation
  - `0e8a8eb` — Foundation release guard coverage
  - `1166d57` — Foundation handoff

## Ancestry and Divergence Audit

- `origin/main` is not a direct ancestor of the Release branch because main has
  one merge commit not present in the feature lineage.
- The unique main commit is `dd7b26c`, a normal merge commit whose tree is
  byte-identical to the shared ancestor `c40e272`.
- The Release branch is 31 commits ahead and main is one merge commit ahead by
  graph count.
- Main contains no file content that is absent from the Release branch.
- A normal PR merge is required. Reset, rebase, force push, and history rewrite
  are prohibited.

## Completed Scope

- Monday-first Calendar with read, navigation, past-record mutation,
  transactional rollback, accessibility, responsive behavior, and frozen UX.
- Weekly, monthly, and platform Reports with canonical aggregation,
  comparisons, trends, important-date Calendar drill-down, context restoration,
  committed-record refresh, accessibility, responsive behavior, and frozen UX.
- Minimal static-PWA lint, tests, Production validation, and release gate.
- Internal Design System showcase isolated from primary navigation and the PWA
  App Shell.

## Not Completed in This Milestone

- AI formal refactor and implementation.
- TD-006 AI aggregation duplication.
- Complete Driver page functionality.
- Supabase production synchronization.
- Cross-device synchronization and conflict resolution.
- Record metadata.
- Multi-segment work model.
- TypeScript migration.
- Long-term iPhone native-input validation.

## Release Gate

- `npm ci`: Passed.
- `npm audit`: Passed, 0 vulnerabilities.
- ESLint: Passed with 0 errors and 10 pre-existing unused-code warnings.
- All Node tests: Passed, 94/94.
- Calendar targeted tests: Passed, 38/38.
- Reports targeted tests: Passed, 44/44.
- Inline JavaScript syntax: Passed, 1 block.
- Service Worker syntax: Passed.
- Manifest validation: Passed, 2 icons.
- Static Production validation: Passed.
- Build alias: Passed.
- `npm run release:check`: Passed.
- `git diff --check`: Passed.
- Product source hygiene: Passed; no localhost, tunnel, Preview token, test
  fixture, or obvious embedded secret is present in Production sources.

## PWA and Data Safety

- Canonical localStorage key: `driverPayApp.v2`.
- WorkRecord schema: unchanged.
- Service Worker cache: `driver-pay-pro-v12`.
- Manifest and icons: unchanged.
- No Supabase schema or migration.
- No test data is included in this release.
- Release documentation does not change the App Shell, so the cache remains v12.

## Release Candidate Preview

- Preview URL: pending Release branch deployment.
- Deployment ID: pending.
- Branch and commit verification: pending.
- L2 smoke: pending.

## Production Deployment

- Production URL: `https://driver-pay-app.vercel.app`
- Previous stable deployment ID:
  `dpl_ApoBCEihJtpt2MxB34tjkEkSNTar`
- Previous stable deployment URL:
  `https://driver-pay-609gnt7q1-sky-skill-labs.vercel.app`
- Previous stable deployment commit:
  `dd7b26cf3d6b411e8efd55d4aecfa10dcbd2c11f`
- New deployment ID: pending.
- New deployment commit: pending.
- L4 Production Human QA: pending.

## Rollback

Rollback does not modify `driverPayApp.v2` and requires no schema operation.

1. Reassign Production to the previous stable Vercel deployment
   `dpl_ApoBCEihJtpt2MxB34tjkEkSNTar`.
2. If Git history must reflect the rollback, create a normal Git revert commit
   for the release merge.
3. Redeploy the known stable commit only if Vercel alias rollback is
   unavailable.

Do not reset main, force push, rewrite history, clear localStorage, delete user
data, or create a migration for this rollback.

## Release Checklist

- [x] Correct remote Foundation base confirmed.
- [x] Calendar UX Freeze Version 1 confirmed.
- [x] Reports UX Freeze Version 1 confirmed.
- [x] Foundation Cleanup Version 1 confirmed.
- [x] Ancestry and divergence audited.
- [x] Full local Release Gate passed.
- [ ] Release Candidate Preview deployed and passed L2 smoke.
- [ ] Release branch pushed.
- [ ] Pull Request created with reviewed diff.
- [ ] Main merged normally.
- [ ] Production deployment matches main merge commit.
- [ ] Production automated smoke passed.
- [ ] Rollback target re-confirmed after deployment.
- [ ] Product Owner completed the single concise L4 Production Human QA.

