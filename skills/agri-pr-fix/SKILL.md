---
name: agri-pr-fix
description: Fetches unresolved review comments on the current pull request using GitHub GraphQL API, then presents them to the user for triage before making any changes. Use when user asks to fix PR comments, address review feedback, or check PR review status.
allowed-tools: Bash(gh pr view:*), Bash(gh api graphql:*)
metadata:
  author: Lucas Yang
  version: "2026.06.25"
---

# agri-pr-fix

## 工作流程

1. 取得當前分支對應的 PR 號碼
2. 使用 GraphQL API 查詢**尚未 resolved** 的 review comments
3. 將結果呈現給使用者，並等待確認後再處理
4. 修復完成後，將已處理的 review threads 標記為 resolved

## 步驟一：取得 PR 號碼

```bash
gh pr view --json number --jq '.number'
```

## 步驟二：GraphQL 查詢未 resolved 的 comments

```bash
gh api graphql -f query='
query($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 50) {
        nodes {
          id
          isResolved
          comments(first: 1) {
            nodes {
              author { login }
              body
              path
              line
              url
            }
          }
        }
      }
    }
  }
}' \
-F owner="{owner}" \
-F repo="{repo}" \
-F pr=<PR_NUMBER>
```

## 步驟三：呈現並等待確認

從結果中過濾出 `isResolved: false` 的 threads，整理後呈現給使用者，並詢問是否要開始處理。確認後才開始處理這些 comments。

## 步驟四：將已修復的 threads 標記為 Resolved

每處理完一個 comment 後，使用 `resolveReviewThread` mutation 將對應 thread 標記為 resolved，傳入步驟二取得的 thread `id`：

```bash
gh api graphql -f query='
mutation($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread {
      id
      isResolved
    }
  }
}' \
-F threadId="<THREAD_ID>"
```

逐一處理完所有確認要修復的 comments 後，回報已 resolved 的數量。
