---
layout: layouts/post.njk
title: "Build a Resume/Portfolio Generator From a JSON File"
dek: "Keep your resume data in one JSON file, generate a clean HTML page from it — update once, regenerate everywhere."
date: 2026-08-29
readTime: "7 min read"
tags: [python, tools, automation]
---

Keeping resume content and its presentation separate is a genuinely useful habit — update your work history in one structured file, and regenerate a polished page (or multiple formats) from it, rather than hand-editing HTML every time you change jobs.

## What we're building

A script that reads a `resume.json` file and generates a clean, styled `resume.html` page from it.

## The data file

```json
{
  "name": "Jordan Lee",
  "title": "Full-Stack Developer",
  "contact": {
    "email": "jordan@example.com",
    "github": "github.com/jordanlee",
    "location": "Remote"
  },
  "summary": "Full-stack developer focused on building fast, maintainable web applications.",
  "experience": [
    {
      "company": "Acme Corp",
      "role": "Backend Developer",
      "dates": "2023 - Present",
      "highlights": [
        "Rebuilt the payments API, cutting average response time by 40%",
        "Mentored two junior developers onboarding onto the team"
      ]
    },
    {
      "company": "Startup Co",
      "role": "Junior Developer",
      "dates": "2021 - 2023",
      "highlights": [
        "Built and shipped the company's first mobile-responsive dashboard"
      ]
    }
  ],
  "skills": ["Python", "JavaScript", "PostgreSQL", "Docker", "AWS"]
}
```

## The generator script

```python
# generate_resume.py
import json

def load_resume(path="resume.json"):
    with open(path, "r") as f:
        return json.load(f)

def render_experience(experience):
    entries = []
    for job in experience:
        highlights = "".join(f"<li>{h}</li>" for h in job["highlights"])
        entries.append(f"""
        <div class="job">
          <h3>{job["role"]} — {job["company"]}</h3>
          <p class="dates">{job["dates"]}</p>
          <ul>{highlights}</ul>
        </div>
        """)
    return "".join(entries)

def render_skills(skills):
    return "".join(f'<span class="skill">{s}</span>' for s in skills)

def generate_html(resume):
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{resume["name"]} — Resume</title>
  <style>
    body {{ font-family: -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #222; }}
    h1 {{ margin-bottom: 0; }}
    .title {{ color: #666; margin-top: 4px; }}
    .contact {{ font-size: 0.9em; color: #666; margin: 12px 0; }}
    .job {{ margin: 20px 0; }}
    .job h3 {{ margin-bottom: 2px; }}
    .dates {{ color: #888; font-size: 0.9em; margin: 2px 0 8px; }}
    .skill {{
      display: inline-block; background: #f0f0f0; padding: 4px 10px;
      border-radius: 4px; margin: 4px 4px 0 0; font-size: 0.85em;
    }}
  </style>
</head>
<body>
  <h1>{resume["name"]}</h1>
  <p class="title">{resume["title"]}</p>
  <p class="contact">
    {resume["contact"]["email"]} &middot;
    {resume["contact"]["github"]} &middot;
    {resume["contact"]["location"]}
  </p>

  <h2>Summary</h2>
  <p>{resume["summary"]}</p>

  <h2>Experience</h2>
  {render_experience(resume["experience"])}

  <h2>Skills</h2>
  <div>{render_skills(resume["skills"])}</div>
</body>
</html>"""

if __name__ == "__main__":
    resume = load_resume()
    html = generate_html(resume)

    with open("resume.html", "w") as f:
        f.write(html)

    print("Generated resume.html")
```

## Try it

```bash
python generate_resume.py
```

Open `resume.html` in a browser — a clean, styled resume page, generated entirely from the JSON data.

## Why this separation is worth the setup

Once the template exists, updating your resume is just editing JSON — no HTML wrangling, no risk of breaking the styling while adding a new job. It also opens the door to generating **multiple outputs** from the same source: an HTML page for your portfolio site, a plain-text version for pasting into application forms, or (with the `docx` skill from this series of tools) an actual Word document — all from the exact same `resume.json`.

## Where to take it next

- Add a plain-text export function alongside the HTML one, for copy-pasting into forms that don't accept formatting
- Add a `projects` section alongside `experience`, useful for portfolio-style pages
- Host the generated `resume.html` directly via GitHub Pages, exactly like this blog — a resume that's one `git push` away from being updated live
- Add simple CLI flags (`--output-format html|txt`) instead of hardcoding a single output path
