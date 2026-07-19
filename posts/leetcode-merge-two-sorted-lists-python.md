---
layout: layouts/post.njk
title: "LeetCode 21. Merge Two Sorted Lists — Solution & Explanation (Python)"
dek: "A dummy node removes every annoying edge case from merging two lists."
date: 2026-08-09
readTime: "5 min read"
tags: [leetcode, python, linked-list]
problemNumber: 21
difficulty: Easy
---

*Original problem: [LeetCode #21 — Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the heads of two sorted linked lists, merge them into a single sorted linked list and return its head.

**Example:** `1 -> 2 -> 4` and `1 -> 3 -> 4` merge into `1 -> 1 -> 2 -> 3 -> 4 -> 4`.

## The approach: walk both lists, always taking the smaller front

This is very similar to the merge step of merge sort — compare the front of each list, attach the smaller one to the result, and advance only that list's pointer. Repeat until one list runs out, then attach whatever's left of the other.

## The dummy node trick

A common early stumbling block: the very first node of the merged list depends on which input list starts smaller, which means you'd normally need special-case logic just for the first node. The fix is to create a **dummy placeholder node** before the real head — you build the list after it, and simply skip over the dummy at the end. This removes every "is this the first node?" special case.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    dummy = ListNode()
    tail = dummy

    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next

    # Attach whatever's left — at most one of these has remaining nodes
    tail.next = list1 if list1 else list2

    return dummy.next  # skip the dummy, return the real head
```

Walking through `1 -> 2 -> 4` and `1 -> 3 -> 4`:

1. Compare `1` (list1) and `1` (list2). Equal, so `<=` takes list1's node. Attach `1` (from list1). `list1` advances to `2`.
2. Compare `2` (list1) and `1` (list2). `1` is smaller. Attach `1` (from list2). `list2` advances to `3`.
3. Compare `2` (list1) and `3` (list2). `2` is smaller. Attach `2`. `list1` advances to `4`.
4. Compare `4` (list1) and `3` (list2). `3` is smaller. Attach `3`. `list2` advances to `4`.
5. Compare `4` (list1) and `4` (list2). Equal, takes list1's node. Attach `4`. `list1` advances to `None`.
6. `list1` is now empty, loop ends. Attach whatever's left of `list2` (`4`) directly.

Result: `1 -> 1 -> 2 -> 3 -> 4 -> 4` — matching the expected output.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n + m)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

(n and m are the lengths of the two input lists — every node from both is visited exactly once, and no new nodes are allocated, only pointers are rewired.)

## Why the dummy node matters

Without it, you'd need an `if result is None` check every single time you attach a node, just to handle the very first attachment differently. The dummy node absorbs that special case for free — a small trick, but one that shows up constantly in linked list problems once you know to reach for it.

## Why this pattern matters beyond this one problem

"Compare two fronts, take the smaller, advance only that pointer" is the core of the merge step in merge sort — and the dummy-node trick generalizes to *any* linked-list-building problem where the first node isn't known in advance.

## Where to take it next

- Try **Merge K Sorted Lists** (planned later in the calendar) — this problem is the two-list building block that generalizes into that harder one
- Try re-solving this recursively instead of iteratively, and compare the space trade-off (recursion costs O(n + m) stack space here, unlike the O(1) iterative version)
- Practice using the dummy-node trick on **Remove Nth Node From End of List** — the same technique removes a similar edge case there
