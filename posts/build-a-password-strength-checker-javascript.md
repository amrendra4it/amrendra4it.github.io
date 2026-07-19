---
layout: layouts/post.njk
title: "Build a Password Strength Checker (JavaScript, Runs in the Browser)"
dek: "Real-time feedback using regex rules and a simple scoring system — no libraries needed."
date: 2026-07-26
readTime: "6 min read"
tags: [javascript, frontend, regex]
---

Password strength meters show up on nearly every signup form. Building one yourself is a great small project for practicing regex and real-time DOM updates.

## What we're building

A text input that, as you type, shows:
- A strength label (Weak / Fair / Good / Strong)
- A colored strength bar
- Which specific rules are met or missing

## The HTML

```html
<input type="password" id="pwd" placeholder="Enter a password" />
<div id="bar-container">
  <div id="bar"></div>
</div>
<p id="label"></p>
<ul id="rules"></ul>
```

## The scoring rules

We'll check five independent conditions, each worth one point:

```javascript
const rules = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one number", test: (pw) => /[0-9]/.test(pw) },
  { label: "At least one symbol (!@#$...)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];
```

Keeping each rule as `{ label, test }` pairs (rather than one big regex) makes it easy to show the user exactly *which* requirement they're missing, not just an overall score.

## Scoring and displaying

```javascript
const input = document.getElementById("pwd");
const bar = document.getElementById("bar");
const label = document.getElementById("label");
const rulesList = document.getElementById("rules");

const strengthLevels = [
  { label: "Weak", color: "#e74c3c" },
  { label: "Fair", color: "#e67e22" },
  { label: "Good", color: "#f1c40f" },
  { label: "Strong", color: "#27ae60" },
];

function updateStrength() {
  const pw = input.value;
  const results = rules.map((rule) => ({ ...rule, passed: rule.test(pw) }));
  const score = results.filter((r) => r.passed).length;

  // Map a 0-5 score onto our 4 strength levels
  const levelIndex = Math.min(
    Math.floor((score / rules.length) * strengthLevels.length),
    strengthLevels.length - 1
  );
  const level = pw.length === 0 ? null : strengthLevels[levelIndex];

  bar.style.width = `${(score / rules.length) * 100}%`;
  bar.style.background = level ? level.color : "#ddd";
  label.textContent = level ? `Strength: ${level.label}` : "";

  rulesList.innerHTML = results
    .map(
      (r) =>
        `<li style="color: ${r.passed ? "#27ae60" : "#999"}">
          ${r.passed ? "✓" : "○"} ${r.label}
        </li>`
    )
    .join("");
}

input.addEventListener("input", updateStrength);
updateStrength(); // initialize empty state
```

## The CSS (minimal, just enough to see it working)

```css
#bar-container {
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}
#bar {
  height: 100%;
  width: 0%;
  transition: width 0.2s ease, background 0.2s ease;
}
ul#rules {
  list-style: none;
  padding: 0;
  font-size: 0.9em;
}
```

## Try it

Save the HTML, CSS, and JS together (or in one file with `<style>`/`<script>` tags) and open it in a browser. Typing a password should update the bar color, label, and checklist live, with no page reload.

## An important caveat

This is a great UI/UX exercise, but real password security is about more than matching character-type rules — a checker like this can be satisfied by `Passw0rd!` (technically hits every rule, but it's a very common, easily-guessed pattern). For production systems, pair a meter like this with server-side checks against known-breached password lists (e.g. via the [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)), rather than relying on character rules alone.

## Where to take it next

- Add a "show password" toggle button
- Penalize common patterns (like `123`, `password`, sequential letters) instead of only rewarding character variety
- Debounce the input event if you extend this to also hit an API (like a breached-password check) on each keystroke
