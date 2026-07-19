---
layout: layouts/post.njk
title: "LeetCode 572. Subtree of Another Tree — Solution & Explanation (Python)"
dek: "Reusing Same Tree as a helper, called at every node, is the whole solution."
date: 2026-08-20
readTime: "5 min read"
tags: [leetcode, python, trees, recursion]
problemNumber: 572
difficulty: Easy
---

*Original problem: [LeetCode #572 — Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the roots of two binary trees, `root` and `subRoot`, determine whether `subRoot` appears somewhere within `root` as an exact subtree — meaning some node in `root`, along with everything below it, matches `subRoot` structurally and by value.

## The key realization: this reuses Same Tree

The previous post's `is_same_tree` function checks whether two entire trees are identical. This problem asks a related but different question: "does `subRoot` match the tree rooted at *some node* within `root`?" The solution is to call `is_same_tree` at **every node** of `root`, checking if that node (and everything below it) matches `subRoot` exactly.

## The solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_same_tree(p, q):
    if p is None and q is None:
        return True
    if p is None or q is None:
        return False
    return (
        p.val == q.val
        and is_same_tree(p.left, q.left)
        and is_same_tree(p.right, q.right)
    )

def is_subtree(root, sub_root):
    if root is None:
        return False

    # Does the tree rooted HERE exactly match subRoot?
    if is_same_tree(root, sub_root):
        return True

    # If not, check if subRoot matches anywhere within either child subtree
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)
```

Walking through `root = [3, 4, 5, 1, 2]` (a tree with `4` and `5` as children of `3`, and `1`, `2` as children of `4`) and `sub_root = [4, 1, 2]`:

1. `is_subtree(3, [4,1,2])`: is `is_same_tree(3, [4,1,2])` true? No — `3.val (3) != 4`. So check the children instead.
2. `is_subtree(4, [4,1,2])`: is `is_same_tree(4, [4,1,2])` true? Compare node by node — `4 == 4`, then `1 == 1` and `2 == 2` for the children, both sides run out of nodes at the same points → `True`.
3. Since step 2 returned `True`, the `or` short-circuits and the overall answer is `True`.

If `root.left` (rooted at `4`) hadn't matched, the search would have continued into `root.right` (rooted at `5`) as well, before concluding `False` if nothing matched anywhere.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n &middot; m)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

(n = nodes in `root`, m = nodes in `sub_root` — in the worst case, `is_same_tree` is attempted at every node of `root`, and each attempt can cost up to O(m).)

## A faster approach for large trees (worth knowing, not always necessary)

For very large trees, you can speed this up by serializing both trees into strings (e.g. a pre-order traversal with explicit markers for `None` children) and checking if `sub_root`'s serialization is a substring of `root`'s — turning the problem into a string-matching problem, solvable in roughly O(n + m) with an efficient substring search algorithm. This is a nice example of *changing the representation of a problem* to unlock a different (often better) algorithm — but the direct recursive approach above is clearer and is the right default unless the tree sizes genuinely demand the optimization.

## Why this pattern matters beyond this one problem

"Call a whole-structure comparison function at every node of a larger structure" is a broadly reusable idea — pattern matching within trees, checking for a repeated sub-structure, and many "does X appear somewhere within Y" problems follow this same "check here, then recurse and check everywhere else" shape.

## Where to take it next

- Try **Same Tree** first if you haven't (it's the direct building block used here)
- Try the string-serialization approach described above as a follow-up exercise, once the recursive version feels solid
- Think about why checking `is_same_tree` at *every* node (rather than stopping at the first value match) is necessary — what could go wrong if you stopped as soon as you found a node with a matching value, without checking beneath it?
