# TinyPNG Skill

Compress and optimize images with the bundled Node CLI (`scripts/tinypng-cli.js`).

## Security/Runtime Summary

- Runtime: local Node.js script in this repo
- Dependency: `tinify` (installed under `scripts/`)
- Credential: `TINYPNG_API_KEY`
- API scope: Tinify API (`https://api.tinify.com`)
- Source: [github.com/uiyzzi/tinypng-skill](https://github.com/uiyzzi/tinypng-skill)

## Install

```bash
git clone https://github.com/uiyzzi/tinypng-skill.git
cd tinypng-skill/scripts
npm install
```

## Credentials

Create an API key at TinyPNG, then set:

```bash
export TINYPNG_API_KEY="YOUR_API_KEY"
```

## Usage

```bash
# Compress a local file
node ./scripts/tinypng-cli.js compress input.png output.png

# Compress from URL
node ./scripts/tinypng-cli.js compressUrl "https://example.com/image.jpg" output.jpg

# Resize an image (fit method)
node ./scripts/tinypng-cli.js resize input.jpg output.jpg fit 800 600

# Resize an image (cover method)
node ./scripts/tinypng-cli.js resize input.jpg thumb.jpg cover 300 300

# Convert between formats
node ./scripts/tinypng-cli.js convert input.png output.webp "image/webp"

# Preserve metadata
node ./scripts/tinypng-cli.js preserve input.jpg output.jpg copyright,creation

# Validate API key
node ./scripts/tinypng-cli.js validate

# Get compression count
node ./scripts/tinypng-cli.js compressionCount
```

## Notes

- The skill package includes the CLI source at `scripts/tinypng-cli.js`.
- If you use OpenClaw/Grace skill settings, set `skills.entries.tinypng.apiKey` to map into `TINYPNG_API_KEY`.
- `SKILL.md` includes machine-readable metadata for install requirements and credential declaration.
- The free tier allows 500 compressions per month.
