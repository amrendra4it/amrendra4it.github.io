---
layout: layouts/post.njk
title: "Build a Markdown-Based Static Blog Generator From Scratch (Python)"
dek: "The exact idea behind Eleventy or Jekyll, stripped down to under 100 lines — front matter, templates, and a folder of Markdown files."
date: 2026-08-18
readTime: "9 min read"
tags: [python, static-site-generator, tools]
---

This very blog runs on a static site generator (Eleventy). Building a tiny one yourself demystifies exactly what tools like that are doing — reading Markdown files, applying a template, and spitting out HTML.

## What we're building

A script that:
1. Reads all `.md` files from a `posts/` folder
2. Parses simple YAML-style front matter (`title`, `date`) from the top of each
3. Converts the Markdown body to HTML
4. Wraps each post in an HTML template
5. Writes out a full static site, including an index page listing all posts

## Setup

```bash
mkdir mini-ssg && cd mini-ssg
mkdir posts output
pip install markdown
```

## A sample post

```markdown
<!-- posts/hello-world.md -->
---
title: Hello, World
date: 2026-01-15
---

This is my **first post** using my own static site generator.

- It supports lists
- And [links](https://example.com)
```

## Step 1: parsing front matter

Front matter is the `---`-delimited block at the top of the file. We'll parse it with a small hand-rolled parser rather than a full YAML library, to keep dependencies minimal and to actually see how it works:

```python
# generator.py
import re

def parse_front_matter(content):
    match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
    if not match:
        return {}, content

    front_matter_text, body = match.groups()
    metadata = {}

    for line in front_matter_text.split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            metadata[key.strip()] = value.strip()

    return metadata, body
```

## Step 2: converting Markdown to HTML

Rather than reinventing the Markdown parser from the earlier "build your own Markdown converter" post, we'll use the real `markdown` library here — this post is about the site-generation pipeline, not re-parsing Markdown syntax again.

```python
import markdown as md

def render_markdown(body):
    return md.markdown(body, extensions=["extra"])
```

## Step 3: the HTML template

```python
POST_TEMPLATE = """<!DOCTYPE html>
<html>
<head><title>{title}</title></head>
<body>
  <h1>{title}</h1>
  <p><em>{date}</em></p>
  {content}
  <p><a href="index.html">&larr; Back to all posts</a></p>
</body>
</html>"""

INDEX_TEMPLATE = """<!DOCTYPE html>
<html>
<head><title>My Blog</title></head>
<body>
  <h1>My Blog</h1>
  <ul>
    {post_links}
  </ul>
</body>
</html>"""
```

## Step 4: putting it all together

```python
import os

def build_site(posts_dir="posts", output_dir="output"):
    os.makedirs(output_dir, exist_ok=True)
    posts_info = []

    for filename in sorted(os.listdir(posts_dir)):
        if not filename.endswith(".md"):
            continue

        with open(os.path.join(posts_dir, filename), "r") as f:
            content = f.read()

        metadata, body = parse_front_matter(content)
        html_body = render_markdown(body)

        title = metadata.get("title", filename)
        date = metadata.get("date", "")
        output_filename = filename.replace(".md", ".html")

        page_html = POST_TEMPLATE.format(title=title, date=date, content=html_body)

        with open(os.path.join(output_dir, output_filename), "w") as f:
            f.write(page_html)

        posts_info.append({"title": title, "date": date, "filename": output_filename})

    # Sort newest first and build the index page
    posts_info.sort(key=lambda p: p["date"], reverse=True)
    links = "\n".join(
        f'<li>{p["date"]} — <a href="{p["filename"]}">{p["title"]}</a></li>'
        for p in posts_info
    )
    index_html = INDEX_TEMPLATE.format(post_links=links)

    with open(os.path.join(output_dir, "index.html"), "w") as f:
        f.write(index_html)

    print(f"Built {len(posts_info)} posts into '{output_dir}/'")

if __name__ == "__main__":
    build_site()
```

## Try it

```bash
python generator.py
```

Open `output/index.html` in a browser — you'll see your post listed, and clicking through renders the full Markdown-to-HTML post page.

## What real tools like Eleventy or Jekyll add on top of this

This mini version demonstrates the core idea, but production tools add: nested layouts (templates that extend other templates), asset pipelines (CSS/JS bundling), pagination, RSS feed generation, live-reload dev servers, and plugin ecosystems. Worth knowing what's happening underneath, but for a real blog, a maintained tool is the right call — this is best appreciated as a learning project.

## Where to take it next

- Add support for tags/categories, and generate a page per tag
- Add RSS feed generation (an XML template, following the same pattern as the HTML templates above)
- Add a `--watch` mode that rebuilds automatically when a file changes, using Python's `watchdog` library
- Compare this script's structure directly to this very site's `.eleventy.js` — the concepts map almost one-to-one
