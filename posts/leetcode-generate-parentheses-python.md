---
layout: layouts/post.njk
title: "LeetCode 22. Generate Parentheses — Solution & Explanation (Python)"
dek: "Backtracking with two simple rules — never close before you've opened, never open past n."
date: 2026-07-31
readTime: "6 min read"
tags: [leetcode, python, backtracking, strings]
problemNumber: 22
difficulty: Medium
---

*Original problem: [LeetCode #22 — Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a number `n`, generate all possible combinations of `n` pairs of parentheses that are well-formed (properly opened and closed, correctly nested).

**Example:** `n = 3` → `["((()))", "(()())", "(())()", "()(())", "()()()"]`.

## Why this is a backtracking problem, not a stack problem

Valid Parentheses (checked earlier) *validates* a given string using a stack. This problem is the reverse: we need to *generate* every valid string, which means building strings character by character and abandoning ("backtracking" from) any path the moment it can no longer lead to a valid result.

## The two rules that keep every path valid

At each step of building a string, you can only make a move if:

1. **Add an opening bracket** `(` — only if you haven't already used all `n` of them.
2. **Add a closing bracket** `)` — only if the number of closing brackets used so far is *less than* the number of opening brackets used so far (otherwise you'd be closing something that was never opened).

Following just these two rules at every step guarantees every complete string is valid — no separate validation step needed afterward.

## The solution

```python
def generate_parenthesis(n):
    result = []

    def backtrack(current, open_count, close_count):
        # Base case: used all 2n characters
        if len(current) == 2 * n:
            result.append(current)
            return

        if open_count < n:
            backtrack(current + "(", open_count + 1, close_count)

        if close_count < open_count:
            backtrack(current + ")", open_count, close_count + 1)

    backtrack("", 0, 0)
    return result
```

Walking through `n = 2` (smaller example for clarity):

1. Start: `current=""`, `open=0`, `close=0`
2. Can open (`0 < 2`) → try `"("`, `open=1`
3. From `"("`: can open (`1 < 2`) → try `"(("`, `open=2`. Can also close (`0 < 1`) → try `"()"`, `close=1`
4. From `"(("`: can't open further (`open == n`). Can close (`0 < 2`) → `"(()"`
5. From `"(()"`: can close again (`1 < 2`) → `"(())"` — length `4 = 2n`, add to result
6. From `"()"`: can open (`1 < 2`) → `"()("`, then eventually closes to `"()()"` — added to result

Final result for `n = 2`: `["(())", "()()"]`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(4&sup n / &radic;n)</span></div>
  <div><span class="label">Space</span><span class="value">O(4&sup n / &radic;n)</span></div>
</div>

This time complexity looks unusual — it comes from the count of valid parentheses combinations itself (the n-th [Catalan number](https://en.wikipedia.org/wiki/Catalan_number)), since we generate exactly that many strings and no wasted invalid ones, thanks to the two pruning rules.

## Why this pattern matters beyond this one problem

Backtracking with "only take a step if it can't possibly lead somewhere invalid" is far more efficient than generating everything and filtering afterward — that's the difference between exploring only the valid search tree versus exploring a much larger tree and discarding most of it.

## Where to take it next

- Try **Letter Combinations of a Phone Number**, a gentler introduction to the same backtracking shape
- Try **Combination Sum** (later in the calendar) to see the same "add a valid step, recurse, undo" structure applied to numbers instead of brackets
- Trace through `n = 3` fully by hand — seeing the decision tree drawn out makes the pruning rules click much faster than reading code alone
