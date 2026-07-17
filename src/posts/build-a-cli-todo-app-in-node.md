---
layout: layouts/post.njk
title: "Build a To-Do List CLI in Node.js"
dek: "A real command-line tool with persistent storage — no frameworks required."
date: 2026-07-08
readTime: "6 min read"
tags: [javascript, nodejs, cli]
---

Command-line tools are one of the fastest ways to see your code become a real, usable thing. This one adds, lists, and completes to-do items, and remembers them between runs.

## What we're building

A `todo` command you can run from anywhere:

```bash
todo add "Write the newsletter"
todo list
todo done 1
```

## Project setup

```bash
mkdir todo-cli && cd todo-cli
npm init -y
```

## Persisting data

We'll store tasks as JSON in the user's home directory, so the list survives between sessions.

```javascript
// storage.js
const fs = require("fs");
const path = require("path");
const os = require("os");

const FILE_PATH = path.join(os.homedir(), ".todo-cli.json");

function loadTasks() {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
```

## The command logic

```javascript
// index.js
#!/usr/bin/env node
const { loadTasks, saveTasks } = require("./storage");

const [, , command, ...args] = process.argv;
const tasks = loadTasks();

switch (command) {
  case "add": {
    const text = args.join(" ");
    tasks.push({ text, done: false });
    saveTasks(tasks);
    console.log(`Added: ${text}`);
    break;
  }

  case "list": {
    if (tasks.length === 0) {
      console.log("Nothing here yet — add a task with `todo add \"...\"`");
      break;
    }
    tasks.forEach((t, i) => {
      const mark = t.done ? "x" : " ";
      console.log(`${i + 1}. [${mark}] ${t.text}`);
    });
    break;
  }

  case "done": {
    const index = Number(args[0]) - 1;
    if (tasks[index]) {
      tasks[index].done = true;
      saveTasks(tasks);
      console.log(`Marked done: ${tasks[index].text}`);
    } else {
      console.log("No task at that number.");
    }
    break;
  }

  default:
    console.log("Usage: todo <add|list|done> [args]");
}
```

## Making it a real global command

Add this to `package.json`:

```json
{
  "bin": {
    "todo": "./index.js"
  }
}
```

Then link it globally:

```bash
chmod +x index.js
npm link
```

Now `todo` works as a command from any directory on your machine.

## Where to take it next

- Add a `remove` command
- Add due dates and sort by them
- Add color output with a package like `chalk`
- Publish it to npm so others can install it with `npm install -g`

Publishing to npm is a satisfying next step — it turns a local script into something anyone can install with one command.
