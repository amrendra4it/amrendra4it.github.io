---
layout: layouts/post.njk
title: "LeetCode 100. Same Tree — Solution & Explanation (Python)"
dek: "Structural equality, checked recursively — nodes must match in value and shape, at every level."
date: 2026-08-19
readTime: "4 min read"
tags: [leetcode, python, trees, recursion]
problemNumber: 100
difficulty: Easy
---

*Original problem: [LeetCode #100 — Same Tree](https://leetcode.com/problems/same-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the roots of two binary trees, determine if they're identical — same structure, and the same value at every corresponding node.

## The recursive approach

Two trees are the same if:
1. Both roots are `None` (both empty — trivially equal), **or**
2. Both roots exist, have the **same value**, **and** their left subtrees are the same, **and** their right subtrees are the same.

Any other combination (one is `None` and the other isn't, or the values differ) means they're not the same.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_same_tree(p, q):
    # Both empty — equal
    if p is None and q is None:
        return True

    # One empty, one not — not equal
    if p is None or q is None:
        return False

    # Both exist — check value and recurse into both subtrees
    return (
        p.val == q.val
        and is_same_tree(p.left, q.left)
        and is_same_tree(p.right, q.right)
    )
```

Walking through two small trees, `p = [1, 2, 3]` and `q = [1, 2, 3]` (both shaped `1` with children `2` and `3`):

1. `is_same_tree(1, 1)`: neither is `None`. Values match (`1 == 1`). Recurse into left (`2` vs `2`) and right (`3` vs `3`).
2. `is_same_tree(2, 2)`: both leaves, values match, both children are `None` on both sides → `True`.
3. `is_same_tree(3, 3)`: same reasoning → `True`.
4. Root's check: `True and True and True` → `True`.

If instead `q`'s right child were `4` instead of `3`, step 3 would compare `3 != 4` and immediately return `False`, which propagates up through the `and` chain to make the whole result `False`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(min(n, m))</span></div>
  <div><span class="label">Space</span><span class="value">O(min(h1, h2))</span></div>
</div>

(The comparison can short-circuit and stop early the moment a mismatch is found, so in the worst case it's bounded by the smaller of the two trees' sizes; the space is bounded by the smaller tree's height, for the recursion stack.)

## Why the two `None` checks need to be separate

It's tempting to combine `p is None and q is None` and `p is None or q is None` into one clever condition, but keeping them as two explicit checks makes the logic considerably easier to read and to get right — this is a case where slightly more verbose code is the better choice, not a shortcut worth taking.

## Why this pattern matters beyond this one problem

This is the standard shape for any "compare two trees structurally" problem — the same three-part check (both empty, one empty, both exist and match) reappears in Subtree of Another Tree, Symmetric Tree, and Flatten Binary Tree to Linked List, among others.

## Where to take it next

- Try **Subtree of Another Tree** next (below) — it uses this exact function as a helper, called at every node of a larger tree
- Try **Symmetric Tree**, which compares a tree against its own mirror image using a very similar recursive shape
- Try writing the iterative version using a stack of paired nodes `(p_node, q_node)` — a good exercise in translating this recursive comparison into an explicit stack-based walk
