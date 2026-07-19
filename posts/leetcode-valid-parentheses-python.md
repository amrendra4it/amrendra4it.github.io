---
layout: layouts/post.njk
title: "LeetCode 20. Valid Parentheses — Solution & Explanation (Python)"
dek: "The canonical stack problem — matching brackets by always checking the most recent one first."
date: 2026-07-27
readTime: "4 min read"
tags: [leetcode, python, stack, strings]
problemNumber: 20
difficulty: Easy
---

*Original problem: [LeetCode #20 — Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a string containing just `(`, `)`, `{`, `}`, `[`, and `]`, determine if the brackets are properly matched and nested — every opening bracket has a matching closing bracket, in the correct order.

**Example:** `"{[()]}"` → `true`. `"{[(])}"` → `false` (the brackets cross over each other instead of nesting properly).

## Why this screams "stack"

The key property: the *most recently opened* bracket must be the *next one closed*. That "most recent first" behavior is exactly what a stack gives you — push every opening bracket, and when you hit a closing bracket, it must match whatever's currently on top of the stack.

## The solution

```python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []

    for char in s:
        if char in pairs:
            # It's a closing bracket — check the top of the stack
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            # It's an opening bracket — push it
            stack.append(char)

    # If anything is left unclosed, it's invalid
    return len(stack) == 0
```

Walking through `"{[()]}"`:

1. `{` → opening, push. Stack: `["{"]`
2. `[` → opening, push. Stack: `["{", "["]`
3. `(` → opening, push. Stack: `["{", "[", "("]`
4. `)` → closing, expects `(` on top — matches. Pop. Stack: `["{", "["]`
5. `]` → closing, expects `[` on top — matches. Pop. Stack: `["{"]`
6. `}` → closing, expects `{` on top — matches. Pop. Stack: `[]`

Stack is empty at the end → `True`.

Now `"{[(])}"`:

1. `{`, `[`, `(` all pushed. Stack: `["{", "[", "("]`
2. `]` → closing, expects `[` — but the top of the stack is `(`, not `[`. Mismatch → return `False` immediately.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## Two easy mistakes to watch for

- **Forgetting to check if the stack is empty** before popping when you see a closing bracket — a string starting with `)` would crash instead of correctly returning `False`. The `if not stack or ...` check guards against this.
- **Forgetting the final check** — after the loop, if the stack still has unclosed opening brackets left (like in `"((("`), the string is invalid even though nothing "mismatched" along the way.

## Why this pattern matters beyond this one problem

Any time a problem involves matching, nesting, or "the most recent unclosed thing needs to be resolved first" — parentheses, HTML tags, undo/redo history — a stack is almost always the right tool. This is one of the most reused ideas in the entire interview-problem space.

## Where to take it next

- Try **Min Stack** next (below) — a different stack problem, but reinforces the same "push/pop with extra bookkeeping" muscle
- Try **Generate Parentheses**, which flips this problem around: instead of validating brackets, you generate all valid combinations
- Try extending this solution to also validate HTML-style tags (`<div>...</div>`) instead of just bracket characters
