---
layout: layouts/post.njk
title: "LeetCode 125. Valid Palindrome — Solution & Explanation (Python)"
dek: "Two pointers, skipping the noise, comparing only what matters."
date: 2026-07-21
readTime: "4 min read"
tags: [leetcode, python, strings, two-pointers]
problemNumber: 125
difficulty: Easy
---

*Original problem: [LeetCode #125 — Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a string, check whether it reads the same forwards and backwards — but first, ignore anything that isn't a letter or digit, and ignore uppercase/lowercase differences.

**Example:** `"A man, a plan, a canal: Panama"` → `true` (once you strip punctuation and spaces and lowercase everything, it reads the same both ways).

## The straightforward approach

Build a cleaned-up version of the string first, then compare it to its reverse:

```python
def is_palindrome_simple(s):
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
```

This is O(n) time, but it uses O(n) extra space to build the cleaned list and its reverse — fine for most inputs, but worth improving if you want to do it in constant space.

## The two-pointer approach (constant space)

Instead of building a new string, walk from both ends of the original string inward, skipping non-alphanumeric characters as you go, and compare characters directly:

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True
```

Walking through `"A man, a plan, a canal: Panama"`:

- `left` starts at `'A'`, `right` starts at `'a'` (last letter) — both alphanumeric, both lowercase to `'a'` — match, move both pointers inward.
- Non-alphanumeric characters (commas, colons, spaces) get skipped by the inner `while` loops without ever being compared.
- This continues until the pointers meet, confirming a palindrome.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why this pattern matters beyond this one problem

Two pointers moving toward each other from both ends is one of the most common string/array patterns — anytime you're checking a symmetric property (palindrome, mirrored structure, matching pairs from both sides), this beats building an extra copy of the data.

## Where to take it next

- Try **Valid Palindrome II**, which allows deleting at most one character
- Try implementing this without the `isalnum()`/`lower()` built-ins, using character code checks instead, to understand what those helpers are doing under the hood
- Compare this to Container With Most Water below — both use two pointers converging from opposite ends, for very different purposes
