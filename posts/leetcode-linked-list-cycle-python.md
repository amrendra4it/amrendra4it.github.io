---
layout: layouts/post.njk
title: "LeetCode 141. Linked List Cycle — Solution & Explanation (Python)"
dek: "Floyd's tortoise and hare — why a slow and a fast pointer are guaranteed to meet."
date: 2026-08-10
readTime: "5 min read"
tags: [leetcode, python, linked-list, two-pointers]
problemNumber: 141
difficulty: Easy
---

*Original problem: [LeetCode #141 — Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the head of a linked list, determine whether it contains a cycle — meaning some node's `next` pointer eventually loops back to a node earlier in the list, rather than ending at `None`.

## The hash set approach (the obvious first idea)

Track every node you've visited; if you see one twice, there's a cycle.

```python
def has_cycle_hashset(head):
    seen = set()
    current = head

    while current:
        if current in seen:
            return True
        seen.add(current)
        current = current.next

    return False
```

This works and is O(n) time, but costs O(n) space to store every visited node. There's a neat trick that solves this in O(1) space instead.

## Floyd's tortoise and hare (the O(1) space approach)

Use two pointers moving at different speeds: a **slow** pointer that moves one step at a time, and a **fast** pointer that moves two steps at a time. If there's no cycle, the fast pointer simply reaches the end first. If there **is** a cycle, the fast pointer will eventually lap the slow pointer from behind and they'll land on the same node — guaranteed.

```python
def has_cycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False
```

## Why the two pointers are guaranteed to meet

Think of it like two runners on a circular track, one moving twice as fast as the other. The fast runner gains one extra step of ground on the slow runner every iteration. Since the gap between them shrinks by exactly one step each time (within the cycle), and the cycle has finite length, that gap must eventually hit zero — meaning they land on the exact same node. This isn't a coincidence specific to this problem; it's a guaranteed property of the setup, which is what makes this approach reliable rather than a lucky heuristic.

Walking through a list `1 -> 2 -> 3 -> 4 -> 2` (the last node points back to node `2`, forming a cycle):

1. `slow=1, fast=1`. Step: `slow=2, fast=3`.
2. Step: `slow=3, fast=2` (fast wrapped around the cycle back to node 2, then one more step to 3... following the actual pointers).
3. Continue stepping — since both pointers are now inside the cycle, the gap between them shrinks by one each round, until `slow == fast` at some node inside the loop, and `True` is returned.

If instead the list ended in `None` (no cycle), `fast` or `fast.next` would become `None` first, and the loop would exit with `False`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why this pattern matters beyond this one problem

Floyd's algorithm (also called the "tortoise and hare") is a specific instance of a broader "fast and slow pointer" pattern for linked lists — finding the middle of a list, detecting cycles, and finding the start of a cycle all use two pointers moving at different rates through the same structure.

## Where to take it next

- Try **Linked List Cycle II**, which asks you to find *where* the cycle begins, not just whether one exists — it extends this same two-pointer setup with one more phase
- Try **Happy Number**, a non-linked-list problem that uses the exact same cycle-detection idea on a sequence of numbers instead of nodes
- Try implementing the hash-set version first if the two-pointer trick doesn't click immediately — understanding *why* it works matters more than memorizing the code
