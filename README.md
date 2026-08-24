# Skill Forge - 阿龜技能鍛造爐

*收集、打磨 AI Skills*

---

這個 Repo 放蜂巢數據科技內部使用的 skills，這裡整理的會是精煉過適合我們習慣或是工作流的 skills。

## 安裝

安裝 Skill Forge 的 skills：

```bash
# 全域安裝 Claude Code 和 Codex 版本的 skills
npx -y skills@latest add BeehiveDT/skill-forge -g -a claude-code -a codex -s '*'

# 同步更新 Antigravity 版本的 skills
# WIndows 上需要在執行完 skills CLI 後就執行一次
# (因為目前 skills CLI 還不支援 Antigravity 全域安裝)
rm -rf ~/.gemini/skills
ln -sfn ../.agents/skills ~/.gemini/skills
```

當然也可以選擇性安裝裡面的某些 skills。

---

## Skills

| Name | Description |
|------|-------------|
| [agri-build-note](./skills/agri-build-note/SKILL.md) | 列出內部版本 bump 後與上次的差異，產出內部 changelog |
| [agri-code-review](./skills/agri-code-review/SKILL.md) | 快速檢查程式碼變更，找出可確認的問題 |
| [agri-commit](./skills/agri-commit/SKILL.md) | 依照 Conventional Commits 1.0.0 規範建立 Git commit |
| [agri-pr](./skills/agri-pr/SKILL.md) | 建立一個合併到 `develop` 分支的 Pull Request |
| [agri-pr-fix](./skills/agri-pr-fix/SKILL.md) | 修復 PR 中尚未 resolved 的 review comments |
| [agri-seo-en](./skills/agri-seo-en/SKILL.md) | 為 agriweather.com.tw 英文版頁面產出 SEO meta 內容 |
| [agri-seo-zh](./skills/agri-seo-zh/SKILL.md) | 為 agriweather.com.tw 中文版頁面產出 SEO meta 內容 |

---

## License

[MIT LICENSE](LICENSE)
