---
layout: layouts/post.njk
title: "Build a Habit Tracker With Local Storage (No Backend Required)"
dek: "A daily habit grid that persists in the browser — a good project for practicing localStorage and date handling."
date: 2026-08-23
readTime: "7 min read"
tags: [javascript, frontend, localstorage]
---

Not every project needs a backend. This habit tracker stores everything in the browser's `localStorage`, which is perfect for a personal single-user tool — no server, no database, no deployment complexity.

## What we're building

A grid showing the last 30 days for each habit, where clicking a day toggles it complete/incomplete, and everything persists across browser sessions.

## The HTML

```html
<div id="app">
  <input type="text" id="new-habit" placeholder="New habit name" />
  <button id="add-habit">Add Habit</button>
  <div id="habits"></div>
</div>
```

## Data structure

We'll store habits as an array of objects, each with a name and a set of completed dates:

```javascript
// { name: "Read", completedDates: ["2026-08-01", "2026-08-03"] }
```

## Persisting to localStorage

```javascript
const STORAGE_KEY = "habit-tracker-data";

function loadHabits() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}
```

## Generating the last 30 days

```javascript
function getLast30Days() {
  const days = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
  }

  return days;
}
```

## Rendering the grid

```javascript
function renderHabits() {
  const habits = loadHabits();
  const days = getLast30Days();
  const container = document.getElementById("habits");

  container.innerHTML = habits
    .map((habit, habitIndex) => {
      const cells = days
        .map((day) => {
          const isComplete = habit.completedDates.includes(day);
          return `<div
            class="day-cell ${isComplete ? "complete" : ""}"
            data-habit="${habitIndex}"
            data-day="${day}"
            title="${day}"
          ></div>`;
        })
        .join("");

      return `
        <div class="habit-row">
          <span class="habit-name">${habit.name}</span>
          <div class="day-grid">${cells}</div>
        </div>
      `;
    })
    .join("");
}
```

## Handling clicks to toggle a day

Using event delegation on the container (rather than one listener per cell) keeps this efficient even as habits and days accumulate:

```javascript
document.getElementById("habits").addEventListener("click", (e) => {
  if (!e.target.classList.contains("day-cell")) return;

  const habitIndex = Number(e.target.dataset.habit);
  const day = e.target.dataset.day;
  const habits = loadHabits();
  const habit = habits[habitIndex];

  const dateIndex = habit.completedDates.indexOf(day);
  if (dateIndex === -1) {
    habit.completedDates.push(day);
  } else {
    habit.completedDates.splice(dateIndex, 1);
  }

  saveHabits(habits);
  renderHabits();
});
```

## Adding new habits

```javascript
document.getElementById("add-habit").addEventListener("click", () => {
  const input = document.getElementById("new-habit");
  const name = input.value.trim();
  if (!name) return;

  const habits = loadHabits();
  habits.push({ name, completedDates: [] });
  saveHabits(habits);

  input.value = "";
  renderHabits();
});

renderHabits(); // initial render on page load
```

## Basic CSS for the grid

```css
.habit-row { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
.habit-name { width: 120px; }
.day-grid { display: flex; gap: 2px; }
.day-cell {
  width: 14px; height: 14px;
  background: #eee;
  border-radius: 2px;
  cursor: pointer;
}
.day-cell.complete { background: #27ae60; }
```

## Try it

Open the page, add a habit, and click cells to mark days complete. Refresh the page — your data is still there, since it's stored in `localStorage` rather than in memory.

## A note on localStorage's limits

This is genuinely fine for a personal, single-device tool, but keep in mind: `localStorage` doesn't sync across devices or browsers, has a storage limit (typically 5-10MB), and is cleared if the user clears their browser data. Fine for a project like this; not a substitute for a real backend if you ever need multi-device access.

## Where to take it next

- Add a streak counter (consecutive completed days) per habit
- Add a monthly view instead of a fixed 30-day rolling window
- Add data export/import (download/upload a JSON file) so users have a manual backup option
- If you outgrow localStorage, this is a natural project to add a small backend to later, reusing the Simple REST API pattern from earlier in the calendar
