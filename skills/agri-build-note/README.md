# agri-build-note

一個比較 **上一次版本 bump 到這一次 bump** 之間所有變更的 Claude Code Skill，輸出為 Keep a Changelog 風格的 Markdown 摘要。

適用於在 Laravel 專案中使用 [`ninthday/yaml`](https://packagist.org/packages/ninthday/yaml) 管理版本（`config/version.yaml`）的情境，也支援其他常見版本檔格式。

> 這份 README 是給人看的說明文件，Skill 執行時不會載入它；實際規則以同資料夾的 `SKILL.md` 為準。

---

## 這個 Skill 做什麼

- 讀取版本檔，取得目前版本 `V_current`。
- 往回追出「版本值上一次不同」的那個 commit，作為錨點 `A`。
- 列出 `A..HEAD` 之間的所有 commit，歸類後輸出成一段 Markdown。

## 這個 Skill 不做什麼

- **不需要 git tag**。它的錨點是版本檔，不是 tag。你可以完全不打 tag。
- 不會修改版本檔、不會幫你 bump 版本。
- 不會建立或修改 `CHANGELOG.md`（只會讀取以對齊語言慣例）。
- 不是對外的 release notes 產生器——它**保留**內部變更（見下方分類說明）。

---

## 錨點機制（最重要的觀念）

**錨點 = 版本檔中語意版本上次改變的那個 commit。**

```
                   錨點 A                              HEAD
                     │                                  │
  ──o───o───o───────[o]───o───o───o───o───o───o───o────[o]──
                  v1.3.2                              v1.3.3
                  bump 進版本檔                    (剛 bump 完，工作目錄)
                     └───────────  比較範圍  ───────────┘
```

輸出的標題就會是 `## v1.3.3 (2026-08-09)`，底下列出這段區間的變更。

### ⚠️ 執行時機（唯一容易踩雷的地方）

**要在「版本檔已經改成新版本之後」執行。** 已 commit 或還在工作目錄中未 commit 都可以——Skill 讀的是工作目錄的值。

若你在**改版本號之前**就跑，`V_current` 還是舊值，錨點會往前多抓一格，範圍就會涵蓋到上上次 bump。

---

## 版本檔支援

依下列順序自動偵測第一個存在的檔案：

| 順序 | 檔案 | 取值方式 |
| --- | --- | --- |
| 1 | `config/version.yaml` / `.yml` | `ninthday/yaml` 格式，見下方 |
| 2 | `pyproject.toml` | `[project].version` 或 `[tool.poetry].version` |
| 3 | `package.json` | `.version` |
| 4 | `Cargo.toml` | `[package].version` |
| 5 | `VERSION` / `version.txt` | 整個檔案內容 |

若都找不到、或多個檔案版本不一致，Skill 會停下來問你以哪個為準。你也可以在提問時直接指定檔案。

> **注意**：Laravel 專案的 `composer.json` 通常**沒有** `version` 欄位，所以不在偵測清單中。

### `ninthday/yaml` 版本組裝規則

以這個檔案為例：

```yaml
current:
  label: v
  major: 1
  minor: 3
  patch: 3
```

版本值只由 `current` 區塊組成：`{label}{major}.{minor}.{patch}` → **`v1.3.3`**。`label` 不存在時就沒有前綴（`1.3.3`）。

**其他欄位一律忽略**，包含 `build.number`、`build.git-local`、`cache`、`format` 等。這點很關鍵：`build` 區塊會在一般建置時變動，如果比對整個檔案就會一直誤判成 bump；只比語意版本才不會。

---

## 使用流程

1. 這一輪要納入的 commit 都已進入分支。
2. 修改 `config/version.yaml` 的 `current`，bump 到新版本（例如 `1.3.2` → `1.3.3`）。
3. **執行 Skill**（版本檔已改，commit 與否皆可）。
4. 檢視輸出，需要的話寫進 `CHANGELOG.md` 或內部發布記錄。

### 觸發方式

在 Claude Code 對話中，用類似說法即可觸發：

- 「列出自上次 bump 以來的變更」
- 「我剛 bump 版本了，幫我看看這次改了什麼」
- 「比較這次改版與前一次改版的差異」
- 「產生這次 bump 的變更摘要」

---

## 輸出格式

- 只輸出一段 fenced Markdown code block，沒有前言或結語。
- 開頭是版本與日期標題 `## <V_current> (<YYYY-MM-DD>)`，日期為執行當日的 ISO 8601 日曆日期。
- 只包含**非空**的分類，順序固定為 `Added → Changed → Deprecated → Removed → Fixed → Security → Internal`。
- breaking change 放進最相關的分類，bullet 前綴 `**Breaking:**`，不另開分類。

範例：

```markdown
## v1.3.3 (2026-08-09)

### Added

- 匯出報表新增 CSV 格式

### Fixed

- 修正登入頁在 Safari 無法送出的問題

### Internal

- 將感測器讀值邏輯抽成獨立 service
```

### 分類與內部變更

前六個分類沿用 [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)。第七個 `Internal` 是本 Skill 為「內部 bump 比較」新增的，**不屬於** Keep a Changelog 規範，用來收重構、工具、依賴、CI 等沒有外部行為改變的項目。

因為這是內部比較而非對外發布，Skill **會保留**內部變更——這通常正是你 review 時想看到的。只有真正瑣碎的雜訊（純空白／格式化、只動 lockfile）會被濾掉。若你希望連這些都保留，執行時直接說明即可。

### 語言規則

bullet 描述的語言依以下優先序決定：

1. 使用者明確指定的語言。
2. 否則，比照現有 `CHANGELOG.md` 的語言。
3. 否則，預設英文。

**分類標題與 `**Breaking:**` 標記永遠保持英文**，即使 bullet 被翻譯成其他語言也一樣。

---

## 邊界情況

| 情況 | Skill 的行為 |
| --- | --- |
| **改版本號之前就執行** | 錨點往前多抓一格，範圍會涵蓋到上上次 bump。請務必先改版本再跑。 |
| **版本檔已改但範圍內無 commit** | 回傳 `No changes since the previous bump (<V_current>).`，不會硬湊內容。 |
| **第一次記錄 bump（找不到更早的版本）** | 以完整歷史為範圍，標題仍使用 `## <V_current> (<YYYY-MM-DD>)`。 |
| **只有 `build.number` 變動** | 不算 bump，會被自動跳過，不影響錨點判斷。 |
| **版本檔異動未進 git 歷史** | 錨點靠 git 歷史尋找，若舊版本從未 commit 過就找不到錨點，會退回完整歷史。 |
| **多個版本檔且不一致** | 停下來詢問以哪個為準。 |
| **大型 diff** | 先看 `--stat`，必要時才讀特定檔案的完整 diff，避免灌爆 context。 |

---

## 關於 git tag（選配）

這個 Skill **不需要 tag** 就能運作，`ninthday/yaml` 的 build number 走 `git rev-parse HEAD` 也不靠 tag。因此打不打 tag 純粹看你其他需求（例如方便在 GitHub 上切換版本、或別處要用 `git describe`）。

若你決定要打，建議這樣分層：

- **正式發布** → annotated tag（`git tag -a v1.3.0 -m "Release 1.3.0"`）。
- **例行 bump** → lightweight tag（`git tag v1.3.3`）即可。

這樣分層的好處是：`git describe` 不帶 `--tags` 時**只認 annotated tag**，所以工具與建置流程仍只會看到真正的發布，例行 bump tag 不會干擾，需要時再用 `--tags` 撈出來。

大量 lightweight tag 不會讓 repo 變大（它只是一行 ref，會被打包進 `packed-refs`），主要代價是 tag 清單變吵、以及日後要清理時得逐一 `git push --delete`、協作者還需 `git fetch --prune-tags` 才會同步。

推送 tag 記得：`git push --follow-tags`（annotated）或 `git push origin <tag>`（單一 tag）。

---

## 關於 `allowed-tools`

Skill 的 `allowed-tools` 限定為一組唯讀 git 指令加 `Read`。兩點提醒：

- 它是**預先核准（pre-approval）**，不是硬性沙箱。若要真正鎖死在唯讀操作，需再搭配專案的 permission **deny** 規則。
- 此欄位只在 **Claude Code CLI** 生效；透過 Agent SDK 使用時會被忽略，需改用主設定的 `allowedTools`。

---

## 關於名稱

`name` 目前是 `agri-build-note`。Skill 現在做的是「bump 間的變更比較」，與農業無關、也不是 build note。若要改成更貼切的名稱（例如 `bump-diff`），記得**資料夾名與 `name` 一併修改**，並注意這會改變它在 skill 清單中的顯示與叫用方式。

---

## 安裝與放置

把 `SKILL.md` 放進 skills 目錄：

- 個人層級（所有專案可用）：`~/.claude/skills/agri-build-note/SKILL.md`
- 專案層級（跟著 repo 走、team 共用）：`<repo>/.claude/skills/agri-build-note/SKILL.md`
