---
name: clarify-first
description: Use before writing code for any non-trivial task in Porter (new features, schema or API changes, infra, UI screens, refactors across modules). Restates the goal, checks the PRD, CLAUDE.md and ADRs, then asks a few targeted questions with recommended defaults and waits for answers. Skip for trivial edits or when the user says "just do it".
---

# Clarify first

Adapted from "Clarification-First Prompting" by Nima Aksoy (CC-BY-4.0):
https://github.com/nimaaksoy/skills/blob/main/skills/meta/prompt-engineering/clarification-first-prompting/SKILL.md

Goal: catch the decisions that would send the work in different directions before any code is written, without asking about things that are already decided or have an obvious answer.

## When to skip

- Trivial edits: typos, copy changes, renames, one-line fixes, formatting, dependency bumps already approved.
- The user says "just do it" (or similar). Proceed with stated assumptions instead.
- The question was already answered earlier in the conversation.

## Steps

1. **Restate the goal** in one or two sentences, in your own words, so a misunderstanding shows up immediately.

2. **Read before asking.** Check `docs/prd.html`, `CLAUDE.md` and `docs/adr/` (and the relevant code). Do not ask about anything they already decide, such as money as integer cents, the `FinancialDataProvider` adapter, the "Midnight & metal" UI direction in PRD section 05, or the serverless architecture. If the request conflicts with one of them, say so and ask which wins.

3. **Ask 2–5 specific questions**, only where plausible answers would lead to meaningfully different work (data model, API shape, screen flow, scope of the milestone, AWS cost, new dependencies). For each question:
   - give 2–4 concrete options,
   - mark one as the recommended default and say why in a few words,
   - keep it answerable with a letter or a word.

   Order them by impact. Don't pad to reach a count; if only two matter, ask two.

4. **State assumptions** for everything that has an obvious default, as a short list the user can correct ("Assuming: endpoint lives in the `accounts` module; no new dependencies.").

5. **Wait for answers.** Don't start writing code in the same turn. When the user replies, summarise the plan (files/modules touched, approach, checks you'll run) in a few bullets, then start. Unanswered questions take the recommended default; say so.

6. **Don't re-ask.** Once answered, proceed. Only come back with a new question if implementation uncovers a decision that wasn't visible before.

## Example

> **Goal:** add a transactions list screen showing the last 30 days for one account.
>
> 1. Data source? **(a) existing `/transactions` endpoint with a date filter (recommended: no backend change)** · (b) new account-scoped endpoint
> 2. Pagination? **(a) infinite scroll, 50 per page (recommended)** · (b) load all 30 days at once
> 3. Grouping? **(a) by day with daily totals (recommended, matches PRD)** · (b) flat list
>
> Assuming: amounts formatted from integer cents with existing helpers; styling from `src/theme/tokens.ts`; no new dependencies.
