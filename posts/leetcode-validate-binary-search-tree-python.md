---
layout: layouts/post.njk
title: "LeetCode 98. Validate Binary Search Tree — Solution & Explanation (Python)"
dek: "Why checking only a node's immediate children isn't enough — and what range-passing fixes."
date: 2026-08-24
readTime: "6 min read"
tags: [leetcode, python, trees, binary-search-tree]
problemNumber: 98
difficulty: Medium
---

*Original problem: [LeetCode #98 — Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary tree, determine whether it's a valid binary search tree (BST) — meaning, for every node, all values in its left subtree are smaller, and all values in its right subtree are larger.

## The tempting but wrong approach

It's tempting to just check each node against its immediate children: `left.val < node.val < right.val`. This is **not sufficient**. Consider:

```
      5
     / \
    1   8
       / \
      6   9
```

Every node individually satisfies "left child smaller, right child larger" — but `6` is in the right subtree of `5`, meaning it needs to be **greater than 5**, which it is, so this particular example is fine. The real problem case looks like this instead:

```
      5
     / \
    1   8
       / \
      4   9
```

Here, `4` is smaller than its immediate parent `8` (which passes a local-only check), but `4` is in the right subtree of `5` — meaning it needs to be greater than `5`, and it isn't. A node has to satisfy constraints from **every ancestor above it**, not just its direct parent.

## The fix: pass down a valid range at each step

Instead of comparing only to immediate children, carry a `(low, high)` range down through the recursion. Every node must fall strictly within its current range; when recursing into a left child, tighten the upper bound to the current node's value; when recursing right, tighten the lower bound.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root):
    def validate(node, low, high):
        if node is None:
            return True

        if not (low < node.val < high):
            return False

        return (
            validate(node.left, low, node.val)
            and validate(node.right, node.val, high)
        )

    return validate(root, float("-inf"), float("inf"))
```

Walking through the invalid example above (`5` at root, `8` with children `4` and `9`):

1. `validate(5, -inf, inf)`: `5` is within range. Recurse left with `(-inf, 5)`, recurse right with `(5, inf)`.
2. Left: `validate(1, -inf, 5)`: `1` is within range, no children, `True`.
3. Right: `validate(8, 5, inf)`: `8` is within range. Recurse left with `(5, 8)`, recurse right with `(8, inf)`.
4. `validate(4, 5, 8)`: is `5 < 4 < 8`? **No** — `4` is not greater than `5`. Return `False` immediately.
5. The `False` propagates all the way up through the `and` chain, making the overall result `False` — correctly catching the violation that a local-only check would have missed.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(h)</span></div>
</div>

## An alternative: in-order traversal should be sorted

A different, equally valid approach: a BST's **in-order traversal** (left, node, right) visits nodes in strictly increasing order if and only if the tree is a valid BST. So you can traverse in-order and simply check that each value is greater than the previous one:

```python
def is_valid_bst_inorder(root):
    prev = [float("-inf")]

    def inorder(node):
        if node is None:
            return True
        if not inorder(node.left):
            return False
        if node.val <= prev[0]:
            return False
        prev[0] = node.val
        return inorder(node.right)

    return inorder(root)
```

Both approaches are O(n) — the range-passing version directly encodes the BST *definition*, while the in-order version relies on a *property* of BSTs. Either is a reasonable default; understanding both deepens your grasp of what actually makes a BST valid.

## Why this pattern matters beyond this one problem

"Pass down accumulated constraints through recursion, rather than only checking local relationships" is a pattern that generalizes well beyond BSTs — anytime a valid answer depends on a chain of ancestor constraints (not just an immediate neighbor), consider threading that context downward as extra function parameters.

## Where to take it next

- Try **Kth Smallest Element in a BST** next (below) — it uses the in-order traversal property from this problem directly
- Try **Recover Binary Search Tree**, which asks you to *fix* a BST where exactly two nodes were swapped, building on this same validation logic
- Trace through a tree using `float("-inf")`/`float("inf")` boundaries by hand — seeing exactly how the range tightens on each recursive call is the part that makes this approach click
