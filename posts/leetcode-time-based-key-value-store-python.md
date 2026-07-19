---
layout: layouts/post.njk
title: "LeetCode 981. Time Based Key-Value Store — Solution & Explanation (Python)"
dek: "A hash map of sorted lists, and binary search to find 'the latest value at or before this time.'"
date: 2026-08-06
readTime: "6 min read"
tags: [leetcode, python, binary-search, design, hash-map]
problemNumber: 981
difficulty: Medium
---

*Original problem: [LeetCode #981 — Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Design a key-value store that supports:
- `set(key, value, timestamp)` — store a value for a key at a given timestamp
- `get(key, timestamp)` — retrieve the value for a key that was set at the **largest timestamp less than or equal to** the given timestamp (if no such timestamp exists, return an empty string)

Timestamps for `set` calls on the same key are guaranteed to be strictly increasing.

**Example:** `set("foo", "bar", 1)`, then `get("foo", 1)` → `"bar"`. `get("foo", 4)` → still `"bar"` (no newer value exists, so the latest one at or before time 4 is used). `get("foo", 0)` → `""` (nothing was set that early).

## Why a plain hash map isn't enough on its own

A hash map gives you O(1) lookup by key, but each key here doesn't just have *one* value — it has a whole history of (timestamp, value) pairs, and a `get` needs to find the right point in that history. That's where the timestamp ordering guarantee becomes useful: since timestamps for a given key are always set in increasing order, the list of (timestamp, value) pairs for each key is **already sorted by timestamp** — which means we can binary search it.

## The approach: hash map of sorted lists + binary search

```python
from collections import defaultdict
import bisect

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)  # key -> list of (timestamp, value)

    def set(self, key, value, timestamp):
        self.store[key].append((timestamp, value))

    def get(self, key, timestamp):
        entries = self.store[key]
        if not entries:
            return ""

        # Binary search for the rightmost entry with timestamp <= given timestamp
        i = bisect.bisect_right(entries, (timestamp, chr(0x10FFFF)))

        if i == 0:
            return ""
        return entries[i - 1][1]
```

## How the binary search call actually works

`bisect_right(entries, (timestamp, chr(0x10FFFF)))` finds the insertion point that would keep `entries` sorted, treating the search key as `(timestamp, <largest possible character>)`. Since tuples compare element by element, this trick makes the search value compare as *larger than* any real entry with that exact timestamp (because no real value string will ever be lexicographically bigger than the maximum Unicode character) — which is what makes `bisect_right` correctly land just past all entries at that timestamp, landing exactly on the boundary we want.

Walking through: `set("foo", "bar", 1)`, `set("foo", "bar2", 4)`, then `get("foo", 5)`:

1. `entries = [(1, "bar"), (4, "bar2")]`
2. Searching for insertion point of `(5, chr(0x10FFFF))` — this is larger than both existing entries (since `5 > 4`), so `bisect_right` returns `2` (insert at the end).
3. `i - 1 = 1` → `entries[1][1] = "bar2"` — correctly the most recent value at or before timestamp 5.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(log n) per get, O(1) per set</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## A simpler way to write the same idea

If the `bisect` trick above feels overly clever, a manual binary search over just the timestamps is equally valid and easier to reason about:

```python
def get(self, key, timestamp):
    entries = self.store[key]
    left, right = 0, len(entries) - 1
    result = ""

    while left <= right:
        mid = (left + right) // 2
        if entries[mid][0] <= timestamp:
            result = entries[mid][1]
            left = mid + 1
        else:
            right = mid - 1

    return result
```

This tracks the best answer found so far, moving right whenever a valid (timestamp `<=` target) entry is found, in case there's an even later valid one further along.

## Why this pattern matters beyond this one problem

"A hash map where each value is itself a sorted structure you binary search into" is a common design-problem shape — it combines O(1) key lookup with O(log n) lookup *within* that key's history, which is much better than scanning a key's whole history linearly every time.

## Where to take it next

- Try **Snapshot Array**, a closely related design problem using a very similar sorted-history-per-index idea
- Try implementing `get` both ways (library `bisect` vs. manual binary search) and compare — knowing both matters, since some interview settings restrict which library functions you can use
- Think about how you'd extend this design to also support deleting a key's history entirely
