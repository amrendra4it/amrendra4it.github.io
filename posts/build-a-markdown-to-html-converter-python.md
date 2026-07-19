---
layout: layouts/post.njk
title: "Build a Markdown-to-HTML Converter in Python"
dek: "Parse headers, bold text, and links yourself — then see what a real library adds on top."
date: 2026-07-23
readTime: "7 min read"
tags: [python, parsing, cli]
---

Markdown converters are everywhere (this very site's posts go through one), which makes building a small one yourself a great way to understand what's actually happening under the hood.

## What we're building

A script that takes a `.md` file and outputs `.html`, supporting a useful subset:

- `# Heading` → `<h1>Heading</h1>` (and `##`, `###`)
- `**bold**` → `<strong>bold</strong>`
- `[text](url)` → `<a href="url">text</a>`
- Plain paragraphs wrapped in `<p>`

## Setup

```bash
mkdir md-converter && cd md-converter
```

No dependencies needed — we're using only Python's standard library.

## Handling headings and paragraphs, line by line

```python
# converter.py
import re

def convert_line(line):
    # Headings: 1-3 '#' characters followed by a space
    heading_match = re.match(r'^(#{1,3})\s+(.*)', line)
    if heading_match:
        level = len(heading_match.group(1))
        text = heading_match.group(2)
        return f"<h{level}>{inline_format(text)}</h{level}>"

    if line.strip() == "":
        return ""

    return f"<p>{inline_format(line)}</p>"
```

## Handling inline formatting

Bold text and links can appear inside any line, so we handle them separately with their own regex substitutions:

```python
def inline_format(text):
    # **bold** -> <strong>bold</strong>
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)

    # [text](url) -> <a href="url">text</a>
    text = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', text)

    return text
```

The `.+?` (non-greedy) is important here — it stops at the *first* closing `**` or `)`, so `**bold** and **more bold**` produces two separate `<strong>` tags instead of one huge one spanning both.

## Putting it together

```python
# converter.py (continued)
def convert_file(input_path, output_path):
    with open(input_path, "r") as f:
        lines = f.readlines()

    html_lines = [convert_line(line.rstrip("\n")) for line in lines]
    html = "\n".join(line for line in html_lines if line)

    with open(output_path, "w") as f:
        f.write(html)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python converter.py input.md output.html")
    else:
        convert_file(sys.argv[1], sys.argv[2])
```

## Try it

```bash
cat > test.md << 'EOF'
# My First Post

This has **bold text** and a [link](https://example.com).

## A subheading
EOF

python converter.py test.md test.html
cat test.html
```

You should see clean HTML output matching each Markdown element.

## What a real library adds

This covers the common cases, but production Markdown (like the [Python-Markdown](https://python-markdown.github.io/) library) also handles: nested lists, code blocks and syntax highlighting, tables, blockquotes, footnotes, and escaping edge cases (like a literal `*` that isn't meant to start bold text). Worth swapping to a real library for anything beyond a learning project — but now you know what it's doing for you.

## Where to take it next

- Add support for unordered lists (`- item`) and code blocks (` ```code``` `)
- Add escaping so a literal `*` or `#` doesn't get misinterpreted
- Turn this into a CLI tool that watches a folder and rebuilds `.html` files automatically on save
