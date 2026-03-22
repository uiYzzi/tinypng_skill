# TinyPNG API Reference

## Configuration

This skill uses:
- `TINYPNG_API_KEY` (API key from `https://tinify.com/developers`)
- `scripts/tinypng-cli.js`
- `tinify` npm package in `scripts/package.json`

## Resize Methods

### scale
Scales the image down proportionally. Provide either width OR height, not both.
```bash
node ./scripts/tinypng-cli.js resize input.jpg output.jpg scale 800
```

### fit
Scales the image down proportionally to fit within given dimensions. Provide both width AND height.
```bash
node ./scripts/tinypng-cli.js resize input.jpg output.jpg fit 800 600
```

### cover
Scales and crops to cover exact dimensions. Provide both width AND height.
```bash
node ./scripts/tinypng-cli.js resize input.jpg output.jpg cover 300 300
```

### thumb
Advanced cover that handles cut-out images with plain backgrounds.
```bash
node ./scripts/tinypng-cli.js resize input.png thumb.jpg thumb 400 400
```

## Metadata Preservation

### Options
- `copyright` - Preserves EXIF copyright tag (JPEG), XMP rights tag (PNG), Photoshop copyright flag/URL (~90 bytes + data)
- `creation` - Preserves EXIF original date time (JPEG) or XMP creation time (PNG) (~70 bytes)
- `location` - Preserves EXIF GPS latitude/longitude (JPEG only) (~130 bytes)

### Usage
```bash
node ./scripts/tinypng-cli.js preserve input.jpg output.jpg copyright,creation
```

## Format Conversion

### Supported Types
- `image/avif` - AVIF format
- `image/webp` - WebP format
- `image/jpeg` - JPEG format
- `image/png` - PNG format

### Single Conversion
```bash
node ./scripts/tinypng-cli.js convert input.png output.webp "image/webp"
```

### Multi-format (returns smallest)
```bash
node ./scripts/tinypng-cli.js convert input.jpg output "image/webp,image/avif"
```

### Transparent Background
When converting transparent images to JPEG (which doesn't support transparency), specify a background color:
```bash
node ./scripts/tinypng-cli.js convert input.png output.jpg "image/jpeg"
# Note: For transparent backgrounds, use the transform object in custom code
```

## Error Types

- **AccountError** - API key problem or compression limit reached
- **ClientError** - Invalid request data (check source image and options)
- **ServerError** - Temporary Tinify API issue (safe to retry)
- **ConnectionError** - Network connectivity issue

## Compression Count

The API tracks monthly compression usage:
```bash
node ./scripts/tinypng-cli.js compressionCount
```

## Complete Workflow Examples

### Optimize and resize for web
```bash
# 1. Compress original
node ./scripts/tinypng-cli.js compress photo.jpg optimized.jpg

# 2. Create thumbnail
node ./scripts/tinypng-cli.js resize optimized.jpg thumbnail.jpg cover 200 200

# 3. Create web version
node ./scripts/tinypng-cli.js resize optimized.jpg web.jpg fit 1200 800
```

### Batch convert to WebP
```bash
node ./scripts/tinypng-cli.js convert image1.png webp1.webp "image/webp"
node ./scripts/tinypng-cli.js convert image2.png webp2.webp "image/webp"
```

### Validate before processing
```bash
node ./scripts/tinypng-cli.js validate
node ./scripts/tinypng-cli.js compressionCount
```