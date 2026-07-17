---
layout: layouts/post.njk
title: "LeetCode 242. Valid Anagram — Solution & Explanation (Python)"
dek: "Sorting gets you there — counting characters gets you there faster."
date: 2026-07-19
readTime: "4 min read"
tags: [leetcode, python, strings, hash-map]
problemNumber: 242
difficulty: Easy
---

*Original problem: [LeetCode #242 — Valid Anagram](https://leetcode.com/problems/valid-anagram/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given two strings, `s` and `t`, return `true` if `t` is an anagram of `s` — meaning it uses exactly the same letters, the same number of times, just rearranged.

**Example:** `s = "anagram"`, `t = "nagaram"` → `true`. `s = "rat"`, `t = "car"` → `false`.

## Quick check before anything else

If the two strings have different lengths, they can't possibly be anagrams — worth checking first as a fast rejection:

```python
if len(s) != len(t):
    return False
```

## The sorting approach

Two strings are anagrams exactly when their sorted letters match:

```python
def is_anagram_sorted(s, t):
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)
```

Simple and correct, but sorting costs O(n log n) — more work than necessary for what's fundamentally a counting problem.

## The counting approach

Since we only care about *how many* of each letter appear, we can count characters instead of sorting them, using a hash map (or, for lowercase English letters, a fixed-size array of 26 counts):

```python
def is_anagram(s, t):
    if len(s) != len(t):
        return False

    counts = {}

    for char in s:
        counts[char] = counts.get(char, 0) + 1

    for char in t:
        if char not in counts:
            return False
        counts[char] -= 1
        if counts[char] == 0:
            del counts[char]

    return len(counts) == 0
```

Walking through `s = "rat"`, `t = "car"`:

1. Count `s`: `{r: 1, a: 1, t: 1}`
2. Process `t`: `c` isn't in the count map at all → return `False` immediately.

For a true anagram, every decrement would eventually zero out and remove each entry, leaving an empty map — confirming a perfect match.

A one-line alternative using Python's `Counter`:

```python
from collections import Counter

def is_anagram(s, t):
    return Counter(s) == Counter(t)
```

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)*</span></div>
</div>

*O(1) if the character set is fixed (e.g. 26 lowercase letters), since the map size is bounded regardless of input length; O(n) for arbitrary Unicode input.

## Why this pattern matters beyond this one problem

Counting characters (or elements) instead of sorting is a recurring upgrade anytime "same multiset of items" is the real question — sorting proves it but does more work than needed; a frequency count proves the same thing in one pass.

## Where to take it next

- Try **Group Anagrams** next — same counting idea, applied across a whole list of strings at once
- Try **Find All Anagrams in a String**, which adds a sliding window on top of this counting idea
- Compare this counting approach to Two Sum's hash map — both trade a small amount of space for a big drop in time complexity
