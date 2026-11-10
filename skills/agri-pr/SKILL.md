---
name: agri-pr
description: Create a GitHub Pull Request when asked to open a PR or submit changes for review, targeting develop or a version branch.
metadata:
  author: Lucas Yang
  version: "2026.11.10"
  credits:
    - skill: show-me
      author: Dex Horthy
      organisation: Humanlayer
      url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
    - skill: pr
      author: Matt Pocock
      organisation: mattpocock
      url: "https://github.com/mattpocock/skills/blob/main/skills/engineering/pr/SKILL.md"
---

# agri-pr

## 分支

- 工作分支常用 `feat/*`、`fix/*` 或 `chore/*`；`main`、`develop` 與版本號分支（如 `1.x`、`2.x`）是基底分支，不直接從中建立 PR。
- 目標分支：使用者指定時，以指定分支為準；否則優先選遠端 `develop`（專案），沒有才從遠端版本號分支 `<主版本號>.x`（套件，如 `1.x`、`2.x`）中，按主版本號數值選最大的分支。套件的版本號分支命名參考 Laravel 官方套件，版本號分支用於開發與正式發佈。沒有可用的目標分支就停止並回報，不推送或建立 PR。

## 流程

1. 用 `git branch --show-current` 確認目前分支；若在上述基底分支，就停止執行。
2. 用 `git ls-remote --heads origin` 確認遠端分支，依上述規則選定目標分支；指定分支不存在，或沒有可用目標時，停止並回報。
3. 確認遠端有推送最新 commit；若未推送，先執行 `git push`。
4. 根據 commit 紀錄生成 PR 標題，並依下方範本撰寫 PR body。
5. 使用 `gh pr create --base <目標分支>` 建立 PR；指令失敗就回報，不能宣稱 PR 已建立。

## PR Body 範本

```markdown
## 變更摘要

<diagram, diff-sketch, or tree>

## 證據

- **Before:** <screenshot/output/failing test run>
  **After:** <screenshot/output/passing test run>

## 合併風險

**Door:** <one-way 或 two-way>

<optional: 描述>

**Blast Radius:** <一句話描述影響範圍>

<optional: 合併後可能造成的影響>
```

## 說明

PR 內容需省略所有前言，行文簡潔。

### 摘要

選擇最精簡、又能清楚呈現重點的方式。

- 用 pseudocode 呈現邏輯或演算法：

```text
on(save)
  if content is unchanged
    return cached result
  write new content
  return fresh result
```

- 用 call tree 呈現執行時的控制流程：

```text
submitForm
  createSession
    persistPrompt
    launchAgent
  navigateToSession
```

- 用 component tree 呈現 UI 結構，並標出重要的狀態與模組邊界：

```text
<SessionPage> (apps/example/src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
    <RunSkillButton> (packages/ui)
```

- 用簡要的 file tree 呈現各檔案的職責或大範圍重構：

```text
src/
├── commands/       # parses user actions
├── sessions/       # owns session state
└── transport/      # sends API requests
```

- 用 Mermaid 呈現元件互動、控制流程或資料流：

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Daemon
    User->>UI: choose command
    UI->>Daemon: send expanded prompt
    Daemon-->>UI: stream result
```

- 若重點在於變更之處，且原有結構已清楚，請使用 `diff`，並依主題選擇適合的呈現方式。

元件變更：

```diff
 <SessionPage>
   useSessionEvents()
   <SessionToolbar>
+    <RunSkillButton />
   <SessionTimeline>
+    <SkillResultCard />
```

檔案配置變更：

```diff
 src/
 ├── commands/
+│   └── show-me.ts       # expands the slash command
 ├── sessions/
-└── transport.ts
+└── transport/
+    ├── client.ts
+    └── stream.ts
```

call tree 或 call stack 變更：

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
-  navigateToSession
+  navigateToSession
+    subscribeToEvents
```

狀態或控制流程變更：

```diff
 on(save)
-  write content
+  if content is unchanged
+    return cached result
+  write new content
+  invalidate cache
```

- 如果大部分內容都是新的、省略上下文會讓職責歸屬或執行順序不清楚，或使用者需要可直接複製的完整形式，就呈現整個區塊：

```ts
function expandSkill(command: string): string {
  const skillName = command.slice(1);
  return `use the ${skillName} skill`;
}
```

#### 呈現原則

每個圖示都要緊接著它所輔助的簡短說明。只保留回答使用者目前問題，或釐清當前討論選項所需的呼叫、檔案、props、狀態與邊界。

可以只用一種，也可以搭配幾種；通常不需要全部用上。依情況選擇，避免資訊過多。

### 證據

提供變更確實可運作的具體證據，呈現變更前後的差異。

如果環境已備妥，而且變更涉及視覺呈現，截圖是 S-tier 證據。

執行結果是 A-tier 證據，例如測試結果或 console 輸出。用 pseudocode 呈現具體測試在變更前失敗、變更後通過的情況。

### 合併風險

說明這次變更屬於 one-way 還是 two-way door。two-way door 可以回頭，one-way door 則不行。容易還原的 PR 風險較低；涉及破壞性操作或難以撤銷的決策則屬於 one-way door。

Blast Radius 指這個 PR 可能影響的範圍。考量各種可能情況，例如版面位移、既有使用者的功能異常、行動裝置適應性等。

## 指令

```bash
# 推送當前分支（若尚未推送）
git push -u origin HEAD

# 使用流程中選定的目標分支
gh pr create \
  --base "<目標分支>" \
  --title "<根據 commit 訊息與變更內容生成>" \
  --body "<PR Body 內容>"
```

## 注意事項

- PR 標題根據 commit 訊息與變更內容生成，不需使用者手動輸入。
