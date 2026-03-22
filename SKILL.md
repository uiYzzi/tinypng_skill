---
name: tinypng
description: Compress and optimize AVIF, WebP, JPEG and PNG images via the Tinify API. Use when you need to reduce image file sizes, resize images, convert between formats, or preserve metadata. Supports local files, URLs, and buffers.
metadata: {"gracebot":{"always":false,"emoji":"🖼️","homepage":"https://github.com/uiyzzi/tinypng-skill","requires":{"bins":["node","npm"],"env":["TINYPNG_API_KEY"]},"primaryEnv":"TINYPNG_API_KEY","install":[{"id":"node-brew","kind":"brew","formula":"node","bins":["node","npm"],"label":"Install Node.js (brew)"}]},"clawdbot":{"always":false,"emoji":"🖼️","homepage":"https://github.com/uiyzzi/tinypng-skill","requires":{"bins":["node","npm"],"env":["TINYPNG_API_KEY"]},"primaryEnv":"TINYPNG_API_KEY","install":[{"id":"node-brew","kind":"brew","formula":"node","bins":["node","npm"],"label":"Install Node.js (brew)"}]}}
---

# TinyPNG Image Optimization

Compress and optimize images through the bundled CLI at `{baseDir}/scripts/tinypng-cli.js`.

## Scope and Runtime Model

- This skill runs `node {baseDir}/scripts/tinypng-cli.js ...`.
- The CLI uses the official `tinify` npm package.
- Authentication is `TINYPNG_API_KEY` from the local environment.
- Expected API destination is `https://api.tinify.com`.

## Prerequisites

1. Node.js and npm are installed.
2. Install script dependencies once:
   - `cd {baseDir}/scripts && npm install`
3. Set your API key:
   - `export TINYPNG_API_KEY="YOUR_API_KEY"`

If dependencies or `TINYPNG_API_KEY` are missing, stop and complete setup before image operations.

## Authentication and Credentials

- Required credential: `TINYPNG_API_KEY`.
- Get it from `https://tinify.com/developers`.
- The API key is used to authenticate requests to the Tinify API.

## Command Coverage

- Compression:
  `compress`, `compressUrl`, `compressBuffer`
- Resizing:
  `resize`
- Converting:
  `convert`
- Metadata:
  `preserve`
- Utilities:
  `validate`, `compressionCount`

## Quick Examples

```bash
# Compress a local file
node {baseDir}/scripts/tinypng-cli.js compress input.png output.png

# Compress from URL
node {baseDir}/scripts/tinypng-cli.js compressUrl "https://example.com/image.jpg" output.jpg

# Resize an image (fit method)
node {baseDir}/scripts/tinypng-cli.js resize input.jpg output.jpg fit 800 600

# Resize an image (cover method with width and height)
node {baseDir}/scripts/tinypng-cli.js resize input.jpg output.jpg cover 300 300

# Convert between formats
node {baseDir}/scripts/tinypng-cli.js convert input.png output.webp "image/webp"

# Preserve metadata
node {baseDir}/scripts/tinypng-cli.js preserve input.jpg output.jpg copyright,creation

# Validate API key
node {baseDir}/scripts/tinypng-cli.js validate

# Get compression count
node {baseDir}/scripts/tinypng-cli.js compressionCount
```

## Practical Workflows

- Batch optimize images:
  compress multiple files to reduce storage and improve load times.
- Create thumbnails:
  use resize with cover or fit method to generate properly-sized thumbnails.
- Format conversion:
  convert images to WebP or AVIF for modern web performance.
- Preserve metadata:
  keep copyright and creation info when optimizing photos.

## Resize Methods

- `scale`: Scale proportionally by width or height only
- `fit`: Scale to fit within given width and height
- `cover`: Scale and crop to cover exact dimensions
- `thumb`: Advanced cover with background handling

## Safety and Operational Rules

- Always verify input files exist before processing.
- For S3/GCS storage, use the native store methods.
- Do not send data to endpoints outside Tinify API scope for this skill.
- Be mindful of compression counts (free tier has limits).

## References

- `references/API.md` for detailed API documentation.
