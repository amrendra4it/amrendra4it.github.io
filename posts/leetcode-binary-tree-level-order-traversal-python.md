---
layout: layouts/post.njk
title: "LeetCode 102. Binary Tree Level Order Traversal — Solution & Explanation (Python)"
dek: "BFS with a queue, processing one full level at a time."
date: 2026-08-21
readTime: "5 min read"
tags: [leetcode, python, trees, bfs]
problemNumber: 102
difficulty: Medium
---

*Original problem: [LeetCode #102 — Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary tree, return the values of its nodes grouped level by level, from top to bottom.

**Example:**
```
    3
   / \
  9  20
     / \
    15  7
```
→ `[[3], [9, 20], [15, 7]]`.

## Why breadth-first search fits naturally

Depth-first traversals (like the recursive tree problems so far) naturally go deep before they go wide — great for problems about paths or subtree structure, but awkward for "group by level," since you'd need extra bookkeeping to track which level you're on. Breadth-first search, using a queue, naturally processes nodes level by level, which maps directly onto what this problem asks for.

## The approach

Use a queue, but process it **one full level at a time**: before dequeuing anything, record how many nodes are currently in the queue — that count is exactly the size of the current level.

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)  # exactly how many nodes are in THIS level
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result
```

Walking through the example tree:

1. Queue starts as `[3]`. `level_size = 1`. Process `3`: add its value, enqueue children `9` and `20`. `result = [[3]]`.
2. Queue is now `[9, 20]`. `level_size = 2`. Process both: add their values, enqueue `20`'s children (`15`, `7`); `9` has no children. `result = [[3], [9, 20]]`.
3. Queue is now `[15, 7]`. `level_size = 2`. Process both, no further children to enqueue. `result = [[3], [9, 20], [15, 7]]`.
4. Queue is empty — loop ends.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## Why capturing `level_size` before the inner loop matters

If you looped over `queue` directly (or used `len(queue)` freshly on each inner iteration) instead of capturing it once beforehand, you'd process newly-enqueued children as part of the *same* level by mistake, since the queue's length keeps growing as you enqueue each node's children mid-loop. Snapshotting `level_size` first is what correctly separates one level from the next.

## Why this pattern matters beyond this one problem

This "queue + snapshot the level size" technique is the standard template for **every** level-by-level tree problem — Maximum Depth (iterative version, from earlier), Binary Tree Right Side View, Zigzag Level Order Traversal, and Average of Levels all reuse this exact loop structure, just changing what's recorded at each level.

## Where to take it next

- Try **Binary Tree Right Side View** next (below) — same level-order BFS, but only keeping the last value seen at each level
- Try **Binary Tree Zigzag Level Order Traversal**, which alternates the direction values are recorded in from level to level
- Try re-solving this with DFS instead, tracking depth as a parameter and appending to `result[depth]` — a good exercise in seeing that BFS isn't the *only* way to solve a level-based problem, just the most natural one
