---
layout: layouts/post.njk
title: "LeetCode 1. Two Sum — Solution & Explanation (Python)"
dek: "The classic first problem, solved in one pass with a hash map."
date: 2026-07-15
readTime: "4 min read"
tags: [leetcode, python, arrays, hash-map]
problemNumber: 1
difficulty: Easy
---

*Original problem: [LeetCode #1 — Two Sum](https://leetcode.com/problems/two-sum/) (paraphrased below — solve the original there).*

## The problem, in plain terms

You're given a list of numbers and a target sum. Find the indices of the two numbers in the list that add up to the target. Each input has exactly one valid answer, and you can't use the same element twice.

**Example:** given `[2, 7, 11, 15]` and target `9`, the answer is `[0, 1]`, since `2 + 7 = 9`.

## The brute-force approach (and why it's not enough)

The obvious first idea is to check every pair of numbers:

```python
def two_sum_brute(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
```

This works, but it's O(n&sup2;) — for every element, we scan the rest of the list. Fine for small inputs, slow for large ones.

## The one-pass hash map approach

The key insight: for each number, we already know what its "partner" needs to be — `target - num`. Instead of searching for that partner, we can check if we've *already seen it* using a hash map, which gives O(1) lookups.

```python
def two_sum(nums, target):
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []  # no solution found
```

Walking through `[2, 7, 11, 15]` with target `9`:

1. `num = 2`, complement = `7`. Not in `seen` yet. Store `seen[2] = 0`.
2. `num = 7`, complement = `2`. `2` **is** in `seen` (at index 0). Return `[0, 1]`.

Done in a single pass.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## Why this pattern matters beyond this one problem

The "store what you've seen, check for the complement" pattern shows up constantly in array/hash-map problems — anytime you're looking for pairs, complements, or duplicates, this is worth trying before reaching for nested loops.

## Where to take it next

- Try **3Sum**, which extends this same complement idea to three numbers
- Try **Two Sum II** (sorted input) — a two-pointer approach beats the hash map there
- Practice explaining *why* the hash map approach is faster out loud — that's exactly what interviewers want to hear
