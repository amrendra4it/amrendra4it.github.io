---
layout: layouts/post.njk
title: "LeetCode 206. Reverse Linked List — Solution & Explanation (Python)"
dek: "Three pointers, one pass — the building block for nearly every other linked list problem."
date: 2026-08-08
readTime: "5 min read"
tags: [leetcode, python, linked-list]
problemNumber: 206
difficulty: Easy
---

*Original problem: [LeetCode #206 — Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given the head of a singly linked list, reverse it and return the new head.

**Example:** `1 -> 2 -> 3 -> 4 -> 5` becomes `5 -> 4 -> 3 -> 2 -> 1`.

## Why you can't just "reverse" it like a list

With a Python list, `nums[::-1]` works because you have random access to every element. A linked list only gives you a `next` pointer from each node — to reverse it, you have to walk through once, flipping each node's `next` pointer to point backward instead of forward as you go.

## The iterative approach: three pointers

The core idea: keep track of the **previous** node, the **current** node, and (temporarily) the **next** node, so that flipping `current.next` to point at `previous` doesn't lose your place in the original list.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    current = head

    while current:
        next_node = current.next   # save the next node before we overwrite the pointer
        current.next = prev        # reverse the pointer
        prev = current              # move prev forward
        current = next_node         # move current forward

    return prev  # prev is now the new head
```

Walking through `1 -> 2 -> 3`:

1. `prev=None, current=1`. Save `next_node=2`. Set `1.next = None` (flips it to point backward, to nothing). `prev=1, current=2`.
2. `prev=1, current=2`. Save `next_node=3`. Set `2.next = 1` (points back to the previous node). `prev=2, current=3`.
3. `prev=2, current=3`. Save `next_node=None`. Set `3.next = 2`. `prev=3, current=None`.
4. Loop ends (`current` is `None`). Return `prev`, which is `3` — the new head, and following `.next` pointers now gives `3 -> 2 -> 1`.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## The recursive approach (for comparison)

```python
def reverse_list_recursive(head):
    if head is None or head.next is None:
        return head

    new_head = reverse_list_recursive(head.next)
    head.next.next = head  # make the next node point back to this one
    head.next = None       # clear this node's forward pointer

    return new_head
```

This recurses all the way to the last node first (which becomes `new_head`), then, as the recursion unwinds, each node fixes its neighbor's pointer to point backward. It's elegant, but costs O(n) space for the call stack, compared to the iterative version's O(1) — worth knowing both, but the iterative version is generally preferred in practice for exactly that reason.

## Why this pattern matters beyond this one problem

The "prev / current / next" three-pointer walk is the single most reused technique in linked list problems — reversing sublists, detecting cycles, and reordering lists all build on some variation of carefully tracking a node's neighbors while you rewire pointers.

## Where to take it next

- Try **Reverse Linked List II**, which reverses only a sublist between two given positions
- Try **Merge Two Sorted Lists** next (below) — a different pointer-manipulation problem, but the same comfort with `.next` pointers carries over directly
- Draw the pointers on paper for a 4-5 node list before coding — linked list problems are much easier once you can see the pointer rewiring visually
