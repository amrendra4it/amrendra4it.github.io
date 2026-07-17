---
layout: layouts/post.njk
title: "LeetCode 49. Group Anagrams — Solution & Explanation (Python)"
dek: "Turn each word into a fingerprint, then let a hash map do the sorting for you."
date: 2026-07-20
readTime: "5 min read"
tags: [leetcode, python, strings, hash-map]
problemNumber: 49
difficulty: Medium
---

*Original problem: [LeetCode #49 — Group Anagrams](https://leetcode.com/problems/group-anagrams/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a list of strings, group the ones that are anagrams of each other into their own lists. Order of the groups, and order within each group, doesn't matter.

**Example:** `["eat", "tea", "tan", "ate", "nat", "bat"]` → `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`.

## The brute-force approach (and why it's not enough)

Compare every word to every other word to check if they're anagrams (e.g. using the sorted-string check from Valid Anagram), grouping matches as you go:

```python
def group_anagrams_brute(strs):
    groups = []
    used = [False] * len(strs)

    for i in range(len(strs)):
        if used[i]:
            continue
        group = [strs[i]]
        used[i] = True
        for j in range(i + 1, len(strs)):
            if not used[j] and sorted(strs[i]) == sorted(strs[j]):
                group.append(strs[j])
                used[j] = True
        groups.append(group)

    return groups
```

This works, but it's roughly O(n&sup2; &middot; k log k) (comparing every pair, each comparison itself sorting two strings of length `k`) — a lot of repeated work.

## The hash map approach

The key insight from Valid Anagram carries over directly: **anagrams become identical once sorted**. So instead of comparing every pair, turn each word into a "fingerprint" (its sorted letters) and use that fingerprint as a hash map key — anagrams will land in the same bucket automatically.

```python
def group_anagrams(strs):
    groups = {}

    for word in strs:
        key = "".join(sorted(word))
        groups.setdefault(key, []).append(word)

    return list(groups.values())
```

Walking through `["eat", "tea", "tan", "ate", "nat", "bat"]`:

1. `"eat"` → key `"aet"` → `groups = {"aet": ["eat"]}`
2. `"tea"` → key `"aet"` → matches existing key → `groups = {"aet": ["eat", "tea"]}`
3. `"tan"` → key `"ant"` → new key → `groups = {"aet": [...], "ant": ["tan"]}`
4. `"ate"` → key `"aet"` → joins the first group
5. `"nat"` → key `"ant"` → joins the second group
6. `"bat"` → key `"abt"` → its own new group

Final result: three groups, built in a single pass with no pairwise comparisons at all.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n &middot; k log k)</span></div>
  <div><span class="label">Space</span><span class="value">O(n &middot; k)</span></div>
</div>

*(n = number of words, k = max word length — sorting each word costs `k log k`, done once per word instead of once per pair.)*

## A faster fingerprint (skipping the sort)

Sorting each word is the remaining bottleneck. Since anagrams share the same letter *counts*, you can build the fingerprint as a count tuple instead of a sorted string, avoiding the `log k` factor entirely:

```python
def group_anagrams_fast(strs):
    groups = {}

    for word in strs:
        counts = [0] * 26
        for char in word:
            counts[ord(char) - ord("a")] += 1
        key = tuple(counts)
        groups.setdefault(key, []).append(word)

    return list(groups.values())
```

This brings the time down to O(n &middot; k) — one pass over each word's letters, no sorting at all.

## Why this pattern matters beyond this one problem

"Map each item to a canonical fingerprint, then group by that fingerprint" is a reusable trick anytime you need to bucket things by some underlying equivalence (same letters, same shape, same structure) rather than comparing every pair directly.

## Where to take it next

- Try **Valid Anagram** first if you haven't — it's the single-pair version of this same idea
- Try grouping by a different fingerprint, like grouping words by their length or by their first letter, to get a feel for how the fingerprint choice changes what counts as "the same"
- Time both versions (sorted-string key vs. count-tuple key) on a large random word list to see the `log k` difference in practice
