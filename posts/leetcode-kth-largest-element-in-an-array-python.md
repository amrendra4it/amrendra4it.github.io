---
layout: layouts/post.njk
title: "LeetCode 215. Kth Largest Element in an Array — Solution & Explanation (Python)"
dek: "You don't need to fully sort the array — a heap of size k is all the memory you actually need."
date: 2026-08-30
readTime: "6 min read"
tags: [leetcode, python, heap, arrays]
problemNumber: 215
difficulty: Medium
---

*Original problem: [LeetCode #215 — Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given an unsorted array of integers and an integer `k`, find the `k`-th largest element — not the `k`-th distinct element, so duplicate values count individually.

**Example:** `[3, 2, 1, 5, 6, 4]`, `k = 2` → `5` (sorted descending: `6, 5, 4, 3, 2, 1` — the 2nd largest is `5`).

## The simplest approach: sort

```python
def find_kth_largest_sorted(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]
```

This works and is easy to reason about, but it's O(n log n) — sorting the *entire* array just to read off one specific position is more work than necessary, especially when `k` is small relative to `n`.

## The heap approach: only track the k largest values seen

The insight: you never need to know the full sorted order — you only need to know the `k` largest values, and specifically the smallest among *those*. A **min-heap of size k** does exactly this: push values in, and whenever the heap grows past size `k`, pop the smallest — what's left after processing everything is always the `k` largest values seen so far, with the smallest of those sitting right at the top of the heap.

```python
import heapq

def find_kth_largest(nums, k):
    heap = []

    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)

    return heap[0]
```

Walking through `[3, 2, 1, 5, 6, 4]`, `k = 2`:

1. Push `3` → heap `[3]` (size 1, not over `k=2`, no pop)
2. Push `2` → heap `[2, 3]` (size 2, still fine)
3. Push `1` → heap `[1, 2, 3]` (size 3, over `k=2` → pop smallest, which is `1`). Heap: `[2, 3]`
4. Push `5` → heap `[2, 3, 5]` (size 3, over → pop smallest `2`). Heap: `[3, 5]`
5. Push `6` → heap `[3, 5, 6]` (size 3, over → pop smallest `3`). Heap: `[5, 6]`
6. Push `4` → heap `[4, 5, 6]` (size 3, over → pop smallest `4`). Heap: `[5, 6]`

Final heap: `[5, 6]` — the two largest values in the array. The top of a min-heap is always its smallest element, so `heap[0] = 5` — the 2nd largest overall, correctly matching the expected answer.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n log k)</span></div>
  <div><span class="label">Space</span><span class="value">O(k)</span></div>
</div>

This beats the O(n log n) sorting approach whenever `k` is meaningfully smaller than `n` — you're only ever paying heap operations proportional to `k`, not the full array size.

## A different (also valid) approach: Quickselect

There's a third technique worth knowing — Quickselect, a partition-based algorithm related to quicksort, which finds the k-th largest element in **average O(n)** time (worst case O(n&sup2;), though this is rare in practice and can be mitigated with random pivot selection). It's faster on average than the heap approach, but noticeably more intricate to implement correctly — the heap solution above is the better default to reach for first, with Quickselect as a known follow-up if asked to optimize further.

## Why this pattern matters beyond this one problem

"A bounded-size heap tracks the top/bottom k elements without needing to sort everything" is a hugely reusable idea — K Closest Points to Origin, Top K Frequent Elements, and any "find the k best/worst X" problem reuse this exact fixed-size-heap technique.

## Where to take it next

- Try **Kth Smallest Element in a BST** above for a contrasting problem — same "k-th element" framing, completely different technique since a BST already has useful structure to exploit
- Try **K Closest Points to Origin** (planned later in the calendar), which applies this same bounded-heap idea to a different comparison (distance instead of raw value)
- Try implementing Quickselect as a follow-up exercise once the heap approach feels solid — it's a great algorithm to have in your back pocket even if it's not always the first thing you reach for
