---
layout: layouts/post.njk
title: "LeetCode 33. Search in Rotated Sorted Array — Solution & Explanation (Python)"
dek: "Binary search still works here — you just need to figure out which half is actually sorted."
date: 2026-08-02
readTime: "6 min read"
tags: [leetcode, python, binary-search, arrays]
problemNumber: 33
difficulty: Medium
---

*Original problem: [LeetCode #33 — Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) (paraphrased below — solve the original there).*

## The problem, in plain terms

You're given a sorted array that's been "rotated" at some unknown pivot point (e.g. `[0,1,2,4,5,6,7]` rotated becomes `[4,5,6,7,0,1,2]`). Given a target value, find its index — or return `-1` if it's not present. Your solution must run in O(log n) time.

**Example:** `nums = [4,5,6,7,0,1,2]`, `target = 0` → `4` (the index of `0`).

## Why a plain binary search doesn't immediately work

Standard binary search relies on the whole array being sorted, so you can decide which half to search based on a simple comparison. Here, the array *isn't* fully sorted — but here's the key fact: **at least one of the two halves around any midpoint is still sorted**, even after rotation. The trick is figuring out which half is sorted, then checking whether the target could be in that sorted half.

## The approach

At each step:
1. Find the midpoint.
2. Check if the target is exactly at the midpoint — if so, done.
3. Determine which half (left or right of the midpoint) is sorted.
4. Check if the target falls within that sorted half's range — if so, search there; otherwise, search the other half.

```python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

Walking through `nums = [4,5,6,7,0,1,2]`, `target = 0`:

1. `left=0, right=6`, `mid=3 (value 7)`. Not the target. `nums[left]=4 <= nums[mid]=7`, so the **left half is sorted**. Is `4 <= 0 < 7`? No. Search the right half: `left = 4`.
2. `left=4, right=6`, `mid=5 (value 1)`. Not the target. `nums[left]=0 <= nums[mid]=1`, so the **left half is sorted**. Is `0 <= 0 < 1`? Yes. Search the left half: `right = 4`.
3. `left=4, right=4`, `mid=4 (value 0)`. Matches target — return `4`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(log n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## The comparison that trips people up

`nums[left] <= nums[mid]` is the check that decides which half is sorted — it's easy to get the `<=` vs `<` boundary wrong, especially with only two elements left. Testing on a small rotated array (like `[3, 1]`) by hand is a good way to confirm the edge cases are handled correctly before trusting the general case.

## Why this pattern matters beyond this one problem

"Binary search doesn't require the whole array to be sorted — it just requires a property that lets you eliminate half the search space at each step." Rotated sorted arrays, "find the peak," and "search a 2D matrix" all reuse this same idea: identify what property still holds despite the array not being fully sorted, then binary-search on that property instead.

## Where to take it next

- Try **Find Minimum in Rotated Sorted Array** next (below) — a simpler, related problem that finds the rotation point itself
- Try **Search in Rotated Sorted Array II**, which adds duplicate values — a small change that breaks the clean sorted-half detection and needs an extra case
- Try tracing through an input with no rotation at all (`[1,2,3,4,5]`) to confirm your solution still works when the "rotation" is effectively zero
