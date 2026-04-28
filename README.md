# Skill Forge - 阿龜技能鍛造爐

*收集、打磨 AI Skills*

---

這個 Repo 放蜂巢數據科技內部使用的 Skills，這裡整理的會是精煉過適合我們習慣或是工作流的 Skills。

## 安裝

安裝 Skill Forge 的 Skills：

```bash
# 全域安裝 GitHub Copilot 版本的 Skills
npx skills@latest add BeehiveDT/skill-forge -g -a github-copilot -s '*'

# 全域安裝 Claude Code 版本的 Skills
npx skills@latest add BeehiveDT/skill-forge -g -a claude-code -s '*'

# 專案範圍內安裝全部的 Skills
npx skills@latest add BeehiveDT/skill-forge -a github-copilot -s '*'

# 只安裝特定的 Skill 到專案範圍內
npx skills@latest add BeehiveDT/skill-forge -a github-copilot -s agri-commit -s agri-other-skill
```

當然也可以選擇性安裝裡面的某些 Skills，參考下面的說明。

## Development

這些 Skills 是和開發流程相關的。

### agri-commit

自動依照 Conventional Commits 1.0.0 規範建立 Git commit。會根據變更內容來產生符合規範的提交訊息。

```bash
npx skills@latest add BeehiveDT/skill-forge -s agri-commit
```

## License

[MIT LICENSE](LICENSE)
