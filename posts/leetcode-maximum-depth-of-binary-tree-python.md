---
layout: layouts/post.njk
title: "LeetCode 104. Maximum Depth of Binary Tree — Solution & Explanation (Python)"
dek: "The simplest possible recursive tree problem — and a good template for every one that follows."
date: 2026-08-17
readTime: "4 min read"
tags: [leetcode, python, trees, recursion]
problemNumber: 104
difficulty: Easy
---

*Original problem: [LeetCode #104 — Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary tree, find its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf.

**Example:**
```
    3
   / \
  9  20
     / \
    15  7
```
Maximum depth is `3` (path `3 -> 20 -> 15`, or `3 -> 20 -> 7`).

## The recursive approach

The depth of a tree rooted at any node is: `1` (for the node itself) `+` the depth of its **deeper** child subtree. That's a definition that directly translates into a recursive function.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root):
    if root is None:
        return 0

    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)

    return 1 + max(left_depth, right_depth)
```

Walking through the example tree:

1. `max_depth(3)` calls `max_depth(9)` and `max_depth(20)`.
2. `max_depth(9)`: both children are `None`, so both recursive calls return `0`. Result: `1 + max(0, 0) = 1`.
3. `max_depth(20)` calls `max_depth(15)` and `max_depth(7)`, both leaves → each returns `1` (same logic as node `9` above). Result: `1 + max(1, 1) = 2`.
4. Back at the root: `1 + max(1, 2) = 3`.

Final answer: `3`, matching the expected depth.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(h)</span></div>
</div>

(n = number of nodes, each visited once. h = tree height, for the recursion call stack.)

## The iterative alternative: level-order traversal (BFS)

Since "depth" is really "how many levels does this tree have," a breadth-first traversal that counts levels works just as naturally:

```python
from collections import deque

def max_depth_iterative(root):
    if root is None:
        return 0

    queue = deque([root])
    depth = 0

    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return depth
```

Each pass through the `for _ in range(len(queue))` loop processes exactly one full level of the tree before moving to the next, so `depth` ends up counting the number of levels — same answer, different traversal order.

## Why this problem is a good template

The recursive shape here — handle the base case (`None` → `0`), recurse into both children, combine the results — is the exact skeleton used across nearly every binary tree problem: Invert Binary Tree, Same Tree, Balanced Binary Tree, Diameter of Binary Tree, and many others all follow this same "base case, recurse both sides, combine" structure, just changing what gets combined and how.

## Where to take it next

- Try **Balanced Binary Tree**, which builds directly on this depth calculation, adding a check at each node
- Try **Diameter of Binary Tree**, which computes something related but subtly different — the longest path doesn't have to pass through the root
- Try **Binary Tree Level Order Traversal** (below) — same BFS shape as the iterative version here, but collecting each level's values instead of just counting them
