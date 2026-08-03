---
name: agri-build-note
description: Summarize what changed between the previous version bump and the current one. Use whenever the user bumps an internal version and wants the diff since the last bump — 列出自上次 bump 以來的變更, produce an internal changelog delta, or 比較這次改版與前一次改版的差異. Use this even when the user only says they "bumped the version" and wants to know what changed since last time, not just when they say "release notes."
metadata:
  author: Tuvix Shih
  version: "2026.08.03"
---

## How this skill anchors

This skill compares the **previous version bump** with the **current one**. The anchor is the commit where the project's version string last changed — not a git tag and not a public release.

**Precondition:** run this after the version file already holds the new (current) version. The bump may be committed or still uncommitted in the working tree; the working-tree value is treated as the current version. If you run it _before_ editing the version, the anchor will be off by one bump.

## Locate the version anchor

1. Identify the version file (source of truth). If the user names one, use it. Otherwise check, in order, for the first that exists:
   - `config/version.yaml` or `config/version.yml` — a `ninthday/version` (Laravel) version file. **This is the expected default for this project.**
   - `pyproject.toml` → `[project].version` or `[tool.poetry].version`
   - `package.json` → `.version`
   - `Cargo.toml` → `[package].version`
   - `VERSION` or `version.txt` → the whole-file string
     Note: a Laravel project's `composer.json` usually has **no** `version` field — do not rely on it. If none of the above is found, or two disagree, stop and ask which file holds the version.
2. Read the current version from the **working tree** with the Read tool (so an uncommitted bump still counts) and derive the semantic version `V_current`:
   - For a `ninthday/version` file, assemble it **only** from the `current` block: `V_current = "{label}{major}.{minor}.{patch}"`, where `label` is optional (e.g. `label: v` → `v1.3.3`; no label → `1.3.3`). **Ignore every other field** — `build.number`, `build.git-local`, `cache`, `format`, etc. change on ordinary builds and must never be treated as a version change.
   - For the other file types, parse their single version field.
3. Find the anchor commit `A` — the most recent commit whose version differs from `V_current`:
   - List commits that touched the version file, newest first: `git log --format=%H -- <file>`.
   - Walk them newest → oldest. For each commit `C`, read its version with `git show C:<file>` and derive its semantic version using the **same rule as step 2** (for `ninthday/version`, assemble `{label}{major}.{minor}.{patch}` from `current` and ignore all other fields). The first `C` whose derived version != `V_current` is the anchor `A`. (Commits that touched the file but left `current.major/minor/patch` unchanged — e.g. a `build.number` refresh or a dependency edit — are skipped automatically, because their derived version still equals `V_current`. In most repos `A` is only one or two commits back.)
   - If no such commit exists (the version has never differed, or the file has no prior history), there is no previous bump: use the complete history as the range and note this is the first recorded bump.
4. Confirm the range is non-empty: `git rev-list --count --no-merges <A>..HEAD` (without an anchor: `git rev-list --count --no-merges HEAD`). If it is `0`, stop and report that nothing changed since the previous bump — do not fabricate entries.
5. List the commits in range:
   - With an anchor: `git log <A>..HEAD --no-merges --pretty=format:"%h %s"`.
   - Without one: `git log --no-merges --pretty=format:"%h %s"`.
6. Read details only when a subject is ambiguous. Start with `git show --stat <commit>` or `git diff --stat`, and read the full diff only for the specific files needed to judge the change.

## Curate changes

This is an **internal** bump-to-bump diff, not a public release note, so **keep internal changes** — refactors, tooling, dependency, and infrastructure work are usually exactly what the reviewer wants to see. Drop only genuinely trivial churn (whitespace/formatting-only commits, lockfile-only noise) unless the user asks to keep even those.

Combine duplicate or related commits into a single outcome. Classify each outcome using [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), in this order:

1. `Added` - new capability, module, or endpoint.
2. `Changed` - changed behavior of something that already existed.
3. `Deprecated` - marked for future removal.
4. `Removed` - removed capability.
5. `Fixed` - repaired incorrect behavior.
6. `Security` - security repair.
7. `Internal` - refactors, tooling, dependencies, CI, and other changes with no outward behavior change. This category is specific to this internal-diff use and is **not** part of Keep a Changelog; omit it when empty.

If an outcome could fit more than one category, place it in the earliest matching category above (`Internal` is always the last resort).

Mark a breaking change by prefixing its bullet exactly with `**Breaking:**` inside its most relevant category; never add a separate breaking category.

## Output

**Empty range.** If the range has zero commits, do not emit a code block. Return a single plain-text line and nothing else: `No changes since the previous bump (<V_current>).`

**Normal case.** Return exactly one fenced Markdown code block and nothing else — no preface or conclusion. Begin with a single version-delta heading, then only the non-empty category headings in the order above.

The block below is a _layout reference_ listing possible headings with English placeholders. In real output, fill in real entries, drop every empty heading, and write bullets in the resolved output language (see Writing rules).

```markdown
## <V_previous> → <V_current>

### Added

- One change

### Changed

- One change

### Fixed

- One change

### Internal

- One change
```

`<V_current>` is the working-tree version; `<V_previous>` is the version value at anchor `A`. If there was no anchor (first recorded bump), use `initial → <V_current>` as the heading.

## Writing rules

- Each bullet is one line and describes the change and its effect — not line-level implementation detail.
- Do not include commit hashes or author names. PR numbers are fine if the project's existing changelog already uses them.
- Merge duplicate or related commits into a single bullet.
- Keep meaningful internal changes (see Curate); drop only trivial churn.

### Output language

Resolve the bullet-description language in this order:

1. The language the user explicitly requests.
2. Otherwise, the language of an existing `CHANGELOG.md` if present.
3. Otherwise, English.

The category headings (`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`, `Internal`) and the `**Breaking:**` marker are ALWAYS in English, even when the bullets are translated. Only the bullet descriptions and the version values in the delta heading follow the resolved language.
