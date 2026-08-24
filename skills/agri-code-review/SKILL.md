---
name: agri-code-review
description: Rapidly review current code changes for obvious logic, direct contract, low-level runtime, and literal security defects in JavaScript/TypeScript, Vue 3, Laravel PHP, or Python. Use whenever the user asks to review a code change, diff, or pull request and needs a fast team-standard review rather than a broad architecture or security audit.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(gh pr view:*), Bash(gh pr diff:*), Bash(gh pr comment:*)
metadata:
  author: Lucas Yang
  version: "2026.08.24"
---

# agri-code-review

## 目標

找出有具體證據的錯誤：明顯的邏輯反轉、型別或資料形狀不符、未處理的非同步流程、錯誤的框架 API 使用、相鄰程式碼間不相容的介面變更，以及可從字面確認的資安漏洞。

這是單次、以 diff 為中心的快速 review。只讀取判斷問題所需的相鄰程式碼、直接呼叫端與直接被呼叫端；不做架構、效能、完整資安稽核、測試覆蓋率、命名、格式或偏好檢查。

## 局部一致性

修改既有模組的小範圍程式碼時，先參考變更位置附近可正常運作的既有寫法。沒有直接正確性、安全性或自動化強制規範影響時，維持這個局部慣例，不把單純較新的團隊寫法差異列為問題。

新增獨立功能或新模組時，採用目前團隊標準。既有寫法不能作為延續可確認錯誤、資安漏洞或違反明確強制規範的理由。

## 範圍

依序執行下列偵測，**第一個有變更的範圍就是唯一範圍**；不得混入後面的範圍。

1. 以 `git diff --cached` 檢查 staged changes。若有變更，只 review staged diff。
2. 沒有 staged changes 時，以 `git status --porcelain` 檢查未提交變更。若有變更，只 review working tree 的 tracked diff 與未追蹤檔案；未追蹤檔案要直接讀取內容。
3. 前兩者皆無時，以 `gh pr view --json number,title,body` 查詢目前分支的關聯 PR。若有 PR，先讀取 PR title 與 body，將 title 的變更主題，以及 body 中明確描述的目標、預期行為與限制當作本次 diff 的檢查上下文，再以 `gh pr diff --patch` review 該 PR 相對目標分支的完整 diff。PR body 空白或沒有可檢查的條件時，只 review 程式碼，不把 body 缺漏列為問題。
4. 三者皆無時，先向使用者詢問要 review 的檔案、比較範圍或 PR；取得範圍前不開始 review。

## 流程

1. 決定唯一範圍後，讀取完整 patch，並只在需要確認問題時讀取變更行周圍的程式碼。
2. 依變更檔案的語言與框架套用對應的[基礎錯誤檢查表](references/basic-checks.md)，並依「局部一致性」判斷既有寫法與目前團隊標準的取捨。
3. 對變更的公開函式、API、元件 props／emits、資料模型、路由或回傳值，追查直接呼叫端與直接被呼叫端，確認名稱、參數、資料形狀、回傳值、成功與失敗流程仍相容。僅追到可確認目前變更影響的直接資料流。
4. 檢查與這條資料流直接相關的空值、空集合、找不到資料、權限拒絕、例外與非同步失敗等邊界；只回報目前程式碼可證明會失常的情況。
5. 檢查目前 patch 中可從字面確認的 SQL injection、command injection、未跳脫的使用者輸入輸出，以及不符合例外規則的硬編碼憑證。
6. 每個發現都要能指出變更造成錯誤的具體路徑。無法由 diff 與必要上下文確認的疑慮不列入結果。
7. 完成一次 diff 掃描與直接資料流檢查後立即輸出結果；不執行完整測試、lint、formatter 或專案級搜尋來擴大 review。

## 輸出

先寫明實際採用的範圍：`staged changes`、`未提交變更`，或 `PR #<number>`。

每個問題各一項，使用以下格式：

```text
- `檔案:行號`：<可確認的錯誤>。會造成 <直接影響>。建議 <最小修正>。
```

若沒有問題，明確寫：`未發現可確認的基本錯誤。` 不把未驗證的疑慮、架構建議或稱讚補進結果。

## PR 留言

僅在本次範圍是 PR 時，完成 review 後以 `gh pr comment <number> --body <review-comment>` 留言。留言不重複 PR 編號，且固定使用下列格式：

```md
## 🤖 Code Review

✅ 未發現可確認的基本錯誤。
```

若有問題，改為：

```md
## 🤖 Code Review

⚠️ 發現 <N> 個可確認問題。

- `檔案:行號`：<可確認的錯誤>。會造成 <直接影響>。建議 <最小修正>。
```

若留言指令失敗，保留 review 結果並明確說明留言未成功；不得宣稱結果已發布。
