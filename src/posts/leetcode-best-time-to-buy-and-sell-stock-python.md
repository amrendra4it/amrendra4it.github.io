---
layout: layouts/post.njk
title: "LeetCode 121. Best Time to Buy and Sell Stock — Solution & Explanation (Python)"
dek: "One pass, one running minimum — how to spot the maximum profit without checking every pair of days."
date: 2026-07-16
readTime: "5 min read"
tags: [leetcode, python, arrays, greedy]
problemNumber: 121
difficulty: Easy
---

*Original problem: [LeetCode #121 — Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) (paraphrased below — solve the original there).*

## The problem, in plain terms

You're given a list of prices, where `prices[i]` is a stock's price on day `i`. You may buy the stock on exactly one day and sell it on a later day, and you want the maximum profit possible. If no profit is possible, return `0`. You cannot sell before you buy.

**Example:** given `[7, 1, 5, 3, 6, 4]`, buy on day 1 (price `1`) and sell on day 4 (price `6`) for a profit of `5`. That's the best you can do.

## The brute-force approach (and why it's not enough)

The obvious idea: check every possible buy day paired with every later sell day, and keep the best difference.

```python
def max_profit_brute(prices):
    best = 0
    for buy in range(len(prices)):
        for sell in range(buy + 1, len(prices)):
            profit = prices[sell] - prices[buy]
            best = max(best, profit)
    return best
```

This works, but it's O(n&sup2;) — for every day, we scan every later day. With thousands of price points, that's slow.

## The one-pass approach

The key insight: for any given sell day, the best possible buy day is simply *the lowest price seen so far*. You never need to look back further than "the cheapest day up to now" — so instead of comparing every pair, walk through the prices once, tracking the running minimum and the best profit found relative to it.

```python
def max_profit(prices):
    min_price = float("inf")
    best_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        else:
            best_profit = max(best_profit, price - min_price)

    return best_profit
```

Walking through `[7, 1, 5, 3, 6, 4]`:

1. `price = 7` → new minimum, `min_price = 7`
2. `price = 1` → new minimum, `min_price = 1`
3. `price = 5` → profit `5 - 1 = 4`, `best_profit = 4`
4. `price = 3` → profit `3 - 1 = 2`, not better, `best_profit` stays `4`
5. `price = 6` → profit `6 - 1 = 5`, `best_profit = 5`
6. `price = 4` → profit `4 - 1 = 3`, not better, `best_profit` stays `5`

Final answer: `5` — matching the expected result, found in a single pass.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why this pattern matters beyond this one problem

"Track a running minimum (or maximum) as you scan once" is a classic greedy pattern — it shows up anytime the answer only depends on *the best value seen so far*, not on the full history of pairs. Spotting that you don't need to compare every pair, just the running best, is what turns an O(n&sup2;) brute force into O(n).

## Where to take it next

- Try **Best Time to Buy and Sell Stock II**, where you can make unlimited transactions
- Try **Best Time to Buy and Sell Stock with Cooldown**, which adds a state machine on top of this same idea
- Practice stating the greedy insight out loud before writing code — "the best buy day is always the minimum seen so far" — that's the sentence that actually gets remembered in an interview
