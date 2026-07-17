# LeetCode solution posts — plan & rules

## The one hard rule: don't copy the problem statement

LeetCode's problem descriptions are their copyrighted text. For every post:

- **Paraphrase the problem** in your own words (see the Two Sum sample post
  for the pattern: a short "in plain terms" summary, not a copy-paste).
- **Always link to the original problem** on leetcode.com — this is good
  practice, sends a clear "not stolen content" signal to Google, and is the
  right thing to do.
- **Your solution, explanation, and code are 100% yours** — write those
  fully in your own words and your own code. This is also the actual reason
  people will read your post over just looking at the LeetCode discussion tab.
- Never copy solutions from LeetCode's official solution tab or other
  people's submitted solutions verbatim — write and test your own.

## Post template (copy `leetcode-two-sum-solution-python.md`)

Front matter fields to fill in for every post:
- `title`: "LeetCode [number]. [Name] — Solution & Explanation ([language])"
- `problemNumber`: the LeetCode problem number
- `difficulty`: Easy / Medium / Hard
- `tags`: always include `leetcode`, plus language and topic tags (e.g.
  `python`, `arrays`, `two-pointers`, `dynamic-programming`)

Body structure that works well:
1. One-line link + note that the problem is paraphrased
2. "The problem, in plain terms" — short paraphrase + one example
3. A naive/brute-force approach first (shows you understand *why* the
   better approach is better — this is also what makes these posts useful
   for interview prep, not just code-copying)
4. The optimal approach, explained step by step
5. A `complexity-box` (see the sample post's HTML) with time/space
6. "Where to take it next" — related problems or variations

## First 25 problems to cover

Picked for high, sustained search volume (classic interview questions people
search for by name repeatedly) and to build a natural topic spread across
patterns.

**Arrays & Hashing**
1. Two Sum (done — see sample post)
2. Best Time to Buy and Sell Stock
3. Contains Duplicate
4. Product of Array Except Self
5. Valid Anagram
6. Group Anagrams

**Two Pointers / Sliding Window**
7. Valid Palindrome
8. Longest Substring Without Repeating Characters
9. Container With Most Water
10. 3Sum

**Stack**
11. Valid Parentheses
12. Min Stack

**Binary Search**
13. Search in Rotated Sorted Array
14. Find Minimum in Rotated Sorted Array

**Linked List**
15. Reverse Linked List
16. Merge Two Sorted Lists
17. Linked List Cycle

**Trees**
18. Invert Binary Tree
19. Maximum Depth of Binary Tree
20. Same Tree
21. Binary Tree Level Order Traversal

**Dynamic Programming**
22. Climbing Stairs
23. House Robber
24. Longest Common Subsequence

**Graphs**
25. Number of Islands

## Why this content works well alongside your "build X" posts

LeetCode posts tend to get found via very specific, high-intent searches
("leetcode two sum python solution") — good for steady long-tail traffic —
while your build tutorials attract people earlier in their learning journey.
Together they cover someone's path from "learning to code" through
"prepping for interviews," which is good for repeat visits and internal
linking between the two sections.
