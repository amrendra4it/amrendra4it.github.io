---
layout: layouts/post.njk
title: "LeetCode 217. Contains Duplicate — Solution & Explanation (Python)"
dek: "Why a hash set beats sorting beats nested loops for this one."
date: 2026-07-17
readTime: "4 min read"
tags: [leetcode, python, arrays, hash-set]
problemNumber: 217
difficulty: Easy
---

*Original problem: [LeetCode #217 — Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a list of integers, return `true` if any value appears at least twice, and `false` if every element is distinct.

**Example:** `[1, 2, 3, 1]` → `true` (1 appears twice). `[1, 2, 3, 4]` → `false`.

## The brute-force approach (and why it's not enough)

Compare every element to every other element:

```python
def contains_duplicate_brute(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
```

O(n&sup2;) — fine for tiny lists, far too slow once `nums` has thousands of elements.

## A better approach: sort first

Sorting groups equal values next to each other, so a duplicate becomes "two neighbors are equal":

```python
def contains_duplicate_sorted(nums):
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return True
    return False
```

This is O(n log n) — better than brute force, but the sort itself is the bottleneck, and it also reorders the original list unless you copy it first.

## The best approach: a hash set

A set gives O(1) average-case membership checks. Walk through the list once, and check whether you've already seen each value:

```python
def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
```

Or, even shorter, using the fact that a set can't contain duplicates:

```python
def contains_duplicate(nums):
    return len(nums) != len(set(nums))
```

Both versions are O(n) time. The loop version can return early the moment a duplicate is found; the one-liner always builds the full set first — fine for most inputs, but worth knowing if you need early exit for very large lists.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## Why this pattern matters beyond this one problem

"Have I seen this before?" is one of the most common questions in array problems, and a hash set answers it in O(1). Before reaching for a nested loop or a sort, ask whether the problem is really just asking you to detect repeats or complements — if so, a set or hash map is almost always the fastest path.

## Where to take it next

- Try **Contains Duplicate II**, which adds a constraint on how far apart the duplicates can be
- Try **Contains Duplicate III**, which adds a value-closeness constraint too
- Compare the time/space trade-off here to Two Sum's hash map approach — both use "have I seen this" as the core idea
