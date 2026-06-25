---
name: agri-pr
description: Creates a GitHub Pull Request targeting the develop branch, following the team's Gitflow where develop is the integration branch and main is reserved for production releases. Use when user asks to create a PR, open a pull request, or submit changes for review.
allowed-tools: Bash(git status:*), Bash(git push:*), Bash(git log:*), Bash(gh pr create:*), Bash(gh pr view:*)
metadata:
  author: Lucas Yang
  version: "2026.06.25"
---

# agri-pr

## 工作流程

1. 確認目前所在分支（不可在 `main` 或 `develop` 上直接建立 PR）
2. 確認遠端有推送最新 commit（若未推送，先執行 `git push`）
3. 使用 `gh pr create` 建立 PR，目標分支預設為 `develop`
4. 讓 AI 根據 commit 紀錄自行生成 PR 標題
5. PR body 使用以下範本

## PR Body 範本

```markdown
## 變更摘要
<!-- 簡短說明這個 PR 的變更內容 -->

```

## 指令

```bash
# 推送當前分支（若尚未推送）
git push -u origin HEAD

# 建立 PR
gh pr create \
  --base develop \
  --title "<根據 commit 訊息與變更內容生成>" \
  --body "## 變更摘要\n<!-- 簡短說明這個 PR 的變更內容 -->"
```

## 注意事項

- 團隊 Gitflow：`feature/*` / `fix/*` → `develop` → `main`（僅正式發佈用）
- PR 標題根據 commit 訊息與變更內容生成，不需使用者手動輸入
- 若 `develop` 分支不存在，先詢問使用者確認目標分支
