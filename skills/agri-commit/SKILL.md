---
name: agri-commit
description: Stage files with git add and create a Git commit following Conventional Commits 1.0.0. Use this skill whenever the user asks to commit, make a commit, git commit, save changes to git, or commit their work, even if they don't mention "conventional commits" explicitly.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
metadata:
  author: Lucas Yang
  version: "2026.09.30"
---

# agri-commit

## 流程

1. 執行 `git status --long`，以完整輸出確認哪些檔案已暫存 (staged)、尚未暫存 (unstaged) 或未受追蹤 (untracked)。
2. **如果同時有已暫存與未暫存的變更**，只提交已暫存的內容，保留未暫存的變更。簡短告知使用者哪些變更未納入這次提交。
3. 如果沒有已暫存的內容，自動執行 `git add -A`。
4. 閱讀 `git diff --cached`，了解即將提交的變更，再依 Conventional Commits 1.0.0 撰寫提交訊息。
5. 使用 heredoc 提交，以保留多行訊息的格式；完成後提供提交的 hash。

## 注意事項

- 直接執行 Git 指令，不要透過 Eval、腳本或其他間接方式呼叫。
- 如果沒有任何內容可提交，告知使用者後停止。
- 如果變更涉及不相關的事項，建議拆成不同提交；如果使用者希望合併成一筆，就依主要目的選擇 `type`。
- **語言**：`type` 與選填的 `scope` 使用小寫英文（例如 feat、fix、chore、refactor、docs）；標題與內文使用台灣慣用的繁體中文。例如：`feat(auth): 加入 Google 登入支援`
- **除非確實需要，否則省略內文。** 優先使用單行標題；只有無法從差異與標題看出原因或背景時，才加入內文。
