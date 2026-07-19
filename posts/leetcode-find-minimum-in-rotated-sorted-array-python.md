---
layout: layouts/post.njk
title: "LeetCode 153. Find Minimum in Rotated Sorted Array — Solution & Explanation (Python)"
dek: "Binary search for the rotation point itself, by comparing against the right edge."
date: 2026-08-03
readTime: "5 min read"
tags: [leetcode, python, binary-search, arrays]
problemNumber: 153
difficulty: Medium
---

*Original problem: [LeetCode #153 — Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a sorted array rotated at some unknown pivot (no duplicate values), find the minimum element — in O(log n) time.

**Example:** `[4,5,6,7,0,1,2]` → `0`. `[3,4,5,1,2]` → `1`. If there's no rotation at all (`[1,2,3,4,5]`), the minimum is just the first element.

## The insight: compare the midpoint to the right edge

The minimum element is exactly the point where the "rotation" happens — the one spot where a smaller value follows a larger one. Rather than searching for that boundary directly, compare `nums[mid]` to `nums[right]`:

- If `nums[mid] > nums[right]`, the minimum **must be to the right** of `mid` (the rotation point is somewhere in that right portion, since values wrapped around to something smaller by the time they reached `right`).
- If `nums[mid] <= nums[right]`, the right portion from `mid` onward is already sorted, meaning the minimum is either `nums[mid]` itself or somewhere to its left — so we can safely include `mid` in our search range and shrink from the right.

```python
def find_min(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid

    return nums[left]
```

Walking through `[4,5,6,7,0,1,2]`:

1. `left=0, right=6`, `mid=3 (value 7)`. Is `7 > nums[right]=2`? Yes → minimum is to the right. `left = 4`.
2. `left=4, right=6`, `mid=5 (value 1)`. Is `1 > nums[right]=2`? No → minimum is at `mid` or to its left. `right = 5`.
3. `left=4, right=5`, `mid=4 (value 0)`. Is `0 > nums[right]=1`? No → `right = 4`.
4. `left == right == 4` → loop ends. Return `nums[4] = 0`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(log n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why compare against the right edge, not the left?

Comparing `nums[mid]` to `nums[left]` instead can work too, but it requires more careful case-splitting — comparing to `nums[right]` gives a cleaner two-way split (`> right` vs. `<= right`) that directly tells you which side contains the rotation point, without needing a third "no rotation in this half at all" case to handle separately.

## Why this pattern matters beyond this one problem

This is "binary search for a boundary" rather than "binary search for an exact value" — instead of asking "is this the target?", you ask "is the answer to my left or to my right?" at each step, based on some comparison property. That same shape shows up in "find first/last occurrence," "find the peak element," and many other boundary-finding problems.

## Where to take it next

- Try **Find Minimum in Rotated Sorted Array II**, which adds duplicate values — this breaks the clean comparison above and needs an extra linear-scan fallback in the worst case
- Revisit **Search in Rotated Sorted Array** above — finding the minimum first is actually an alternative strategy for solving that problem too (find the rotation point, then binary search the correct sorted half)
- Trace through an array with zero rotation (`[1,2,3,4,5]`) to confirm the loop still correctly returns the first element
