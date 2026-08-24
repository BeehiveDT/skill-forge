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
3. 逐項閱讀留言指出的位置與必要的直接資料流，確認問題的直接影響與最小修正方案；此時不修改程式碼。
4. 依序向使用者說明每個項目，並以 `ask` tool 逐項取得確認。每次 `ask` 僅詢問一個項目，簡潔說明其檔案位置、直接影響與最小修正方案，提供「修復」與「略過」選項，並記錄使用者的選擇。完成所有項目的確認後，只修復已選擇「修復」的項目。取得確認前保持程式碼不變。
5. 對每個已確認的修正執行最貼近已修改契約的既有測試；沒有適用測試時，執行功能 smoke test。
6. 驗證完成後，以 `gh pr comment <PR_NUMBER> --body <fix-comment>` 發布一則修正摘要。

## PR 留言

```md
## 🐢 PR Fixed

✅ 已修正 <N> 個 Code Review 問題。

- `檔案:行號`：<修正內容>。驗證：<實際執行的測試或 smoke test>。

## 未修復

- `檔案:行號`：使用者選擇略過。
- `檔案:行號`：使用者選擇略過。原因：<使用者提供的說明>。
```

每次修復只發布一則摘要，涵蓋本次所有已確認且完成修正的項目，以及使用者略過的項目；未提供略過原因時，不得補寫原因。

## 回報

列出本次逐項確認的 Code Review 留言、每個已確認修正項目的位置、修正內容與實際驗證結果；略過項目只列出位置與使用者的略過決定。
