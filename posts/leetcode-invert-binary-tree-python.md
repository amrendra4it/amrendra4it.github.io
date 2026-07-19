---
layout: layouts/post.njk
title: "LeetCode 226. Invert Binary Tree — Solution & Explanation (Python)"
dek: "The classic 'famous for being simple' interview question — swap every left and right child."
date: 2026-08-16
readTime: "4 min read"
tags: [leetcode, python, trees, recursion]
problemNumber: 226
difficulty: Easy
---

*Original problem: [LeetCode #226 — Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary tree, invert it — meaning every node's left and right children are swapped, all the way down the tree — and return the root.

**Example:**
```
     4                4
   /   \            /   \
  2     7    →     7     2
 / \   / \        / \   / \
1   3 6   9      9   6 3   1
```

## The recursive approach

The insight: inverting a tree means, for every node, swap its left and right children — and then make sure each of *those* subtrees is inverted too. That "do something, then recurse on the smaller pieces" shape is a textbook case for recursion.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root):
    if root is None:
        return None

    # Swap the children
    root.left, root.right = root.right, root.left

    # Recurse into both (now-swapped) subtrees
    invert_tree(root.left)
    invert_tree(root.right)

    return root
```

Walking through the example tree:

1. At root `4`: swap children → left is now `7`, right is now `2`.
2. Recurse into the new left subtree (originally rooted at `7`): swap its children (`6` and `9`) → becomes `9` and `6`.
3. Recurse into the new right subtree (originally rooted at `2`): swap its children (`1` and `3`) → becomes `3` and `1`.
4. Recursion bottoms out at the leaf nodes (`None` children), which simply return `None` immediately.

The result matches the mirrored tree shown above.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(h)</span></div>
</div>

(n = number of nodes, visited once each. h = tree height, for the recursion call stack — O(log n) for a balanced tree, O(n) for a completely skewed one.)

## The iterative alternative (using a queue or stack)

Recursion is the natural fit here, but it's worth knowing the iterative version too, since some environments (or interviewers) want to see you avoid recursion's call-stack depth:

```python
from collections import deque

def invert_tree_iterative(root):
    if root is None:
        return None

    queue = deque([root])

    while queue:
        node = queue.popleft()
        node.left, node.right = node.right, node.left

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return root
```

This produces the identical result, just processing nodes level by level with an explicit queue instead of the call stack doing it implicitly.

## Why this problem is famous

This became a well-known interview question less for its difficulty and more as a "can you actually write working recursive code under pressure" check — it's simple enough that there's nowhere to hide if the fundamentals (base case, recursive case) aren't solid.

## Where to take it next

- Try **Maximum Depth of Binary Tree** next (below) — same recursive tree shape, different thing being computed at each step
- Try **Same Tree**, which compares two trees recursively instead of transforming one
- Once the recursive version feels easy, implement the iterative version from scratch without looking at the code above — that's a good gut-check on whether you understand *why* it works, not just the recursive pattern
