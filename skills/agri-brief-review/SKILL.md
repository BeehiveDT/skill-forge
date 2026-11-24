---
name: agri-brief-review
description: Review product briefs in docs/brief/ for direction-changing flaws and check implementation for conflicts with product intent.
disable-model-invocation: true
metadata:
  author: Lucas Yang
  version: "2026.11.24"
---

# Product Brief Review

檢查 product brief 是否足以引導開發，並對照現有實作是否偏離產品意圖。只審查與建議；修改 brief 或程式碼需使用者明確要求。

1. 讀取 `docs/brief/` 下的所有 brief，釐清目標、使用者、預期成果與明確限制。
2. 檢查 brief 的重大矛盾、會導致不同產品方向的歧義，以及無法判斷目標是否達成的關鍵缺漏。保留人話寫作；技術選型、實作細節與尚未決定的開放事項交由後續規格流程處理。
3. 逐項對照目標與限制，查閱相關實作。以產品意圖為準：範例、草圖與靈感不是逐字驗收清單；只有違背或限縮目標才算衝突。尚未實作不等於衝突，但宣稱完成卻缺少必要成果時應指出。超出本專案靜態檢查範圍的項目（如外部系統、執行期或營運成效）直接略過；若歸屬不明且本專案找不到實作，歸入待釐清事項。
4. 只回報影響產品方向或目標達成的問題。每項附上 brief 原文與位置、影響及具體建議；實作衝突另附程式碼位置與證據。輸出僅含「已確認衝突」與「待釐清事項」兩類（沒有重大問題就直說），結尾以一句話說明本次審查範圍。
