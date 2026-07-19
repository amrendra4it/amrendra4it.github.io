---
layout: layouts/post.njk
title: "Build a QR Code Generator (Python)"
dek: "Turn any text or URL into a scannable QR code in a few lines — and understand what's actually being encoded."
date: 2026-08-12
readTime: "5 min read"
tags: [python, cli, tools]
---

QR codes look like magic black-and-white noise, but generating one is refreshingly simple once you're using the right library — and understanding roughly what's happening under the hood makes them a lot less mysterious.

## What we're building

A CLI tool that takes any text (a URL, a message, contact info) and outputs a scannable QR code image.

## Setup

```bash
mkdir qr-generator && cd qr-generator
pip install qrcode[pil]
```

## The basic generator

```python
# qr_gen.py
import qrcode
import sys

def generate_qr(data, filename="qrcode.png"):
    qr = qrcode.QRCode(
        version=1,  # controls the size/complexity of the code (1 = smallest)
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,  # pixel size of each "box" in the QR grid
        border=4,     # minimum required quiet-zone border
    )
    qr.add_data(data)
    qr.make(fit=True)  # let the library auto-pick a larger version if data doesn't fit

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    print(f"Saved QR code to {filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python qr_gen.py <text or URL> [output_filename.png]")
        sys.exit(1)

    data = sys.argv[1]
    filename = sys.argv[2] if len(sys.argv) > 2 else "qrcode.png"
    generate_qr(data, filename)
```

## Try it

```bash
python qr_gen.py "https://example.com"
```

Open `qrcode.png` — scanning it with any phone camera should open that URL.

## What `error_correction` actually controls

QR codes intentionally encode extra redundant data so they can still be read even if part of the code is scratched, smudged, or covered by a logo. The `error_correction` levels trade off how much damage the code can tolerate against how dense (and visually complex) the resulting pattern is:

- `ERROR_CORRECT_L` — ~7% of the code can be damaged and still scan
- `ERROR_CORRECT_M` — ~15% (a reasonable default)
- `ERROR_CORRECT_Q` — ~25%
- `ERROR_CORRECT_H` — ~30% (useful if you plan to add a logo in the center)

## Adding a logo in the center

Because of that built-in error correction, you can safely overlay a small logo without breaking the scan — as long as you use a high error-correction level:

```python
from PIL import Image

def generate_qr_with_logo(data, logo_path, filename="qrcode_with_logo.png"):
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # high tolerance, since we're covering part of it
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    logo = Image.open(logo_path)

    # Resize logo to roughly 1/5th the QR code's width
    logo_size = img.size[0] // 5
    logo = logo.resize((logo_size, logo_size))

    position = (
        (img.size[0] - logo_size) // 2,
        (img.size[1] - logo_size) // 2,
    )
    img.paste(logo, position)
    img.save(filename)

generate_qr_with_logo("https://example.com", "logo.png")
```

## Where to take it next

- Add support for generating a batch of QR codes from a CSV file (useful for things like event badges or product labels)
- Build a small web version using Flask, where users paste text into a form and get an image back
- Try decoding a QR code back into text using `pyzbar`, to see the round trip in both directions
- Experiment with different `version` numbers to see how the pattern's complexity scales with how much data you encode
