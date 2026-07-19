---
layout: layouts/post.njk
title: "LeetCode 150. Evaluate Reverse Polish Notation — Solution & Explanation (Python)"
dek: "Why postfix notation makes a calculator's logic radically simpler with a stack."
date: 2026-07-30
readTime: "5 min read"
tags: [leetcode, python, stack]
problemNumber: 150
difficulty: Medium
---

*Original problem: [LeetCode #150 — Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) (paraphrased below — solve the original there).*

## The problem, in plain terms

You're given a list of tokens representing an arithmetic expression in **Reverse Polish Notation (RPN)** — also called postfix notation, where operators come *after* their operands instead of between them. Evaluate the expression and return the result.

**Example:** `["2", "1", "+", "3", "*"]` represents `(2 + 1) * 3`, which evaluates to `9`.

## Why postfix notation is actually easier to evaluate

Normal ("infix") expressions like `2 + 1 * 3` need operator precedence rules (multiplication before addition) and often parentheses to be unambiguous. Postfix notation removes all of that ambiguity — by the time you reach an operator, its operands are already right in front of it. That structure maps directly onto a stack: push numbers, and when you hit an operator, pop the two most recent numbers, apply the operator, and push the result back.

## The solution

```python
def eval_rpn(tokens):
    stack = []
    operators = {"+", "-", "*", "/"}

    for token in tokens:
        if token in operators:
            b = stack.pop()  # second operand (pushed most recently)
            a = stack.pop()  # first operand

            if token == "+":
                stack.append(a + b)
            elif token == "-":
                stack.append(a - b)
            elif token == "*":
                stack.append(a * b)
            elif token == "/":
                # Truncate toward zero, matching the problem's rules
                # (Python's // rounds toward negative infinity, which differs for negative results)
                stack.append(int(a / b))
        else:
            stack.append(int(token))

    return stack[0]
```

Walking through `["2", "1", "+", "3", "*"]`:

1. `"2"` → number, push. Stack: `[2]`
2. `"1"` → number, push. Stack: `[2, 1]`
3. `"+"` → operator. Pop `1` (b), pop `2` (a). `2 + 1 = 3`. Push. Stack: `[3]`
4. `"3"` → number, push. Stack: `[3, 3]`
5. `"*"` → operator. Pop `3` (b), pop `3` (a). `3 * 3 = 9`. Push. Stack: `[9]`

Only one value left on the stack: `9` — the final answer.

## The one subtle bug to watch for: operand order in subtraction and division

Since `stack.pop()` returns the **most recently pushed** value first, that popped value is the *second* operand (`b`), not the first. Getting `a` and `b` backwards silently breaks subtraction and division (though not addition or multiplication, which is exactly why this bug can slip through casual testing) — `a - b` and `b - a` give different results, so the pop order has to be tracked carefully.

<div class="complexity-box">
  <div><span class="label">Time</span><span class="value">O(n)</span></div>
  <div><span class="label">Space</span><span class="value">O(n)</span></div>
</div>

## Why this pattern matters beyond this one problem

RPN evaluation is the classic demonstration of why stacks suit "process operands, then apply an operation to the most recent ones" workflows — the same core idea shows up in expression parsers, calculators, and compilers, where postfix (or an equivalent intermediate representation) is often used internally specifically because it's this easy to evaluate mechanically.

## Where to take it next

- Try **Basic Calculator**, which goes the other direction — parsing a normal infix expression (with parentheses) rather than evaluating pre-converted postfix
- Try writing a converter from infix to postfix (the "Shunting Yard" algorithm) to see how the two directions connect
- This connects directly to the "build a mini interpreter" series planned for later in the year — RPN evaluation is effectively the last step of a simple expression interpreter
