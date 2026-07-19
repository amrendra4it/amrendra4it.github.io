---
layout: layouts/post.njk
title: "LeetCode 199. Binary Tree Right Side View — Solution & Explanation (Python)"
dek: "Same level-order BFS as before — just keep the last node you see at each level."
date: 2026-08-22
readTime: "4 min read"
tags: [leetcode, python, trees, bfs]
problemNumber: 199
difficulty: Medium
---

*Original problem: [LeetCode #199 — Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary tree, imagine standing to the right of it and looking at it from the side — return the values of the nodes you'd be able to see, top to bottom (i.e., the rightmost node at each level).

**Example:**
```
    1
   / \
  2   3
   \   \
    5   4
```
→ `[1, 3, 4]`.

## The insight: this is Level Order Traversal, with one small change

Standing to the right and looking at each level, the node you see is simply the **last** node processed at that level (moving left to right). This is exactly the same level-order BFS from the previous post — just keep the last value at each level instead of the whole list.

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def right_side_view(root):
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)

        for i in range(level_size):
            node = queue.popleft()

            # The last node processed in this level is the rightmost visible one
            if i == level_size - 1:
                result.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return result
```

Walking through the example tree:

1. Level 0: queue `[1]`, size 1. Process `1` — it's the last (only) node in this level, so append `1`. Enqueue children `2`, `3`.
2. Level 1: queue `[2, 3]`, size 2. Process `2` (not last, skip). Process `3` (last) — append `3`. Enqueue `2`'s child `5` and `3`'s child `4`.
3. Level 2: queue `[5, 4]`, size 2. Process `5` (not last, skip). Process `4` (last) — append `4`.

Result: `[1, 3, 4]` — matching the expected right-side view.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## An alternative: DFS, always visiting right before left

A different but equally valid approach: do a depth-first traversal that always explores the **right child first**, and record a node's value only the first time you reach a given depth. Since right is explored before left, the first node reached at each depth is guaranteed to be the rightmost one.

```python
def right_side_view_dfs(root):
    result = []

    def dfs(node, depth):
        if node is None:
            return
        if depth == len(result):
            result.append(node.val)
        dfs(node.right, depth + 1)  # right first
        dfs(node.left, depth + 1)

    dfs(root, 0)
    return result
```

Both approaches are O(n) — which one feels more natural often comes down to whether you're already thinking in terms of levels (BFS) or paths (DFS) for a given problem.

## Why this pattern matters beyond this one problem

"Track only the first or last element encountered at each level/depth" is a small but reusable variation on level-order traversal — it shows up any time a problem asks about *boundaries* of a tree (leftmost/rightmost nodes, or values visible from a particular side).

## Where to take it next

- Try **Binary Tree Left Side View** as a direct mirror-image exercise (either flip the "last" check, or explore left-before-right in the DFS version)
- Try **Average of Levels in Binary Tree**, a different modification of the same level-order BFS template
- Compare the BFS and DFS solutions above side by side — same result, genuinely different mental models for getting there
