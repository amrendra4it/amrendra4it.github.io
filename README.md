# Build Log — Eleventy starter blog

A free, zero-cost blog built with **Eleventy (11ty)**, a Node.js static site
generator. Same "blueprint" visual theme as before — grid paper, corner
registration marks, amber accents — now with everything you touch written in
JavaScript, Nunjucks templates, and Markdown. No Ruby anywhere.

## What's inside

```
.eleventy.js            site config — plain JavaScript
src/
  _data/site.js          global settings (title, author, AdSense ID, etc.)
  _includes/
    layouts/             page templates (base, post)
    partials/            header, footer, ad slot
  posts/                 your articles — 3 samples included
  assets/css/            the whole visual design, one plain CSS file
  index.njk              homepage
  leetcode.njk           LeetCode solutions index (auto-filters by tag)
  about.md               about page
.github/workflows/
  deploy.yml             builds + deploys automatically on every push
```

## 1. Preview it locally (optional)

You'll need [Node.js](https://nodejs.org) installed (any recent LTS version).
Then, from this folder:

```bash
npm install
npm start
```

Open http://localhost:8080 — the site rebuilds live as you save files.

You can skip this entirely if you'd rather just push straight to GitHub —
the included GitHub Actions workflow builds it for you automatically, no
local setup required.

## 2. Put it on GitHub

1. Create a new repository on GitHub. For a free `yourusername.github.io`
   URL, name the repo exactly `yourusername.github.io`. (Otherwise it'll be
   published at `yourusername.github.io/repo-name` and you'd add that
   `/repo-name` prefix to your links.)
2. Push this folder to that repo:

```bash
cd devblog
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Turn on GitHub Pages (via Actions)

In the repo: **Settings → Pages → Build and deployment → Source: GitHub
Actions**.

That's it — the workflow in `.github/workflows/deploy.yml` runs
automatically on every push to `main`: it installs Node, runs `npm install`
and `npm run build`, and publishes the result. Check the **Actions** tab in
your repo to watch it build; first run takes about a minute.

## 4. Update `src/_data/site.js`

Fill in:
- `url`: your GitHub Pages URL (e.g. `https://yourusername.github.io`)
- `author`: your name

## 5. Write your own posts

Add a new `.md` file to `src/posts/`, matching the front matter at the top
of the sample posts (`layout`, `title`, `dek`, `date`, `readTime`, `tags`).
Everything below the `---` front matter is normal Markdown — no JavaScript
required to write a post.

For a LeetCode solution, also add `problemNumber` and `difficulty` — see
`leetcode-two-sum-solution-python.md` as the template, and `LEETCODE_PLAN.md`
for the copyright rule and a starter list of problems.

## 6. Turn on ads once you're approved

1. Apply at https://www.google.com/adsense/ once you have ~15-20 solid posts
   and some organic traffic.
2. Once approved, put your AdSense **publisher ID** (looks like
   `ca-pub-1234567890123456`) into `src/_data/site.js` under
   `adsenseClient:`.
3. Ads will automatically appear in the two slots already placed inside every
   post (top and bottom of the article body) — no other code changes needed.

## Adding a custom domain later

Once you're earning and want a custom domain (e.g. `yourblog.com`) instead of
the free `.github.io` one:
1. Buy the domain from any registrar (~$10-15/year).
2. Add a file named `CNAME` inside `src/` containing just your domain name
   (Eleventy will copy it through to the build output — add it to the
   `addPassthroughCopy` list in `.eleventy.js` if it isn't picked up
   automatically).
3. Point the domain's DNS at GitHub Pages (GitHub's docs walk through this:
   https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

Nothing else about the site needs to change.

## Why no Ruby

Eleventy is a Node.js tool, so the entire toolchain — the config file, the
templates, and the build — runs on JavaScript. You'll only ever write
Markdown (for posts) and edit simple JavaScript/Nunjucks files if you want
to tweak the design or logic.
