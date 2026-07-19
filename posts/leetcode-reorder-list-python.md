---
layout: layouts/post.njk
title: "LeetCode 143. Reorder List — Solution & Explanation (Python)"
dek: "Three linked-list skills combined into one: find the middle, reverse a half, merge two lists."
date: 2026-08-11
readTime: "7 min read"
tags: [leetcode, python, linked-list, two-pointers]
problemNumber: 143
difficulty: Medium
---

*Original problem: [LeetCode #143 — Reorder List](https://leetcode.com/problems/reorder-list/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Given a linked list `L0 -> L1 -> ... -> Ln`, reorder it in place to `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...` — alternating between the front and the back of the original list.

**Example:** `1 -> 2 -> 3 -> 4` becomes `1 -> 4 -> 2 -> 3`.

## Why this is really three problems in a trench coat

At first glance this looks like it needs a brand-new technique, but it actually just chains together three things you've likely already solved separately:

1. **Find the middle of the list** (fast/slow pointers, same idea as Linked List Cycle detection)
2. **Reverse the second half** (same technique as Reverse Linked List)
3. **Merge the two halves alternately** (same shape as Merge Two Sorted Lists, but alternating instead of comparing values)

Recognizing that a hard-looking problem decomposes into steps you already know is one of the most valuable interview skills — it's rarely about a totally new trick.

## Step 1: find the middle

```python
def find_middle(head):
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

For `1 -> 2 -> 3 -> 4`, this lands `slow` on node `2` — the natural split point for reordering (first half `1 -> 2`, second half `3 -> 4`).

## Step 2: reverse the second half

```python
def reverse(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
```

Splitting after the middle and reversing the second half of `1 -> 2 -> 3 -> 4` turns `3 -> 4` into `4 -> 3`.

## Step 3: merge the two halves alternately

```python
def merge_alternate(first, second):
    while second.next:
        first_next = first.next
        second_next = second.next

        first.next = second
        second.next = first_next

        first = first_next
        second = second_next
```

This walks both halves at once, splicing one node from `second` in after each node from `first`.

## Putting it all together

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head):
    if not head or not head.next:
        return

    # Step 1: find the middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # Split into two halves
    second = slow.next
    slow.next = None
    first = head

    # Step 2: reverse the second half
    prev = None
    current = second
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    second = prev

    # Step 3: merge alternately
    while second.next:
        first_next = first.next
        second_next = second.next

        first.next = second
        second.next = first_next

        first = first_next
        second = second_next
```

Walking through `1 -> 2 -> 3 -> 4`:

1. Middle found at `2`. Split: `first = 1 -> 2`, `second = 3 -> 4`.
2. Reverse `second`: now `4 -> 3`.
3. Merge alternately: `1.next = 4`, `4.next = 2` (saved before overwriting), `2.next = 3`, `3.next = None` (already, since it was the reversed tail).

Result: `1 -> 4 -> 2 -> 3` — matching the expected output.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(1)</span></div>
</div>

## Why this pattern matters beyond this one problem

Beyond the specific three techniques reused here, the bigger lesson is **decomposition**: when a linked-list problem looks unfamiliar, check whether it's a combination of "find a point," "reverse a section," and "merge/splice" — a huge fraction of medium-difficulty linked list problems are built from exactly these three primitives.

## Where to take it next

- Try **Palindrome Linked List**, which uses the same "find middle + reverse second half" combo, just for comparison instead of merging
- Try **Swap Nodes in Pairs**, a simpler splicing exercise using the same pointer-rewiring care
- Re-derive each of the three steps from scratch without looking at the code — if Reverse Linked List and Linked List Cycle both felt solid, this one should feel like assembly rather than new problem-solving
