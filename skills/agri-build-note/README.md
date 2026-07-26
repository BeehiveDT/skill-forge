# agri-build-note

一個從 **上一個 git tag 到 HEAD** 的 commit 自動產生 GitHub release notes 的 Claude Code Skill，輸出遵循 [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) 格式。

> 這份 README 是給人看的說明文件，Skill 執行時不會載入它；實際規則以同資料夾的 `SKILL.md` 為準。

---

## 這個 Skill 做什麼

- 找出自上一個版本 tag 以來的所有 commit。
- 過濾掉純內部雜訊（CI、測試、格式化、無使用者影響的依賴升級等）。
- 把有使用者影響的變更歸類為 `Added / Changed / Deprecated / Removed / Fixed / Security`。
- 產出一段可直接貼到 GitHub Release 的 Markdown。

## 這個 Skill 不做什麼

- **不看版本字串檔**：它完全不讀 `package.json`、`pyproject.toml`、`VERSION` 裡的版本號。它的唯一錨點是 **git tag**。
- 不會建立或修改 `CHANGELOG.md`（只會讀取以對齊語言與慣例）。
- 不會自己打 tag、不會建立 GitHub Release，這些由你手動執行。

---

### 前置需求

- 一個有 commit 歷史的 git repo。
- 已經打了至少一個版本 tag（第一次發布除外，見下方邊界情況）。
- 本 Skill 的 `allowed-tools` 只在 **Claude Code CLI** 生效；透過 SDK 使用時此欄位會被忽略（見文末說明）。

---

## 觸發方式

在對話中，用類似說法即可觸發：

- 「幫我產生這個版本的 release notes」
- 「產生發布說明」／「準備發布 v1.3.0」
- 「整理自上個版本以來的變更日誌」

---

## 核心流程（最重要：先產 notes，再打 tag）

Skill 的範圍是 `上一個 tag..HEAD`。tag 標記的是 **上一版的結束點**，不是這一版。因此順序不能反：

1. 確認這一版要進的 commit 都已經在發布分支上。
2. **先跑 Skill** 產生 release notes（此時 HEAD 還領先上一個 tag，範圍才有內容）。
3. 檢視／微調 notes，需要的話寫進 `CHANGELOG.md` 並 commit。
4. **才打新版 tag**。
5. 推送 commit 與 tag，並在 GitHub 上用該 tag 建立 Release。

對應指令：

```bash
# 1~2. 用 Skill 產生 notes，確認內容

# 3.（可選）把 notes 加上版本標題與日期寫進 CHANGELOG.md 後 commit
git add CHANGELOG.md
git commit -m "docs: update changelog for 1.3.0"

# 4. 打 annotated tag
git tag -a v1.3.0 -m "Release 1.3.0"

# 5. 一起推送 commit 與 tag
git push --follow-tags

# 6. 從 v1.3.0 在 GitHub 建立 Release，貼上 notes
```

> ⚠️ 若你反過來先打 `v1.3.0` 再跑 Skill，範圍 `v1.3.0..HEAD` 會變成空的，Skill 會回傳 `No releasable changes since v1.3.0.`。

---

## 打 tag 的建議做法

- **用 annotated tag（`git tag -a`）**，不要用 lightweight tag。annotated 帶有 tagger、日期與訊息、可簽章，是釋出慣例。
- **命名一律一致**，統一用 `vX.Y.Z`（semver 加 `v` 前綴）。命名一致時，Skill 主路徑 `git describe --tags --abbrev=0` 幾乎都能正確抓到最近 tag，不會走到脆弱的 fallback。
- **只在實際發布時打 tag**；純內部、未對外的版本 bump 不需要 tag。
- 用 `git push --follow-tags` 一次推 commit 與 annotated tag，避免忘記推 tag。

---

## 輸出格式

- 只輸出一段 fenced Markdown code block，沒有前言、結語、版本標題或日期。
- 只包含 **非空** 的分類標題，順序固定為 `Added → Changed → Deprecated → Removed → Fixed → Security`。
- breaking change 放進最相關的分類，bullet 前綴 `**Breaking:**`，不另開分類。

範例：

```markdown
### Added

- 匯出報表新增 CSV 格式

### Fixed

- 修正登入頁在 Safari 無法送出的問題
```

### 語言規則

bullet 描述的語言依以下優先序決定：

1. 使用者明確指定的語言。
2. 否則，比照現有 `CHANGELOG.md` 的語言。
3. 否則，預設英文。

**無論哪種語言，六個分類標題與 `**Breaking:**` 標記永遠保持英文**，即使你要求把 notes 翻成其他語言也一樣；只有 bullet 描述會被翻譯。

---

## 邊界情況與注意事項

| 情況                                                    | Skill 的行為 / 你該注意的                                                                                                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **順序反了**（先 tag 再跑）                             | 範圍為空，回傳 `No releasable changes since <tag>.`。請務必先產 notes 再打 tag。                                                                                                      |
| **HEAD 正好停在最新 tag**（零新 commit）                | 回傳 `No releasable changes since <tag>.`，不會硬湊內容。                                                                                                                             |
| **第一次發布 / 完全沒有 tag**                           | 以完整歷史為範圍產生 notes。                                                                                                                                                          |
| **全部都是內部變更**                                    | 不會回傳空白，改為把最重要的內部變更（重要重構、有安全或行為影響的依賴升級、影響建置或執行的基礎設施變更）歸到 `Changed`；純格式化／lint／CI 仍會被排除。                             |
| **pre-release tag**（如 `v1.3.0-rc.1`）                 | `git describe` 抓的是「HEAD 可達的最近 tag」，所以之後做 `v1.3.0` 時會以 `rc.1` 為起點而非上一穩定版。若不希望 rc 當邊界，別把 rc tag 打在發布主線上，或跑 Skill 時手動指定起始 tag。 |
| **tag 命名不一致**（混用 `v1.0`、`release-1.0`、`1.0`） | 主路徑可能失敗而走 fallback，其版本排序對非 semver／帶前綴 tag 不可靠。統一命名是最好的預防。                                                                                         |
| **merge-commit 工作流的 PR 編號**                       | Skill 預設 `--no-merges`，PR 標題／編號可能在 merge commit 上。只有當專案在 `CHANGELOG.md` 使用 PR 編號、而一般 commit 主旨沒有時，它才會回查 merge commit 補上 PR 參照。             |
| **大型 diff**                                           | 判斷使用者影響時會先看 `--stat`，必要時才讀特定檔案的完整 diff，避免灌爆 context。                                                                                                    |

---

## 關於 `allowed-tools`

Skill 的 `allowed-tools` 限定為一組唯讀 git 指令加 `Read`。兩點提醒：

- 它是 **預先核准（pre-approval）**，不是硬性沙箱。若要真正把它鎖死在唯讀操作，需再搭配專案的 permission **deny** 規則。
- 此欄位只在 **Claude Code CLI** 生效；透過 Agent SDK 使用 Skill 時會被忽略，需改用主設定的 `allowedTools` 控管。

---

## 關於名稱

`name` 目前是 `agri-build-note`。Skill 本身是通用的 release note 產生器，與農業無關。若要改成更貼切的名稱（例如 `release-notes`），記得 **資料夾名與 `name` 一併修改**，並注意這會改變它在 skill 清單中的顯示與叫用方式。
