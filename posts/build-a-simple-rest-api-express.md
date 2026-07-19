---
layout: layouts/post.njk
title: "Build a Simple REST API with Express.js"
dek: "Full CRUD for a resource, with proper status codes and validation — the foundation every backend project builds on."
date: 2026-08-04
readTime: "8 min read"
tags: [javascript, nodejs, backend, express]
---

Nearly every backend project eventually needs a REST API. This one builds a complete CRUD (Create, Read, Update, Delete) API for a simple "notes" resource — the pattern here scales directly to any resource you'd build later.

## What we're building

An API with these routes:

```
GET    /notes       — list all notes
GET    /notes/:id   — get one note
POST   /notes       — create a note
PUT    /notes/:id   — update a note
DELETE /notes/:id   — delete a note
```

## Setup

```bash
mkdir notes-api && cd notes-api
npm init -y
npm install express
```

## In-memory storage

For learning purposes, we'll store notes in a plain array rather than a database — this keeps focus on the API layer itself. (A natural next step, once this works, is swapping this for a real database like SQLite or Postgres.)

```javascript
// store.js
let notes = [];
let nextId = 1;

function getAll() {
  return notes;
}

function getById(id) {
  return notes.find((note) => note.id === id);
}

function create(text) {
  const note = { id: nextId++, text, createdAt: new Date().toISOString() };
  notes.push(note);
  return note;
}

function update(id, text) {
  const note = getById(id);
  if (!note) return null;
  note.text = text;
  return note;
}

function remove(id) {
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
```

## The Express app

```javascript
// app.js
const express = require("express");
const store = require("./store");

const app = express();
app.use(express.json());

// GET /notes
app.get("/notes", (req, res) => {
  res.json(store.getAll());
});

// GET /notes/:id
app.get("/notes/:id", (req, res) => {
  const note = store.getById(Number(req.params.id));
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

// POST /notes
app.post("/notes", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "text is required and must be a non-empty string" });
  }
  const note = store.create(text.trim());
  res.status(201).json(note);
});

// PUT /notes/:id
app.put("/notes/:id", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "text is required and must be a non-empty string" });
  }
  const updated = store.update(Number(req.params.id), text.trim());
  if (!updated) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(updated);
});

// DELETE /notes/:id
app.delete("/notes/:id", (req, res) => {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});
```

## Why these specific status codes

- **200** — successful GET/PUT (returning data)
- **201** — successful creation (returning the new resource)
- **204** — successful deletion (no content to return)
- **400** — the client sent bad input (missing/invalid `text`)
- **404** — the requested note doesn't exist

Using the right status code (rather than always returning `200`) is what makes an API predictable for whoever consumes it later — including future-you.

## Try it

```bash
node app.js
```

In another terminal:

```bash
# Create a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Express.js"}'

# List all notes
curl http://localhost:3000/notes

# Update a note
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Express.js properly"}'

# Delete a note
curl -X DELETE http://localhost:3000/notes/1
```

## Where to take it next

- Swap the in-memory array for SQLite (this pairs naturally with the URL Shortener post's `db.py` pattern, translated to Node)
- Add pagination to `GET /notes` for when the list grows large
- Add the rate-limiter middleware from later in the calendar to protect this API from abuse
- Add basic API key authentication so not just anyone can create/delete notes
