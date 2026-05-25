---
name: agri-seo-zh
description: 為 agriweather.com.tw 中文版新文章 / 新頁面產生 SEO 三欄資訊：title 建議（含現有 vs. 建議 + 變更理由）、meta description 純值、meta keywords 純值。當使用者要為 AgriWeather（阿龜微氣候）中文版頁面產生 SEO meta 內容時主動使用。
metadata:
  version: "2026.05.25"
---

# AgriWeather 官網 SEO (中文)

## 簡介

為 https://www.agriweather.com.tw/ 中文版單一新頁面 / 新文章產出三欄 SEO：建議 title（含現有 vs. 建議 + 變更理由）、meta description 純值、meta keywords 純值。

## 輸入合約

- **目標 URL**（必填）：完整 URL，如 `https://www.agriweather.com.tw/articles/123`。沒給時主動詢問，不要猜。
- **目標關鍵字**（選填）：1–2 個繁中主關鍵字；未提供則從頁面 H1 / 首段自行整理。

## 抓取頁面

中文版為預設語系，直接 `curl` 即可：

```bash
curl -sSL -A "Mozilla/5.0" "<目標 URL>"
```

環境無 curl 時，改用 WebFetch。

## 解析項目

從 HTML 解析：現有 `<title>`（移除尾巴 ` | AgriWeather – 阿龜微氣候官方網站` 後只取本體）、`<meta name="description">`、首個 `<h1>`、首段內文、navbar 分組（首頁 / 阿龜產品 / 文章共讀）。整合使用者提供或自行整理出的目標關鍵字。

> **品牌尾巴**：全站 `<title>` 尾巴由系統自動補上，建議 title 絕對不寫進尾巴；中英版共用，不翻譯。

## 三欄產出規則

### 建議 title

- 只產出 `[page title]` 本體，不含品牌尾巴
- 本體長度 **28–38 字元**（中文以兩倍寬計；加尾巴後落在 50–60 範圍）
- 主關鍵字前置；H1 對齊；避免堆砌
- 首頁可寫品牌訴求詞，如「阿龜微氣候 | 智慧農業」

### 變更理由

一句話說明為什麼建議改（例：「主關鍵字未前置」「過長被截斷」「缺品牌詞」）。

### Meta description

- 純文字 value，不含 HTML `<meta>` 標籤；每頁唯一，回答「為什麼點進來」
- 長度 **150–160 字元**（中文以兩倍寬計）
- 主關鍵字 + UVP（獨特價值）+ 隱性 CTA
- 不要 OG、Twitter Card、JSON-LD schema

### Meta keywords

- 數量 **3–6 個**，英文半形逗號 `,` 分隔，逗號後不空格
- 組成：主關鍵字 1–2 + 長尾變體 1–2 + 品牌詞 1（固定「阿龜微氣候」）+ 場景詞 1（選用）
- 品牌詞照官方寫法，其他全小寫；同義詞挑一個就好

## 輸出格式

直接條列式分區塊輸出到對話，不寫入任何檔案。範本：

```
## SEO 產出：<URL>

**現有 title：**
<HTML 解析出的本體；已移除品牌尾巴>

**建議 title** (XX 字元)：
<28–38 字元本體>

**變更理由：**
<一句話>

**Meta description** (XXX 字元)：
<150–160 字元純文字 value>

**Meta keywords：**
keyword1,keyword2,keyword3
```

## 語言規範

- 一律繁體中文台灣用語（例：軟件→軟體、視頻→影片、數據→資料）
- 嚴禁簡體字或中國大陸用語
- 品牌詞固定「阿龜微氣候」

## Anti-pattern

- **keywords 失控**：超過 6 個、塞滿同義詞（如「感測器,sensor,傳感器」）、或與頁面內容無關
- **中英混雜**：中文版主力應為繁中詞，僅品牌詞可英文
- **description 夾帶標籤**：含 `<meta>`、OG、Twitter Card、JSON-LD 片段
- **title 失控**：本體超過 38 字元被 SERP 截斷，或本體寫進品牌尾巴被系統重複補上
