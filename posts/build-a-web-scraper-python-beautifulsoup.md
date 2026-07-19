---
layout: layouts/post.njk
title: "Build a Web Scraper with Python and BeautifulSoup"
dek: "Pull structured data out of a real page — headings, links, and prices — the right way."
date: 2026-08-07
readTime: "7 min read"
tags: [python, web-scraping, automation]
---

Web scraping is one of the most practically useful things you can learn as a developer — turning messy HTML into clean, structured data you can actually use.

## Before you scrape anything: the ground rules

- **Check the site's `robots.txt`** (e.g. `example.com/robots.txt`) and terms of service before scraping — some sites explicitly disallow it.
- **Prefer an official API** if one exists — it's more stable and more polite than scraping HTML that can change without notice.
- **Rate-limit yourself** — add delays between requests so you don't hammer someone's server.
- This tutorial scrapes a page you control (a local test file) so you can practice the technique without worrying about any of the above — apply the same rules for the real ideas below.

## What we're building

A script that extracts all headings and links from an HTML page into a clean, structured list.

## Setup

```bash
mkdir web-scraper && cd web-scraper
pip install beautifulsoup4 requests
```

## A test page to scrape

Save this as `test_page.html` so we have something safe and local to practice on:

```html
<!DOCTYPE html>
<html>
<body>
  <h1>Weekly Deals</h1>
  <div class="product">
    <h2>Wireless Mouse</h2>
    <span class="price">$19.99</span>
    <a href="/products/mouse">View product</a>
  </div>
  <div class="product">
    <h2>Mechanical Keyboard</h2>
    <span class="price">$89.99</span>
    <a href="/products/keyboard">View product</a>
  </div>
</body>
</html>
```

## Parsing the page

```python
# scraper.py
from bs4 import BeautifulSoup

def parse_products(html):
    soup = BeautifulSoup(html, "html.parser")
    products = []

    for product_div in soup.find_all("div", class_="product"):
        name = product_div.find("h2").get_text(strip=True)
        price_text = product_div.find("span", class_="price").get_text(strip=True)
        link = product_div.find("a")["href"]

        products.append({
            "name": name,
            "price": price_text,
            "link": link,
        })

    return products

if __name__ == "__main__":
    with open("test_page.html", "r") as f:
        html = f.read()

    products = parse_products(html)
    for p in products:
        print(f"{p['name']} — {p['price']} ({p['link']})")
```

## Running it

```bash
python scraper.py
```

```
Wireless Mouse — $19.99 (/products/mouse)
Mechanical Keyboard — $89.99 (/products/keyboard)
```

## Scraping a live page (with rate-limiting)

To adapt this for a real website you have permission to scrape, fetch the HTML first, and add a delay between requests if scraping multiple pages:

```python
import requests
import time

def fetch_page(url):
    headers = {"User-Agent": "Mozilla/5.0 (educational scraping project)"}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    return response.text

urls = ["https://example.com/page1", "https://example.com/page2"]

for url in urls:
    html = fetch_page(url)
    products = parse_products(html)
    print(f"Found {len(products)} products on {url}")
    time.sleep(1)  # be polite — don't hammer the server
```

## Handling messier real-world HTML

Real pages are rarely as clean as the test page. A few defensive habits worth building in:

```python
def safe_get_text(element):
    return element.get_text(strip=True) if element else None

# Usage:
name_el = product_div.find("h2")
name = safe_get_text(name_el)  # returns None instead of crashing if h2 is missing
```

Checking for `None` before calling `.get_text()` avoids a crash the moment one product on the page is missing an expected element — which happens more often than you'd expect on real sites.

## Where to take it next

- Export the scraped data to CSV using Python's built-in `csv` module
- Add pagination handling (following "next page" links automatically)
- Combine this with the Link-Checker script planned later in the calendar — both share the "fetch + parse HTML" foundation
- Look into `Scrapy` once you outgrow BeautifulSoup for larger, multi-page scraping projects
