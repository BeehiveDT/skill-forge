---
name: agri-seo-en
description: Generate SEO content for agriweather.com.tw English pages — a title suggestion (current vs. suggested + reason), a plain-text meta description, and plain-text meta keywords. Trigger proactively when the user needs SEO meta content for an AgriWeather English page.
metadata:
  version: "2026.05.25"
---

# AgriWeather Website SEO (English)

## Overview

For a single new English page / article on https://www.agriweather.com.tw/, produce three SEO columns: suggested title (with current vs. suggested + reason), plain-text meta description, plain-text meta keywords.

## Input contract

- **Target URL** (required): full URL of the English page. If missing, ask before proceeding.
- **Target keywords** (optional): 1–2 keywords; otherwise inferred from on-page H1 / first paragraph.

## Fetch the page

The site returns the English version when the request carries an English `Accept-Language` header — no cookie, no locale-switch round trip:

```bash
curl -sSL -A "Mozilla/5.0" -H "Accept-Language: en-US,en;q=0.9" "<TARGET_URL>"
```

Verify the response is English by checking `<title>` contains English text (e.g. `About AgriWeather`). If curl is unavailable, fall back to WebFetch.

## Parse

From the fetched HTML extract: existing `<title>` (strip the suffix ` | AgriWeather – 阿龜微氣候官方網站`, keep body only), existing `<meta name="description">`, the `<h1>`, the first paragraph, navbar grouping (Home / Products / Articles / etc.), and target keywords inferred from on-page copy.

> **Brand suffix**: the site-wide `<title>` suffix is auto-appended by the CMS. Never write the suffix inside the suggested title body. Shared with the Chinese version, NOT translated.

## Generation rules

### Suggested title

- Body only, excluding the auto-appended brand suffix
- Body length **28–38 characters** (counted directly in Latin script)
- Primary keyword front-loaded; aligned with H1; one unique title per page
- Home page may use a brand value phrase, e.g. `AgriWeather | Smart Agriculture`

### Reason

One sentence explaining the change (e.g. "Primary keyword was not front-loaded", "Original exceeded SERP pixel width", "Missing brand value").

### Meta description

- Plain-text value, no `<meta>` wrapper; one unique description per page, answers "why click?"
- Length **150–160 characters** (counted directly in Latin script)
- Primary keyword + UVP (unique value) + implicit CTA
- Exclude OG, Twitter Card, JSON-LD schema

### Meta keywords

- **3–6 items**, comma-separated, no space after the comma
- Compose: 1–2 primary + 1–2 long-tail + brand `AgriWeather` + optional scenario term
- Lowercase except the brand term `AgriWeather`; pick one synonym, no stuffing

## Output format

Return directly in the conversation using this layout:

```
## SEO Output: <URL>

**Current title:**
<page title body, brand suffix removed>

**Suggested title** (XX chars):
<suggested body>

**Reason:**
<one sentence>

**Meta description** (XXX chars):
<plain-text value>

**Meta keywords:**
keyword1,keyword2,keyword3
```

## Language

Output strictly in English. Brand term is `AgriWeather` (do not use `阿龜微氣候` in English output).

## Anti-patterns

- **Keyword stuffing**: more than 6 keywords, redundant synonyms (`sensor,sensors,detector`), or off-topic terms
- **Mixed languages**: Chinese terms mixed into English keywords (brand term `AgriWeather` is the only exception)
- **Description with tags**: includes `<meta>`, OG, Twitter Card, or JSON-LD fragments
- **Title overflow**: body exceeds 38 chars and gets truncated in SERP, or body includes the brand suffix and gets duplicated
