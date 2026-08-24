---
name: agri-pr-fix
description: Fixes actionable findings in the latest Code Review comment on the current pull request. Use when the user asks to address pull request review feedback.
allowed-tools: Bash(*)
metadata:
  author: Lucas Yang
  version: "2026.08.24"
---

# agri-pr-fix

## 流程

1. 以 `gh pr view --json number` 取得目前分支的 PR。取得不到 PR 時，回報沒有可處理的 PR 後結束。
2. 取得 body 以 `## 🐢 Code Review` 開頭的最新留言：

   ```bash
   gh pr view --json comments --jq '[.comments[] | select(.body | startswith("## 🐢 Code Review"))] | sort_by(.createdAt) | last'
   ```

   找不到這類留言，或最新留言沒有提出問題時，回報沒有可修正項目後結束。
3. 逐項閱讀留言指出的位置與必要的直接資料流，以最小修改修正留言描述的影響。
4. 對每個修正執行最貼近已修改契約的既有測試；沒有適用測試時，執行功能 smoke test。
5. 驗證完成後，以 `gh pr comment <PR_NUMBER> --body <fix-comment>` 發布一則修正摘要。

## PR 留言

```md
## 🐢 PR Fixed

✅ 已修正 <N> 個 Code Review 問題。

- `檔案:行號`：<修正內容>。驗證：<實際執行的測試或 smoke test>。
```

每次修復只發布一則摘要，涵蓋本次所有已修正項目。

## 回報

列出本次採用的 Code Review 留言，以及每個已修正項目的位置、修正內容與實際驗證結果。
