---
layout: layouts/post.njk
title: "Build a Pomodoro Timer Browser Extension (Chrome, Manifest V3)"
dek: "A real, installable extension with a popup timer and desktop notifications — no framework required."
date: 2026-08-01
readTime: "8 min read"
tags: [javascript, chrome-extension, productivity]
---

Browser extensions are a great next step once you're comfortable with plain JavaScript — this one runs a Pomodoro-style focus timer (25 minutes work, 5 minutes break) with a popup UI and a real desktop notification when time's up.

## What we're building

A toolbar icon that opens a small popup showing a countdown, with Start/Pause/Reset buttons, and a system notification when a session ends.

## Project structure

```
pomodoro-extension/
  manifest.json
  popup.html
  popup.js
  background.js
  icon.png
```

## The manifest

Manifest V3 is the current standard for Chrome extensions — it uses a background *service worker* instead of the older persistent background page.

```json
{
  "manifest_version": 3,
  "name": "Pomodoro Timer",
  "version": "1.0",
  "description": "A simple focus timer with work/break sessions.",
  "permissions": ["alarms", "notifications", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "background": {
    "service_worker": "background.js"
  }
}
```

`alarms` lets us schedule the timer reliably (setTimeout alone isn't reliable in a service worker, which can be shut down by the browser when idle). `notifications` lets us alert the user when a session ends.

## The popup UI

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 200px; font-family: sans-serif; text-align: center; padding: 16px; }
    #time { font-size: 2.5em; margin: 8px 0; }
    button { margin: 4px; padding: 6px 12px; }
  </style>
</head>
<body>
  <div id="time">25:00</div>
  <div id="mode">Work session</div>
  <button id="start">Start</button>
  <button id="pause">Pause</button>
  <button id="reset">Reset</button>
  <script src="popup.js"></script>
</body>
</html>
```

## The background service worker (owns the actual countdown)

Keeping the timer logic in the background script — rather than the popup — matters: the popup closes every time you click away from it, but the background service worker (backed by the `alarms` API) keeps running.

```javascript
// background.js
const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ mode: "work", running: false });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoro") {
    chrome.storage.local.get(["mode"], ({ mode }) => {
      const nextMode = mode === "work" ? "break" : "work";
      const nextMinutes = nextMode === "work" ? WORK_MINUTES : BREAK_MINUTES;

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: mode === "work" ? "Work session done!" : "Break's over!",
        message: nextMode === "work" ? "Back to it." : "Take a 5-minute break.",
      });

      chrome.storage.local.set({ mode: nextMode, running: false });
      chrome.alarms.create("pomodoro", { delayInMinutes: nextMinutes });
    });
  }
});
```

## The popup logic (start/pause/reset + live countdown)

```javascript
// popup.js
const timeEl = document.getElementById("time");
const modeEl = document.getElementById("mode");

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  chrome.storage.local.get(["mode"], ({ mode }) => {
    modeEl.textContent = mode === "work" ? "Work session" : "Break";
  });

  chrome.alarms.get("pomodoro", (alarm) => {
    if (alarm) {
      const remaining = alarm.scheduledTime - Date.now();
      timeEl.textContent = formatTime(remaining);
    }
  });
}

document.getElementById("start").addEventListener("click", () => {
  chrome.storage.local.get(["mode"], ({ mode }) => {
    const minutes = mode === "work" ? 25 : 5;
    chrome.alarms.create("pomodoro", { delayInMinutes: minutes });
    chrome.storage.local.set({ running: true });
  });
});

document.getElementById("pause").addEventListener("click", () => {
  chrome.alarms.clear("pomodoro");
  chrome.storage.local.set({ running: false });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.alarms.clear("pomodoro");
  chrome.storage.local.set({ mode: "work", running: false });
  updateDisplay();
});

setInterval(updateDisplay, 1000);
updateDisplay();
```

## Loading it into Chrome

1. Add any small square PNG as `icon.png` in the folder
2. Go to `chrome://extensions`
3. Turn on **Developer mode** (top right)
4. Click **Load unpacked**, select the `pomodoro-extension` folder

Click the toolbar icon, hit Start, and you'll see the countdown ticking — and a real desktop notification when the session ends, even if the popup isn't open.

## Where to take it next

- Add a session counter ("3 work sessions completed today")
- Add sound on completion using the `chrome.tts` or a simple `<audio>` tag played from the notification
- Publish it to the Chrome Web Store (requires a one-time $5 developer registration fee and a review process)
- Add customizable durations instead of the fixed 25/5 split
