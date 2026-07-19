---
layout: layouts/post.njk
title: "LeetCode 11. Container With Most Water — Solution & Explanation (Python)"
dek: "Why moving the shorter wall inward is always the right move."
date: 2026-07-24
readTime: "5 min read"
tags: [leetcode, python, arrays, two-pointers]
problemNumber: 11
difficulty: Medium
---

*Original problem: [LeetCode #11 — Container With Most Water](https://leetcode.com/problems/container-with-most-water/) (paraphrased below — solve the original there).*

## The problem, in plain terms

You're given a list of heights, where each represents a vertical line at that position. Pick two lines that, together with the x-axis, form a container — and find the pair that holds the most water. The container's capacity is limited by the *shorter* of the two lines (water spills over the shorter wall) times the distance between them.

**Example:** `[1, 8, 6, 2, 5, 4, 8, 3, 7]` → `49` (using the lines at index 1, height 8, and index 8, height 7 — distance 7, limited by the shorter height 7, so `7 * 7 = 49`).

## The brute-force approach (and why it's not enough)

Check every possible pair of lines:

```python
def max_area_brute(heights):
    best = 0
    for i in range(len(heights)):
        for j in range(i + 1, len(heights)):
            width = j - i
            area = width * min(heights[i], heights[j])
            best = max(best, area)
    return best
```

O(n&sup2;) — every pair gets checked, even ones that obviously can't beat the current best.

## The two-pointer approach

Start with the widest possible container — the two outermost lines — and work inward. At each step, move the pointer at the **shorter** of the two current lines.

Why the shorter one? Because the container's height is capped by the shorter line no matter what. If you moved the *taller* line inward instead, the width shrinks and the height either stays the same (still capped by the short one) or gets worse — there's no way that helps. Moving the shorter line is the only move that has a chance of finding a taller line and improving the area.

```python
def max_area(heights):
    left, right = 0, len(heights) - 1
    best = 0

    while left < right:
        width = right - left
        height = min(heights[left], heights[right])
        best = max(best, width * height)

        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1

    return best
```

Walking through `[1, 8, 6, 2, 5, 4, 8, 3, 7]`:

1. `left=0 (1), right=8 (7)` → width 8, height `min(1,7)=1` → area 8. Left is shorter, move `left` to 1.
2. `left=1 (8), right=8 (7)` → width 7, height `min(8,7)=7` → area 49. Right is shorter now, move `right` to 7.
3. ... continues, but no later pair beats 49.

Final answer: `49`, found by touching each position at most once.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why this pattern matters beyond this one problem

This is a "greedy two pointers" pattern: instead of checking every pair, you use a provable rule (moving the shorter wall) to safely discard a huge number of pairs without ever examining them. Whenever a problem involves picking two positions to maximize/minimize something bounded by "the smaller of the two," look for this same converging-pointer trick.

## Where to take it next

- Try **Trapping Rain Water**, a related but distinct problem — that one sums up trapped water across *every* position, not just the best single pair
- Try proving to yourself on paper why moving the taller pointer can never help, before looking at the code — that's the part interviewers actually want to hear explained
- Compare this to Valid Palindrome above — same two-pointer shape, completely different comparison logic
