---
layout: layouts/post.njk
title: "LeetCode 230. Kth Smallest Element in a BST — Solution & Explanation (Python)"
dek: "In-order traversal visits a BST in sorted order for free — just count as you go."
date: 2026-08-25
readTime: "5 min read"
tags: [leetcode, python, trees, binary-search-tree]
problemNumber: 230
difficulty: Medium
---

*Original problem: [LeetCode #230 — Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the root of a binary search tree and an integer `k`, return the `k`-th smallest value in the tree (1-indexed).

**Example:**
```
      5
     / \
    3   6
   / \
  2   4
```
With `k = 3`, the answer is `4` (the sorted order is `2, 3, 4, 5, 6`, and the 3rd value is `4`).

## Why this connects directly to the previous post

Validate Binary Search Tree showed that an **in-order traversal of a BST visits nodes in strictly increasing order**. That property directly solves this problem: do an in-order traversal, and simply stop at the `k`-th value visited.

## The straightforward approach: collect everything, then index

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kth_smallest_simple(root, k):
    values = []

    def inorder(node):
        if node is None:
            return
        inorder(node.left)
        values.append(node.val)
        inorder(node.right)

    inorder(root)
    return values[k - 1]
```

This works, but it visits and stores *every* node, even if `k` is small and the tree is large — more work than necessary.

## The better approach: stop early once you've found it

Instead of collecting every value, keep a running count and return as soon as you've visited the `k`-th node — no need to traverse the rest of the tree.

```python
def kth_smallest(root, k):
    count = 0
    result = None

    def inorder(node):
        nonlocal count, result
        if node is None or result is not None:
            return  # already found it, or nothing here — stop exploring

        inorder(node.left)

        if result is not None:
            return  # found during the left subtree — don't keep going

        count += 1
        if count == k:
            result = node.val
            return

        inorder(node.right)

    inorder(root)
    return result
```

Walking through the example tree with `k = 3`:

1. `inorder(5)` → recurse left into `3` first (in-order visits left before the node itself).
2. `inorder(3)` → recurse left into `2` first.
3. `inorder(2)` → no left child. `count = 1`. Not `k` yet. No right child. Return.
4. Back at `3`: `count = 2`. Not `k` yet. Recurse right into `4`.
5. `inorder(4)`: no left child. `count = 3`. **Matches `k`!** Set `result = 4`, return immediately — no further recursion happens.
6. The checks after each recursive call (`if result is not None: return`) prevent unwinding back up and continuing into `5`'s right subtree (`6`), since the answer's already been found.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(h + k)</span></div>
  <div><span class="label">Space</span><span class="value">O(h)</span></div>
</div>

(h = tree height, for reaching the leftmost node initially; k = number of nodes visited before stopping. In the worst case this is O(n), but for small `k` on a large tree, it's much better than visiting every node.)

## An iterative version using an explicit stack

Some environments prefer avoiding recursion depth concerns. An iterative in-order traversal using a stack achieves the same early-stopping behavior:

```python
def kth_smallest_iterative(root, k):
    stack = []
    current = root

    while stack or current:
        while current:
            stack.append(current)
            current = current.left

        current = stack.pop()
        k -= 1
        if k == 0:
            return current.val

        current = current.right
```

## Why this pattern matters beyond this one problem

"In-order traversal of a BST equals sorted order" is one of the most useful BST facts to have memorized — it turns problems about rank, order statistics, or sortedness within a BST into straightforward traversal problems, rather than needing to convert to an array first.

## Where to take it next

- Try **Kth Largest Element in an Array** (later in the calendar) for a contrasting problem — same "k-th element" idea, but without a BST's structure to exploit, requiring a different technique (a heap)
- Try modifying this solution to find the k-th **largest** instead, by reversing the traversal order (right, node, left)
- Consider the follow-up often asked with this problem: what if the BST is modified frequently (insertions/deletions) and `kth_smallest` is called often? (Hint: augmenting each node with a subtree size count avoids re-traversing from scratch every time.)
