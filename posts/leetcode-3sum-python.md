---
layout: layouts/post.njk
title: "LeetCode 15. 3Sum — Solution & Explanation (Python)"
dek: "Sort first, then let two pointers do the work Two Sum's hash map can't."
date: 2026-07-25
readTime: "7 min read"
tags: [leetcode, python, arrays, two-pointers]
problemNumber: 15
difficulty: Medium
---

*Original problem: [LeetCode #15 — 3Sum](https://leetcode.com/problems/3sum/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a list of integers, find all unique triplets that sum to zero. No duplicate triplets in the output, even if the same three values could be picked in a different order or from different positions.

**Example:** `[-1, 0, 1, 2, -1, -4]` → `[[-1, -1, 2], [-1, 0, 1]]`.

## Why Two Sum's hash map trick doesn't extend cleanly

Two Sum solves "find two numbers that sum to a target" in O(n) with a hash map. You might expect the same trick to extend to three numbers — fix one number, then hash-map-Two-Sum the rest. That actually works for *finding* triplets, but handling **duplicates cleanly** gets messy with hash maps, since you'd need extra bookkeeping to avoid the same triplet appearing multiple times in different orders. Sorting first turns out to make duplicate-handling far simpler.

## The approach: sort, then fix one number and two-pointer the rest

1. Sort the array.
2. Fix the first number of the triplet, `nums[i]`.
3. For the remaining part of the array, use two pointers (`left` just after `i`, `right` at the end) converging inward — exactly like Container With Most Water's shape, but here we're searching for a target sum instead of a maximum area.

```python
def three_sum(nums):
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate values for the first number
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, n - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                # Skip duplicates for the second and third numbers
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1

    return result
```

Walking through the sorted version of `[-1, 0, 1, 2, -1, -4]`, which is `[-4, -1, -1, 0, 1, 2]`:

1. `i=0 (-4)`: `left=1, right=5`. Sums checked: too small every time since `-4` needs two large numbers — no triplet found here that sums to 0 with this fixed value.
2. `i=1 (-1)`: `left=2, right=5`. `-1 + -1 + 2 = 0` → found `[-1, -1, 2]`. Move both pointers, skip any duplicate `-1` at the new `left`.
3. Continue: `-1 + 0 + 1 = 0` → found `[-1, 0, 1]`.
4. `i=2 (-1)`: this is a duplicate of `nums[1]`, so it's skipped entirely by the `if i > 0 and nums[i] == nums[i-1]` check — this is exactly what prevents duplicate triplets starting with the same first value.

Final result: `[[-1, -1, 2], [-1, 0, 1]]`, matching the expected answer with no duplicates.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n&sup2;)</span></div>
  <div><span class="label">Space</span><span class="value">O(1) extra (excluding the sort and output)</span></div>
</div>

The sort costs O(n log n), and the outer loop plus inner two-pointer scan costs O(n&sup2;) — the two-pointer part dominates, so the overall complexity is O(n&sup2;).

## Why this pattern matters beyond this one problem

"Sort first, then two-pointer the rest, skipping duplicates carefully at each level" is the standard shape for any "k numbers that sum to target" problem. Once you have this down for three numbers, extending to **4Sum** is mostly adding one more outer loop around the same two-pointer core.

## Where to take it next

- Try **3Sum Closest**, which asks for the triplet whose sum is closest to a target rather than exactly equal to it
- Try **4Sum**, extending this same sorted + two-pointer approach with an extra fixed index
- Trace through the duplicate-skipping logic by hand on an input with several repeated values — it's the part most people get subtly wrong on a first attempt
