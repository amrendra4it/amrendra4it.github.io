---
layout: layouts/post.njk
title: "LeetCode 133. Copy List with Random Pointer — Solution & Explanation (Python)"
dek: "Cloning a list is easy — cloning one with pointers to arbitrary other nodes needs a map."
date: 2026-08-14
readTime: "6 min read"
tags: [leetcode, python, linked-list, hash-map]
problemNumber: 133
difficulty: Medium
---

*Original problem: [LeetCode #133 — Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Each node in this linked list has two pointers: a normal `next` pointer, and a `random` pointer that can point to *any* node in the list (or to `None`). Create a completely independent deep copy of the list — new nodes, with `next` and `random` pointers correctly mirroring the structure of the original.

## Why this is trickier than a normal list copy

Copying `next` pointers alone is easy — walk the list, create a new node for each, link them in order. The problem is `random`: by the time you're creating a new node, its `random` pointer might need to point to a node **later** in the list that you haven't created yet. You can't just copy the pointer directly, since it would point at the *original* list's node, not your new clone.

## The approach: a hash map from original node → cloned node

The fix: do it in two passes.

**Pass 1** — create a clone of every node (with `next` and `random` left empty for now), and record the mapping from each original node to its clone.

**Pass 2** — walk the original list again, and use the map to correctly wire up each clone's `next` and `random` pointers, since by now every clone already exists.

```python
class Node:
    def __init__(self, val, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    if not head:
        return None

    old_to_new = {}

    # Pass 1: create all the clone nodes
    current = head
    while current:
        old_to_new[current] = Node(current.val)
        current = current.next

    # Pass 2: wire up next and random pointers on the clones
    current = head
    while current:
        clone = old_to_new[current]
        clone.next = old_to_new.get(current.next)
        clone.random = old_to_new.get(current.random)
        current = current.next

    return old_to_new[head]
```

Walking through a small example — list `A -> B -> C`, where `A.random = C` and `B.random = None` and `C.random = A`:

**Pass 1:** create clones `A', B', C'`, and build the map: `{A: A', B: B', C: C'}`.

**Pass 2:**
- `A'.next = old_to_new[B] = B'`. `A'.random = old_to_new[C] = C'`.
- `B'.next = old_to_new[C] = C'`. `B'.random = old_to_new[None] = None` (dict `.get()` returns `None` safely here).
- `C'.next = old_to_new[None] = None`. `C'.random = old_to_new[A] = A'`.

The result is a fully independent clone — every clone's pointers point at other *clones*, never back at the original list's nodes.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## An O(1) extra-space alternative (worth knowing, rarely needed)

There's a classic trick to avoid the hash map: interleave each clone directly after its original node (`A -> A' -> B -> B' -> C -> C'`), which lets you find `original.random.next` to get the clone of the random target, then unweave the two lists afterward. It's a neat trick but noticeably harder to get right under interview pressure — the hash map version above is the one worth defaulting to unless you're specifically asked for constant extra space.

## Why this pattern matters beyond this one problem

"Map original references to new references before wiring up complex pointers" is the general technique behind deep-cloning any structure with non-linear references — graphs, trees with parent pointers, or any object graph with cross-references reuse this exact two-pass, map-first approach.

## Where to take it next

- Try **Clone Graph** (planned later in the calendar) — the exact same map-then-wire idea, applied to a graph instead of a linked list
- Try implementing the O(1)-space interleaving trick once the hash map version feels solid, purely as a exercise in careful pointer bookkeeping
- Think through what would break if you tried to wire up `random` pointers in a single pass instead of two — tracing that failure case is a good way to cement why the two-pass structure is necessary
