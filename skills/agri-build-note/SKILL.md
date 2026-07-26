---
name: agri-build-note
description: Draft GitHub release notes from commits since the latest tag. Use whenever the user asks to draft, generate, or create GitHub release notes, release notes／產生發布說明, mentions changelog／變更日誌, or prepare a release／準備發布. Use this even when the user only hints at cutting a release or summarizing "what changed since the last version," not just when they say "release notes" verbatim.
allowed-tools: Bash(git log:*) Bash(git tag:*) Bash(git describe:*) Bash(git show:*) Bash(git diff:*) Bash(git rev-list:*) Bash(git rev-parse:*) Bash(git merge-base:*) Read
---

## Gather the release range

1. Find the base tag:
   - Run `git describe --tags --abbrev=0` to get the nearest tag reachable from HEAD. Use it as the base if it succeeds.
   - If that fails, run `git tag --sort=-v:refname` and take its first entry as a *candidate* base. This is a repo-wide, version-sorted pick, so it may be unreachable or from another branch — before trusting it, verify it is an ancestor of HEAD with `git merge-base --is-ancestor <candidate> HEAD`. If the candidate is an ancestor, use it as the base. If it is not an ancestor (or version sort is unreliable, e.g. non-semver or prefixed tags), do not use it — fall through to complete history.
   - If no usable base tag is found, use the complete history.
2. Check the range is non-empty **before** curating:
   - With a base tag, run `git rev-list --count --no-merges <base>..HEAD`. Without one, run `git rev-list --count --no-merges HEAD`.
   - If the count is `0` (e.g. HEAD is exactly at the latest tag), there is nothing to release. Stop and follow the empty-range rule in the Output section — do not fabricate entries.
3. List the commits:
   - With a base tag: `git log <base>..HEAD --no-merges --pretty=format:"%h %s"`.
   - Without one: `git log --no-merges --pretty=format:"%h %s"`.
4. Read details only when needed. When a subject is ambiguous or insufficient to establish user impact, inspect the change — but start with `git show --stat <commit>` (or `git diff --stat`) and only read the full diff for the specific files needed to judge user impact. Do not infer a user-visible change from an internal-looking subject alone.
5. Recover PR references if required. `--no-merges` drops merge commits, so in a merge-commit workflow the PR title/number may live on the merge commit. Only when the project records PR numbers (see step 6) and the non-merge subjects lack them, additionally run `git log <base>..HEAD --merges --pretty=format:"%h %s"` to recover PR references. Still describe outcomes, never the merges themselves.
6. If `CHANGELOG.md` exists, read it only to match its language, terminology, tone, and PR-number convention. Do not create or modify it.

## Curate changes

Include every user-visible commit. Combine duplicate or related commits into one user-facing outcome. Exclude internal noise such as CI, test-only, build, tooling, formatting, and maintenance changes when they have no user-visible impact.

Classify each outcome using [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), in this order:

1. `Added` - new user-facing capability.
2. `Changed` - changed behavior of an existing capability.
3. `Deprecated` - capability marked for future removal.
4. `Removed` - removed capability.
5. `Fixed` - repaired incorrect behavior.
6. `Security` - security repair.

If an outcome could fit more than one category, place it in the earliest matching category in the list order above.

Place a breaking change in its most relevant category, prefixing its bullet exactly with `**Breaking:**`; never add a separate breaking category.

**All-internal fallback.** If (and only if) the range contains commits but *none* are user-visible, do not return an empty note. Instead, summarize the most significant internal changes under `Changed`. This is the sole exception to the "every bullet is user-facing" rule. "Significant" means changes a maintainer would want recorded — notable refactors, dependency upgrades with behavioral or security relevance, or infrastructure changes that affect how the project is built or run — and excludes pure formatting, lint, and CI noise.

Curation is complete only when every included user-visible commit is categorized, related commits are consolidated, and internal-only changes have been excluded (or, under the fallback, the significant internal changes are grouped under `Changed`).

## Output

**Empty range.** If step 2 found zero commits in the range, do not emit a code block. Return a single plain-text line and nothing else: `No releasable changes since <base>.` (use the actual base tag; if there was no base tag, write `No releasable changes found.`).

**Normal case.** Return exactly one fenced Markdown code block and nothing else: no preface, conclusion, version heading, or date. Include only non-empty headings, in the order shown below.

The block below is a *layout reference* that lists all six possible headings and English placeholder bullets. In real output, replace the placeholders with actual entries, drop every empty heading, and write bullets in the resolved output language (see Writing rules).

```markdown
### Added

- One user-facing change

### Changed

- One user-facing change

### Deprecated

- One user-facing change

### Removed

- One user-facing change

### Fixed

- One user-facing change

### Security

- One user-facing change
```

## Writing rules

- Each bullet is one line, user-facing, and describes the impact — not the implementation. (The only exception is the all-internal fallback above.)
- Do not include commit hashes or author names. PR numbers are fine if the existing CHANGELOG.md already uses them.
- Merge duplicate or related commits into a single bullet.
- Skip purely internal noise (lint config tweaks, CI-only changes, formatting passes, dependency bumps without user impact) unless that's all that exists — then apply the all-internal fallback and group the significant ones under `Changed`.

### Output language

Resolve the bullet-description language in this order:

1. If the user explicitly requests an output language, use it.
2. Otherwise, if `CHANGELOG.md` exists, match its language.
3. Otherwise, default to English.

Regardless of the resolved language, the six type headings (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`) and the `**Breaking:**` marker are ALWAYS in English — even when the user explicitly asks to translate the notes into another language. Only the bullet descriptions are translated; these fixed labels never are.

- Omit empty change types entirely.
