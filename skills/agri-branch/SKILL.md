---
name: agri-branch
description: Create and switch to a new Git branch for the current task when branch creation is requested.
metadata:
  author: Lucas Yang
  version: "2026.10.29"
---

# agri-branch

## 流程

1. 用 `git branch --show-current` 確認目前分支；不在 `main` 或 `develop` 就維持原分支並結束。
2. 使用者若提供命名補充資訊，以該資訊為依據；否則先用 `git status --long` 查看工作區變更。若檔案狀態不足以判斷工作內容，再用 `git diff` 查看未暫存的變更、`git diff --cached` 查看已暫存的變更；兩種變更都有時都要查看。
3. 依照這些資訊取簡短、具體的名稱：新功能用 `feat/<branch-name>`，修正問題用 `fix/<branch-name>`，雜項調整用 `chore/<branch-name>`。資訊不足以判斷時先詢問。確定名稱後執行 `git switch -c <名稱>`；指令失敗就回報，不能宣稱已開好分支。若成功建立並切換至目標分支即完成。

## 注意事項

- 只負責開分支；提交、推送與建立 PR 由各自流程處理。
- 團隊 Gitflow：`feat/*`／`fix/*`／`chore/*` → `develop` → `main`（正式發佈）。
