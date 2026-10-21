---
description: Review the current changes (or a path/ref) with the frontend-reviewer agent
argument-hint: '[path | ref | range] [full]'
---

Run the `frontend-reviewer` agent (`.claude/agents/frontend-reviewer.md`) on this repo.

Scope: $ARGUMENTS

- If the scope above is empty, review the working tree: `git diff`, `git diff --staged` and untracked files.
- If it names a path, ref or range, review only that.
- If it contains `full`, tell the agent the caller asked for a full review, so it may run `bun run build` when there is no `.next` build.

Pass the scope to the agent in its prompt. Don't review it yourself and don't edit code while it runs.

When it returns, reply with:

1. The verdict (**ready** or **needs changes**) and the gates line.
2. Every Must-fix item as written (`file:line`, why, fix).
3. Counts of Should-fix and Nit items, with the list if there are five or fewer.

If the verdict is **needs changes** and this review was part of your own task, fix every Must-fix item, re-run the gates, and run `/review` again before saying the work is done.
