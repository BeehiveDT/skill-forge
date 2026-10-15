---
name: agri-branch
description: Creates a task branch when asked to open a branch from main or develop; keeps the current branch when already on another branch.
metadata:
  author: Lucas Yang
  version: "2026.10.15"
---

# agri-branch

1. 用 `git branch --show-current` 確認目前分支；不在 `main` 或 `develop` 就維持原分支並結束。
2. 依工作內容取簡短、具體的分支名稱：新功能用 `feat/<branch-name>`，修正問題用 `fix/<branch-name>`，雜項調整用 `chore/<branch-name>`。使用者指定名稱就沿用；無法判斷時先詢問。
3. 用 `git branch --show-current` 確認已切換到新分支，回報分支名稱即可。

只負責開分支；提交、推送與建立 PR 由各自流程處理。

團隊 Gitflow 為 `feat/*`／`fix/*`／`chore/*` → `develop` → `main`（正式發佈）。
