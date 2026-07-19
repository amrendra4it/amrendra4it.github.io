---
layout: layouts/post.njk
title: "LeetCode 208. Implement Trie (Prefix Tree) — Solution & Explanation (Python)"
dek: "A tree where each path spells out a word, one character per edge — and prefix search falls out for free."
date: 2026-08-28
readTime: "7 min read"
tags: [leetcode, python, tries, design]
problemNumber: 208
difficulty: Medium
---

*Original problem: [LeetCode #208 — Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) (paraphrased below — solve the original there).*

## The problem, in plain terms

Implement a Trie (pronounced "try," short for retrieval tree) with:
- `insert(word)` — add a word to the trie
- `search(word)` — return `true` if the exact word exists in the trie
- `startsWith(prefix)` — return `true` if any word in the trie starts with the given prefix

## What a trie actually is

A trie is a tree where **each edge represents one character**, and a path from the root spells out a word (or prefix) as you follow it down. Words that share a common prefix share the same path for that prefix, then branch apart — this is exactly what makes prefix lookups fast, since you're literally just walking down a shared path.

For example, inserting `"cat"` and `"car"` produces a shared path `c -> a`, which then branches into `t` and `r`:

```
        c
        |
        a
       / \
      t   r
```

## The node structure

Each node needs: a map from character to child node, and a flag marking whether a word actually **ends** at this node (important — without this flag, you couldn't distinguish "cat" being a real inserted word from "cat" just being a prefix of something longer, like "catalog").

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
```

## Insert

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
```

Walking through inserting `"cat"`: start at `root`, create (or reuse) a child for `c`, move into it; create/reuse a child for `a`, move into it; create/reuse a child for `t`, move into it; mark that final `t` node's `is_end_of_word = True`.

## Search (exact word)

```python
    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end_of_word

    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

`search` walks the same way `insert` does, but instead of creating missing nodes, it returns `None` the moment a required character isn't present — and critically, it also checks `is_end_of_word`, since reaching the end of the path only means the *prefix* exists, not necessarily that a full word was inserted ending exactly there.

## startsWith (prefix check)

```python
    def starts_with(self, prefix):
        return self._find_node(prefix) is not None
```

This reuses the exact same `_find_node` helper as `search` — the only difference is that `startsWith` doesn't care about the `is_end_of_word` flag, since any path existing at all is enough to confirm the prefix is present somewhere in the trie.

## Walking through an example

```python
trie = Trie()
trie.insert("cat")
trie.insert("car")

trie.search("cat")       # True — full path exists, ends there
trie.search("ca")        # False — path exists, but nothing was inserted ending exactly at "ca"
trie.starts_with("ca")   # True — the path "c -> a" exists, regardless of where words end
trie.starts_with("dog")  # False — "d" isn't even a child of the root
```

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(L) per operation</span></div>
  <div><span class="label">Space</span><span class="value">O(total characters stored)</span></div>
</div>

(L = length of the word/prefix involved in a given operation — each operation walks exactly one character-path, independent of how many other words are in the trie.)

## Why this pattern matters beyond this one problem

Tries are the standard structure anytime prefix matching matters at scale: autocomplete, spell-checkers, IP routing tables, and dictionary-based word games (like Word Search II, coming up in the calendar) all build directly on this same node-with-children-map structure.

## Where to take it next

- Try **Word Search II**, which uses a trie to make searching for many words in a grid dramatically faster than searching for each word independently
- Try **Add and Search Word** (planned later), which extends this trie with wildcard character support
- Try adding a `delete(word)` method — trickier than it looks, since you need to avoid deleting nodes that are still part of *other* words' paths
