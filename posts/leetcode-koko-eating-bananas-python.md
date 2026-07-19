---
layout: layouts/post.njk
title: "LeetCode 875. Koko Eating Bananas — Solution & Explanation (Python)"
dek: "Binary search doesn't just work on arrays — it works on the answer itself."
date: 2026-08-05
readTime: "6 min read"
tags: [leetcode, python, binary-search]
problemNumber: 875
difficulty: Medium
---

*Original problem: [LeetCode #875 — Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (paraphrased below — solve the original there).*

## The problem, in plain terms

There are several piles of bananas, and Koko can eat at most `k` bananas per hour from a single pile (if a pile has fewer than `k`, she finishes it and moves on that hour). Given a time limit `h` (in hours) before the guards return, find the *minimum* integer `k` such that Koko can eat all the bananas within `h` hours.

**Example:** `piles = [3, 6, 7, 11]`, `h = 8` → `4` (eating at 4 bananas/hour, it takes exactly 8 hours to finish every pile).

## Why this doesn't look like a typical binary search problem at first

There's no sorted array to search here — just a question with a numeric answer. But look at the *shape* of the problem: if speed `k` is enough to finish in time, then any speed **faster** than `k` also finishes in time (or faster). And if `k` is too slow, any speed **slower** is also too slow. That "if this value works, everything past it also works" property is exactly what binary search needs — it doesn't require a sorted array, just a monotonic (one-directional) relationship between the candidate answer and whether it "works."

## The approach: binary search on the possible eating speeds

The search range is `[1, max(piles)]` — eating slower than 1/hour makes no sense, and eating faster than the largest single pile is never necessary (you'd finish that pile in one hour regardless of how much faster you go).

For each candidate speed, compute how many hours it would take to finish all piles, and narrow the search based on whether that's within the limit.

```python
import math

def min_eating_speed(piles, h):
    def hours_needed(speed):
        return sum(math.ceil(pile / speed) for pile in piles)

    left, right = 1, max(piles)

    while left < right:
        mid = (left + right) // 2

        if hours_needed(mid) <= h:
            # This speed works — try to find something even slower (smaller) that still works
            right = mid
        else:
            # Too slow — need to eat faster
            left = mid + 1

    return left
```

Walking through `piles = [3, 6, 7, 11]`, `h = 8`:

1. `left=1, right=11`, `mid=6`. Hours needed: `ceil(3/6) + ceil(6/6) + ceil(7/6) + ceil(11/6) = 1+1+2+2 = 6`. `6 <= 8` → works, try slower: `right = 6`.
2. `left=1, right=6`, `mid=3`. Hours: `1+2+3+4 = 10`. `10 > 8` → too slow, need faster: `left = 4`.
3. `left=4, right=6`, `mid=5`. Hours: `1+2+2+3 = 8`. `8 <= 8` → works, try slower: `right = 5`.
4. `left=4, right=5`, `mid=4`. Hours: `1+2+2+3 = 8`. `8 <= 8` → works, try slower: `right = 4`.
5. `left == right == 4` → return `4`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n &middot; log(max(piles)))</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

Each binary search step costs O(n) to compute `hours_needed` across all piles, and there are O(log(max(piles))) steps.

## Why this pattern matters beyond this one problem

**"Binary search on the answer"** is a distinct pattern from searching within a data structure: whenever a problem asks for a minimum (or maximum) value satisfying some condition, and you can quickly check "does this candidate value work?", binary searching over the range of possible answers is often far faster than checking every candidate one by one.

## Where to take it next

- Try **Capacity To Ship Packages Within D Days**, which uses the exact same "binary search on the answer" shape with a different feasibility check
- Try **Time Based Key-Value Store** next (below) — a different flavor of binary search, this time over timestamps
- Practice spotting the signal for this pattern: "minimize/maximize X such that condition Y holds" is the phrase to watch for
