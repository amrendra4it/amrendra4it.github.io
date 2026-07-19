---
layout: layouts/post.njk
title: "LeetCode 19. Remove Nth Node From End of List — Solution & Explanation (Python)"
dek: "One pass, not two — a fixed gap between two pointers finds the target without counting the list first."
date: 2026-08-13
readTime: "5 min read"
tags: [leetcode, python, linked-list, two-pointers]
problemNumber: 19
difficulty: Medium
---

*Original problem: [LeetCode #19 — Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the head of a linked list, remove the `n`-th node counting **from the end** of the list, and return the head.

**Example:** `1 -> 2 -> 3 -> 4 -> 5`, `n = 2` → remove the 2nd node from the end (`4`), leaving `1 -> 2 -> 3 -> 5`.

## The two-pass approach (simple, but not optimal)

Count the total length first, then walk again to the node just before the one you need to remove:

```python
def remove_nth_from_end_two_pass(head, n):
    length = 0
    node = head
    while node:
        length += 1
        node = node.next

    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(length - n):
        prev = prev.next

    prev.next = prev.next.next
    return dummy.next
```

This works, but it walks the list twice. There's a one-pass approach that's not much more complex.

## The one-pass approach: a fixed gap between two pointers

The idea: advance a `fast` pointer `n` steps ahead of `slow` first. From then on, move both one step at a time. When `fast` reaches the end, `slow` is sitting exactly `n` nodes from the end — precisely the node you need to remove (or, using a dummy node, the node just before it).

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy

    # Advance fast n+1 steps ahead, so slow lands on the node BEFORE the target
    for _ in range(n + 1):
        fast = fast.next

    while fast:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next
```

Walking through `1 -> 2 -> 3 -> 4 -> 5`, `n = 2`:

1. `dummy -> 1 -> 2 -> 3 -> 4 -> 5`. Advance `fast` by `n+1 = 3` steps: `fast` lands on node `3`.
2. Move both `slow` and `fast` one step at a time until `fast` is `None`:
   - `slow=1 (dummy.next), fast=4`
   - `slow=2, fast=5`
   - `slow=3, fast=None` → loop ends
3. `slow` (node `3`) is the node just before the target. `slow.next = slow.next.next` skips over node `4`, removing it.

Result: `1 -> 2 -> 3 -> 5` — matching the expected output, found in a single pass.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(L)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

(L = length of the list — one pass through it, instead of two.)

## Why the dummy node and the "+1" matter

The dummy node handles the edge case where the node to remove is the actual head (e.g. `n` equals the list's length) — without it, you'd need a separate check for "am I removing the head?" The `n + 1` (rather than just `n`) steps of head start is what correctly lands `slow` on the node *before* the target, which is what you actually need in order to relink `.next` and skip over it.

## Why this pattern matters beyond this one problem

"Maintain a fixed gap between two pointers" is a distinct linked-list trick from the fast/slow *speed* difference used in cycle detection — here both pointers move at the same speed, but starting positions differ by a fixed offset. That fixed-gap idea is the key to solving "distance from the end" problems in one pass instead of two.

## Where to take it next

- Try **Middle of the Linked List**, a simpler fast/slow (different-speed, not fixed-gap) warm-up if cycle detection didn't fully click yet
- Try **Copy List with Random Pointer** next (below) — a different linked-list challenge, this time about cloning rather than positional pointers
- Trace through the edge case `n` equal to the list length (removing the head) by hand to confirm the dummy node handles it correctly
