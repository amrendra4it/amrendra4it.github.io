---
layout: layouts/post.njk
title: "Build a URL Shortener in Python (Flask + SQLite)"
dek: "A working link shortener in about 60 lines — routes, storage, and redirects explained."
date: 2026-07-01
readTime: "7 min read"
tags: [python, flask, backend]
---

A URL shortener is a great first backend project: it touches routing, a database, and redirects, but stays small enough to finish in an afternoon.

## What we're building

A tiny Flask app with two jobs:

1. Accept a long URL and return a short code
2. Redirect anyone who visits `/that-code` to the original URL

## Setup

```bash
mkdir url-shortener && cd url-shortener
python3 -m venv venv
source venv/bin/activate
pip install flask
```

## The storage layer

We'll use SQLite since it needs no separate server and ships with Python.

```python
# db.py
import sqlite3

def get_db():
    conn = sqlite3.connect("links.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS links (
            code TEXT PRIMARY KEY,
            url TEXT NOT NULL
        )
    """)
    return conn
```

## Generating short codes

A short, random alphanumeric code is enough for a personal project — no need for a full hashing scheme.

```python
# shorten.py
import random
import string

def generate_code(length=6):
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(length))
```

## The Flask app

```python
# app.py
from flask import Flask, request, redirect, jsonify
from db import get_db
from shorten import generate_code

app = Flask(__name__)

@app.route("/shorten", methods=["POST"])
def shorten():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "url is required"}), 400

    conn = get_db()
    code = generate_code()

    # Retry on the rare collision
    while conn.execute("SELECT 1 FROM links WHERE code = ?", (code,)).fetchone():
        code = generate_code()

    conn.execute("INSERT INTO links (code, url) VALUES (?, ?)", (code, url))
    conn.commit()
    conn.close()

    return jsonify({"short_url": request.host_url + code})

@app.route("/<code>")
def go_to_url(code):
    conn = get_db()
    row = conn.execute("SELECT url FROM links WHERE code = ?", (code,)).fetchone()
    conn.close()

    if row is None:
        return "Not found", 404
    return redirect(row[0])

if __name__ == "__main__":
    app.run(debug=True)
```

## Try it

```bash
python app.py
```

In another terminal:

```bash
curl -X POST http://127.0.0.1:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/a-very-long-path"}'
```

You'll get back something like `{"short_url": "http://127.0.0.1:5000/aB3xQ9"}`. Visit that URL in a browser and it redirects straight to the original.

## Where to take it next

- Add a `created_at` column and expire old links
- Add basic rate limiting so one visitor can't flood your database
- Swap SQLite for Postgres if you deploy this publicly
- Add a simple HTML form so people don't need `curl` to shorten a link

That last one is a good next post on its own — a minimal frontend that calls this same API.
