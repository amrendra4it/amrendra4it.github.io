---
layout: layouts/post.njk
title: "LeetCode 3. Longest Substring Without Repeating Characters — Solution & Explanation (Python)"
dek: "A sliding window that shrinks exactly when it needs to, and no more."
date: 2026-07-22
readTime: "6 min read"
tags: [leetcode, python, strings, sliding-window]
problemNumber: 3
difficulty: Medium
---

*Original problem: [LeetCode #3 — Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a string, find the length of the longest contiguous substring that doesn't repeat any character.

**Example:** `"abcabcbb"` → `3` (the answer is `"abc"`, since anything longer starts repeating a character).

## The brute-force approach (and why it's not enough)

Check every possible substring and see if it has repeats:

```python
def longest_substring_brute(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
            best = max(best, j - i + 1)
    return best
```

O(n&sup2;) — for every starting point, we scan forward until we hit a repeat. Fine for short strings, slow for long ones.

## The sliding window approach

The key insight: instead of restarting from every possible starting point, keep a **window** `[left, right]` that always contains no repeats, and slide it forward. When you hit a character you've already seen *inside the current window*, shrink the window from the left just enough to remove that duplicate — don't restart from scratch.

```python
def longest_substring(s):
    seen = {}  # character -> most recent index
    left = 0
    best = 0

    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        best = max(best, right - left + 1)

    return best
```

Walking through `"abcabcbb"`:

1. `right=0 ('a')`: not seen, window is `"a"`, best = 1
2. `right=1 ('b')`: not seen, window is `"ab"`, best = 2
3. `right=2 ('c')`: not seen, window is `"abc"`, best = 3
4. `right=3 ('a')`: seen at index 0, which is `>= left (0)` → shrink: `left = 1`. Window is now `"bca"`, best stays 3
5. Continues similarly — the window keeps sliding, but never grows past length 3 for this input

The `seen[char] >= left` check matters: without it, you might use a stale earlier occurrence of a character that's no longer inside the current window, causing you to shrink incorrectly.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(min(n, charset size))</span></div>
</div>

## Why this pattern matters beyond this one problem

The sliding window — expand the right edge, shrink the left edge only when a constraint is violated — is one of the highest-value patterns to have automatic, since it turns a huge number of "find the longest/shortest substring/subarray satisfying X" problems from O(n&sup2;) into O(n).

## Where to take it next

- Try **Longest Repeating Character Replacement**, which adds a "you can change k characters" twist to the same window idea
- Try **Minimum Window Substring**, a harder variant using the same expand/shrink shape
- Compare this to Contains Duplicate's hash set — both use "have I seen this" but this problem adds the window boundary on top
