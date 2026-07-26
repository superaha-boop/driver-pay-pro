# Driver Pay Pro — Production Release

Release name: Calendar and Reports Stable Milestone

Release date: 2026-07-26

Status: Completed

This milestone is a stable Production release of Calendar UX Freeze Version 1,
Reports UX Freeze Version 1, and Foundation Cleanup Version 1. It is not the
complete Driver Pay Pro V1 release.

## Release Identity

- Release branch: `codex/production-release-20260726`
- Base branch: `origin/codex/foundation-cleanup-20260726`
- Base commit: `1166d571c1b152ef84ebef3dfd61c99c2533a45d`
- Main before merge: `dd7b26cf3d6b411e8efd55d4aecfa10dcbd2c11f`
- Merge base: `c40e2721fdb2ef00293967ec77cd3ccaef74632c`
- Release product commit: `1166d571c1b152ef84ebef3dfd61c99c2533a45d`
- Release Candidate HEAD:
  `37e7fe913af0039c9457de9f1139694e10b82d20`
- Release documentation commits:
  - `9577aa2` — prepare Calendar and Reports Production release
  - `862f2b3` — finalize Release Candidate metadata
  - `37e7fe9` — record Release Candidate validation
- Pull Request:
  `https://github.com/superaha-boop/driver-pay-pro/pull/2`
- Merge method: normal GitHub Pull Request merge
- Main merge commit:
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`
- Main merge time: 2026-07-26 14:51 Asia/Taipei

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
- The Foundation product lineage was 31 commits ahead of main; after the three
  Release documentation commits, the Release Candidate was 34 commits ahead
  and main was one merge commit ahead by graph count.
- Main contains no file content that is absent from the Release branch.
- A normal PR merge was used. Reset, rebase, force push, and history rewrite
  were not used.

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

- Preview URL:
  `https://driver-pay-pro-git-codex-production-relea-1092cf-sky-skill-labs.vercel.app`
- Deployment ID: `dpl_CRgDiahKWBHGFGmMPvrMq6GMQM5f`.
- Deployment commit:
  `862f2b3696c03d1656f67eee8b2f341d3f8844f4`.
- Environment: Preview (`target: null`), not Production.
- Vercel Authentication protects the canonical Preview URL. A temporary
  23-hour share link was verified with a new cookie session; the token is not
  stored in the repository.
- HTTP: Driver Pay Pro, Manifest, Service Worker, showcase, and both Manifest
  icons returned 200 through the verified share session.
- 390px: Today, Calendar, Weekly, Monthly, Platform, and showcase all had
  `scrollWidth === clientWidth === 390`.
- Calendar date selection remained read-only and selected the exact date.
- Console: 0 error and 0 warning across the verified product views.
- Offline: after initial load, an isolated browser reloaded the App Shell with
  network disabled; the active cache was `driver-pay-pro-v12`.
- Test records: none created or modified.

## Production Deployment

- Production URL: `https://driver-pay-app.vercel.app`
- Previous stable deployment ID:
  `dpl_ApoBCEihJtpt2MxB34tjkEkSNTar`
- Previous stable deployment URL:
  `https://driver-pay-609gnt7q1-sky-skill-labs.vercel.app`
- Previous stable deployment commit:
  `dd7b26cf3d6b411e8efd55d4aecfa10dcbd2c11f`
- New deployment ID: `dpl_A3wt3sRW7hNDVHFZrWtSPaHpAjKJ`.
- New deployment URL:
  `https://driver-pay-r2y2ov5z6-sky-skill-labs.vercel.app`
- New deployment commit:
  `dbaafba321fd3b108ef5d3b07e2adea7c1f23892`.
- Deployment environment: Production.
- Deployment status: READY.
- Deployment time: 2026-07-26 14:51:18 Asia/Taipei.
- Stable Production alias: `https://driver-pay-app.vercel.app`.
- L4 Production Human QA: Passed; Product Owner confirmed
  `Production L4 全部通過` on 2026-07-26.

## Production Verification

- Public HTTPS and unauthenticated access: Passed, HTTP 200.
- Today, Calendar, Weekly Reports, Monthly Reports, and Platform Reports:
  Passed.
- Calendar exact-date selection: Passed without creating or modifying records.
- Reports drill-down and return-context contracts: Passed in the 94-test
  regression suite; Production was not populated with test records.
- Responsive: Today, Calendar, and Reports passed at 320, 375, 390, 393, and
  430px with no horizontal overflow.
- Bottom Navigation: Passed; content retained sufficient bottom clearance.
- Manifest and both declared PWA icons: Passed, HTTP 200.
- Service Worker: registered and controlled by `driver-pay-pro-v12`.
- Offline App Shell: Passed in an isolated browser with external DNS blocked.
- Console: 0 error and 0 warning.
- Vercel runtime errors: none found during the release verification window.
- Production resources: no Preview or temporary tunnel origin was loaded.
- localStorage key: remains `driverPayApp.v2`.
- Production data: no test record, initialization, overwrite, or migration.

## L4 Production Human QA

Product Owner completed the single concise L4 Production Human QA on
2026-07-26 and confirmed all items passed:

- unauthenticated iPhone Safari access;
- existing record retention;
- Today, Calendar, and Reports navigation;
- Weekly, Monthly, and Platform report switching;
- exact-date Calendar drill-down;
- installed PWA close and reopen;
- responsive layout, Bottom Navigation, and absence of blocking errors.

Calendar and Reports Stable Milestone is therefore formally Completed. This
does not declare the complete Driver Pay Pro V1 finished.

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
- [x] Release Candidate Preview deployed and passed L2 smoke.
- [x] Release branch pushed.
- [x] Pull Request created with reviewed diff.
- [x] Main merged normally.
- [x] Production deployment matches main merge commit.
- [x] Production automated smoke passed.
- [x] Rollback target re-confirmed after deployment.
- [x] Product Owner completed the single concise L4 Production Human QA.
