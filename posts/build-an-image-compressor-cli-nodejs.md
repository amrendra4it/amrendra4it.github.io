---
layout: layouts/post.njk
title: "Build an Image Compressor CLI in Node.js"
dek: "Batch-compress a whole folder of images using Sharp — with a real before/after size comparison."
date: 2026-08-26
readTime: "6 min read"
tags: [javascript, nodejs, cli, images]
---

Image compression is a genuinely useful tool to have — whether for a website's assets, email attachments, or just clearing up disk space. This one batch-processes an entire folder.

## What we're building

A CLI that takes an input folder of images and outputs compressed versions, reporting the size savings.

```bash
node compress.js ./photos ./photos-compressed
```

## Setup

```bash
mkdir image-compressor && cd image-compressor
npm init -y
npm install sharp
```

[Sharp](https://sharp.pixelplumbing.com/) is a fast, well-maintained image processing library for Node — it handles resizing and compression far faster than pure-JS alternatives, since it uses native bindings under the hood.

## The core compression logic

```javascript
// compress.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

async function compressImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();

  let pipeline = sharp(inputPath);

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 75 });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: 75, compressionLevel: 9 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 75 });
  }

  await pipeline.toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;
  const compressedSize = fs.statSync(outputPath).size;

  return { originalSize, compressedSize };
}
```

## Processing a whole folder

```javascript
async function compressFolder(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir).filter((file) =>
    SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No supported image files found.");
    return;
  }

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    const { originalSize, compressedSize } = await compressImage(inputPath, outputPath);
    totalOriginal += originalSize;
    totalCompressed += compressedSize;

    const savings = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
    console.log(`${file}: ${formatBytes(originalSize)} -> ${formatBytes(compressedSize)} (${savings}% smaller)`);
  }

  const totalSavings = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);
  console.log(`\nTotal: ${formatBytes(totalOriginal)} -> ${formatBytes(totalCompressed)} (${totalSavings}% smaller)`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
```

## Tying it together with CLI arguments

```javascript
async function main() {
  const [, , inputDir, outputDir] = process.argv;

  if (!inputDir || !outputDir) {
    console.log("Usage: node compress.js <input-folder> <output-folder>");
    return;
  }

  await compressFolder(inputDir, outputDir);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
```

## Try it

```bash
node compress.js ./photos ./photos-compressed
```

```
sunset.jpg: 4.2 MB -> 890.3 KB (79.2% smaller)
portrait.png: 2.1 MB -> 645.8 KB (69.2% smaller)

Total: 6.3 MB -> 1.5 MB (76.2% smaller)
```

## Why quality 75 as a default

JPEG/WebP quality settings above roughly 80 tend to produce diminishing file-size returns for very little visible quality gain, while settings much below 70 start introducing visible artifacts on most photos. 75 is a reasonable middle ground for general use — but this is genuinely worth tuning per use case (e.g. product photography might want higher quality than casual snapshots).

## Where to take it next

- Add a `--quality` CLI flag so users can adjust compression level without editing the script
- Add automatic resizing (e.g. cap max width at 1920px) alongside compression, for even bigger savings on oversized images
- Add recursive folder processing (subfolders, not just the top level) using `fs.readdirSync(dir, { recursive: true })`
- Turn this into a real global CLI command using the same `npm link` technique from the earlier To-Do CLI post
