---
layout: layouts/post.njk
title: "LeetCode 238. Product of Array Except Self — Solution & Explanation (Python)"
dek: "No division allowed — how prefix and suffix products solve it in one array."
date: 2026-07-18
readTime: "6 min read"
tags: [leetcode, python, arrays, prefix-sum]
problemNumber: 238
difficulty: Medium
---

*Original problem: [LeetCode #238 — Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given an array of integers, return a new array where each position holds the product of every number in the original array *except* the one at that position — and you're not allowed to use division. The solution should run in O(n) time.

**Example:** `[1, 2, 3, 4]` → `[24, 12, 8, 6]`. (For index 0: `2 * 3 * 4 = 24`. For index 1: `1 * 3 * 4 = 12`, and so on.)

## The brute-force approach (and why it's not enough)

For each index, multiply every other element:

```python
def product_except_self_brute(nums):
    result = []
    for i in range(len(nums)):
        product = 1
        for j in range(len(nums)):
            if i != j:
                product *= nums[j]
        result.append(product)
    return result
```

O(n&sup2;) — for every element, we scan the whole array again.

## The tempting shortcut that's not allowed

If division were allowed, you could compute the total product once, then divide it by `nums[i]` for each position. But the problem rules that out — and it also breaks down the moment a zero is in the array, so it's worth avoiding on principle even where it's technically permitted.

## The prefix/suffix approach

The insight: the answer at index `i` is *(product of everything to its left)* &times; *(product of everything to its right)*. If we precompute those two things, each answer is a single multiplication.

```python
def product_except_self(nums):
    n = len(nums)
    result = [1] * n

    # Pass 1: fill result[i] with the product of everything to the LEFT of i
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]

    # Pass 2: multiply in the product of everything to the RIGHT of i
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result
```

Walking through `[1, 2, 3, 4]`:

**Pass 1 (left products):** `result = [1, 1, 2, 6]` — each slot holds the product of everything before it.

**Pass 2 (multiply in right products):** working right to left, we multiply in the running product of everything after each index: `result = [24, 12, 8, 6]`.

Two passes, no division, no nested loop.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1) extra</span></div>
</div>

Note: the output array itself doesn't count as "extra" space by the problem's convention, since you have to return something of that size anyway — the two integer variables (`prefix`, `suffix`) are the only real extra space used.

## Why this pattern matters beyond this one problem

Prefix (and suffix) products/sums are a recurring trick anytime a problem asks "what's the combined effect of everything except position i" — running totals from both directions, combined at each index, usually beats recomputing from scratch for every position.

## Where to take it next

- Try **Trapping Rain Water**, which uses a very similar left-max/right-max prefix idea
- Try re-deriving this with a running sum instead of a product, to see how the same shape applies
- Think through what happens with zeros in the input — trace it by hand to confirm the prefix/suffix approach handles them correctly without any special-casing
