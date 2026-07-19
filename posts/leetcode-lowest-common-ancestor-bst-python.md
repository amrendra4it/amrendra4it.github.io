---
layout: layouts/post.njk
title: "LeetCode 235. Lowest Common Ancestor of a BST — Solution & Explanation (Python)"
dek: "The BST's ordering property tells you which direction to go — no need to search both subtrees."
date: 2026-08-27
readTime: "5 min read"
tags: [leetcode, python, trees, binary-search-tree]
problemNumber: 235
difficulty: Medium
---

*Original problem: [LeetCode #235 — Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a binary search tree and two nodes `p` and `q` that both exist in it, find their lowest common ancestor (LCA) — the deepest node that has both `p` and `q` as descendants (a node can be its own descendant, for this problem's purposes).

**Example:**
```
        6
       / \
      2   8
     / \  / \
    0  4 7   9
      / \
     3   5
```
LCA of `2` and `8` is `6`. LCA of `2` and `4` is `2` (since a node can be an ancestor of itself).

## Why a BST makes this easier than a general tree

In a general binary tree, finding the LCA requires searching both subtrees at every node, since there's no ordering to rely on. A **BST's ordering property gives you a shortcut**: at any node, you can tell which direction to go just by comparing values — no need to search both sides.

- If both `p` and `q` are **smaller** than the current node, the LCA must be somewhere in the **left** subtree.
- If both are **larger**, the LCA must be in the **right** subtree.
- Otherwise (one is smaller and one is larger, or one equals the current node), the current node **is** the LCA — this is the exact point where the two nodes' paths diverge, or where one of them *is* the current node.

## The solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root, p, q):
    current = root

    while current:
        if p.val < current.val and q.val < current.val:
            current = current.left
        elif p.val > current.val and q.val > current.val:
            current = current.right
        else:
            return current
```

Walking through finding the LCA of `2` and `8` in the example tree:

1. `current = 6`. Is `2 < 6` and `8 < 6`? No (`8` is not less than `6`). Is `2 > 6` and `8 > 6`? No (`2` is not greater than `6`). Neither condition holds — this is the divergence point. Return `6`.

Now finding the LCA of `0` and `5`:

1. `current = 6`. Both `0 < 6` and `5 < 6` → go left. `current = 2`.
2. `current = 2`. Is `0 < 2` and `5 < 2`? No (`5` is not less than `2`). Is `0 > 2` and `5 > 2`? No (`0` is not greater than `2`). Neither holds — return `2`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(h)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

(h = tree height — O(log n) for a balanced BST, O(n) worst case for a completely skewed one. The iterative version above uses no extra space at all, unlike a recursive approach which would cost O(h) for the call stack.)

## Why this doesn't work the same way for a general binary tree

This shortcut relies entirely on the BST ordering property. **Lowest Common Ancestor of a Binary Tree** (a related, harder problem) can't compare values to decide direction, since a general tree has no ordering guarantee — that version needs to actually search both subtrees at each node and combine the results, which is a meaningfully different (and more expensive) approach.

## Why this pattern matters beyond this one problem

"Use the BST's ordering to decide direction, rather than searching exhaustively" is the same idea behind BST search, insertion, and deletion — anytime you're navigating a BST, comparing the target value(s) against the current node should always tell you which single direction to go, never both.

## Where to take it next

- Try **Lowest Common Ancestor of a Binary Tree** as a contrast — same problem statement, but without the BST guarantee, requiring full recursive search of both subtrees
- Try **Insert into a Binary Search Tree**, which uses this exact same "compare and go one direction" navigation
- Trace through a case where `p` is an ancestor of `q` (like the `2`/`4` example above) to confirm your solution correctly returns `p` itself as the answer, not an error
