# Skill Forge - 阿龜技能鍛造爐

*收集、打磨 AI Skills*

---

這個 Repo 放蜂巢數據科技內部使用的 skills，這裡整理的會是精煉過適合我們習慣或是工作流的 skills。

## 安裝

安裝 Skill Forge 的 skills：

```bash
# 全域安裝 GitHub Copilot 版本的 skills
npx skills@latest add BeehiveDT/skill-forge -g -a github-copilot -s '*'

# 全域安裝 Claude Code 版本的 skills
npx skills@latest add BeehiveDT/skill-forge -g -a claude-code -s '*'

# 專案範圍內安裝全部的 skills
npx skills@latest add BeehiveDT/skill-forge -a github-copilot -s '*'

# 只安裝特定的 skill 到專案範圍內
npx skills@latest add BeehiveDT/skill-forge -a github-copilot -s agri-seo-zh -s agri-seo-en
```

當然也可以選擇性安裝裡面的某些 skills，參考下面的說明。

## Development

這些 skills 是和開發流程相關的。

### agri-commit

自動依照 Conventional Commits 1.0.0 規範建立 Git commit。會根據變更內容來產生符合規範的提交訊息。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-commit
```

使用方式：

```
/agri-commit
/agri-commit 描述變更的原因或上下文
```

### agri-pr

建立一個合併到 `develop` 分支的 Pull Request。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-pr
```

使用方式：

```
/agri-pr
```

### agri-pr-fix

修復 PR 中尚未 resolved 的 review comments，並將已修復的 threads 標記為 resolved。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-pr-fix
```

使用方式：

```
/agri-pr-fix
```

## SEO

這些 skills 是和 SEO 內容產出相關的。

### agri-seo-zh

為 agriweather.com.tw 中文版新頁面 / 新文章產出 SEO meta 內容：建議 title（含現有 vs. 建議 + 變更理由）、meta description、meta keywords。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-seo-zh
```

使用方式：

```
/agri-seo-zh https://www.agriweather.com.tw/
/agri-seo-zh https://www.agriweather.com.tw/about
/agri-seo-zh https://www.agriweather.com.tw/articles/123
```

### agri-seo-en

為 agriweather.com.tw 英文版新頁面 / 新文章產出 SEO meta 內容：建議 title（含現有 vs. 建議 + 變更理由）、meta description、meta keywords。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-seo-en
```

使用方式：

```
/agri-seo-en https://www.agriweather.com.tw/
/agri-seo-en https://www.agriweather.com.tw/about
/agri-seo-en https://www.agriweather.com.tw/articles/123
```

## License

[MIT LICENSE](LICENSE)
