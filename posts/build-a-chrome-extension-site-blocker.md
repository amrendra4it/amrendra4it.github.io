---
layout: layouts/post.njk
title: "Build a Chrome Extension That Blocks Distracting Sites"
dek: "Using Manifest V3's declarativeNetRequest API to block sites without slow, deprecated request-intercepting code."
date: 2026-08-15
readTime: "6 min read"
tags: [javascript, chrome-extension, productivity]
---

Site blockers are a classic productivity extension. Manifest V3 (the current Chrome extension standard) changed *how* you build one — the old `webRequest`-based blocking approach is deprecated in favor of a declarative rules API, which is actually simpler once you see it.

## What we're building

An extension that blocks a configurable list of sites, redirecting them to a simple "stay focused" page instead of loading.

## Project structure

```
site-blocker/
  manifest.json
  rules.json
  blocked.html
  icon.png
```

## The manifest

```json
{
  "manifest_version": 3,
  "name": "Site Blocker",
  "version": "1.0",
  "description": "Blocks a configurable list of distracting sites.",
  "permissions": ["declarativeNetRequest", "storage"],
  "host_permissions": ["<all_urls>"],
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules.json"
      }
    ]
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}
```

`declarativeNetRequest` lets Chrome itself evaluate blocking rules internally — faster and more private than the old approach, which required your JavaScript to inspect every single network request as it happened.

## The blocking rules

```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": { "extensionPath": "/blocked.html" }
    },
    "condition": {
      "urlFilter": "||twitter.com",
      "resourceTypes": ["main_frame"]
    }
  },
  {
    "id": 2,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": { "extensionPath": "/blocked.html" }
    },
    "condition": {
      "urlFilter": "||reddit.com",
      "resourceTypes": ["main_frame"]
    }
  }
]
```

`||domain.com` matches that domain and any subdomain. `resourceTypes: ["main_frame"]` limits blocking to top-level page loads, so it won't accidentally block, say, an embedded widget from that domain on an otherwise unrelated page.

## The "stay focused" redirect page

```html
<!-- blocked.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #14293b;
      color: #eef2ef;
      text-align: center;
    }
    h1 { font-size: 2em; }
  </style>
</head>
<body>
  <div>
    <h1>Stay focused.</h1>
    <p>This site is on your blocked list.</p>
  </div>
</body>
</html>
```

## A simple popup to toggle blocking on/off

```html
<!-- popup.html -->
<!DOCTYPE html>
<html>
<body style="width:180px; font-family:sans-serif; text-align:center; padding:12px;">
  <p id="status">Blocking: ON</p>
  <button id="toggle">Toggle</button>
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup.js
const statusEl = document.getElementById("status");

function updateStatus() {
  chrome.storage.local.get(["enabled"], ({ enabled }) => {
    statusEl.textContent = `Blocking: ${enabled === false ? "OFF" : "ON"}`;
  });
}

document.getElementById("toggle").addEventListener("click", () => {
  chrome.storage.local.get(["enabled"], ({ enabled }) => {
    const newState = enabled === false ? true : false;
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: newState ? ["ruleset_1"] : [],
      disableRulesetIds: newState ? [] : ["ruleset_1"],
    });
    chrome.storage.local.set({ enabled: newState }, updateStatus);
  });
});

updateStatus();
```

## Loading it into Chrome

1. Add any square PNG as `icon.png`
2. Go to `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked**, select the `site-blocker` folder
4. Visit a blocked site — it should immediately redirect to your focus page

## Where to take it next

- Add a settings page where users can add/remove sites without editing `rules.json` directly (this requires generating rules dynamically via `chrome.declarativeNetRequest.updateDynamicRules` instead of the static JSON file)
- Add a schedule (e.g. only block during working hours) using `chrome.alarms`
- Add a "5-minute snooze" button for when you genuinely need brief access to a blocked site
