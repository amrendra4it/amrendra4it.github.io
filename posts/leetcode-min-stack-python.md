---
layout: layouts/post.njk
title: "LeetCode 155. Min Stack — Solution & Explanation (Python)"
dek: "Getting the minimum in O(1) by keeping a second stack that tracks it at every step."
date: 2026-07-28
readTime: "5 min read"
tags: [leetcode, python, stack, design]
problemNumber: 155
difficulty: Medium
---

*Original problem: [LeetCode #155 — Min Stack](https://leetcode.com/problems/min-stack/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Design a stack that supports the usual `push`, `pop`, and `top` operations, but *also* supports retrieving the minimum element currently in the stack — and every operation, including getting the minimum, must run in O(1) time.

## Why the obvious approach doesn't hit O(1)

The naive idea — scan the whole stack every time `getMin()` is called — works, but it's O(n) per call, not O(1). Sorting or using a separate min-heap alongside the stack would also cost more than constant time to keep updated on every push/pop.

## The insight: track the minimum *at each point in time*, not just once

Instead of computing the minimum on demand, maintain a second stack that records "what was the minimum *at the moment* each element was pushed." Every time you push a new value, you also push the minimum-so-far onto this second stack — so both stacks always stay in sync, and popping either one keeps that history consistent.

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        current_min = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(current_min)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]
```

Walking through a sequence of operations:

1. `push(3)` → `stack = [3]`, `min_stack = [3]` (3 is the only value, so it's the min)
2. `push(5)` → `stack = [3, 5]`, `min_stack = [3, 3]` (min of 5 and previous min 3 is still 3)
3. `push(2)` → `stack = [3, 5, 2]`, `min_stack = [3, 3, 2]` (2 is now the smallest)
4. `getMin()` → `2` (top of `min_stack`)
5. `pop()` → `stack = [3, 5]`, `min_stack = [3, 3]`
6. `getMin()` → `3` — correctly "forgets" that 2 was ever the minimum, since it's been popped

Every operation only touches the top of one or both stacks — no scanning required.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(1) for every operation</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

The space cost doubles compared to a plain stack (two stacks instead of one), but that's the trade-off for constant-time minimum lookups.

## A small space optimization

You don't strictly need to push a new value onto `min_stack` every single time — only when the new value is less than or equal to the current minimum. This can save space when there are few "new minimums," at the cost of slightly trickier pop logic (you need to check whether the popped value equals the current min before deciding whether to pop `min_stack` too). The version above is simpler to reason about and is the one worth knowing first.

## Why this pattern matters beyond this one problem

"Maintain a parallel structure that tracks some running property (min, max, count) alongside your main structure" is a recurring design-problem trick — anytime you need O(1) access to an aggregate that would otherwise require scanning, consider tracking it incrementally as you go, rather than recomputing it.

## Where to take it next

- Try **Max Stack**, the mirror-image problem
- Try implementing a queue with the same O(1) minimum property, using two of these min-stacks (a classic "implement X using two stacks" exercise)
- Think through how you'd handle `getMin()` on an empty stack — what should happen, and does your code handle it gracefully?
