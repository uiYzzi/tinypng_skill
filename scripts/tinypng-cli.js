#!/usr/bin/env node
/**
 * TinyPNG CLI - Command-line interface for TinyPNG/Tinify API
 * Uses the official tinify npm package
 */

const tinify = require('tinify');
const fs = require('fs');
const path = require('path');

// Require TINYPNG_API_KEY environment variable
const apiKey = process.env.TINYPNG_API_KEY;
if (!apiKey) {
  console.error('Error: TINYPNG_API_KEY environment variable is required');
  console.error('Get your API key from: https://tinify.com/developers');
  process.exit(1);
}

tinify.key = apiKey;

// Optional proxy support
if (process.env.TINYPNG_PROXY) {
  tinify.proxy = process.env.TINYPNG_PROXY;
}

const commands = {
  // Compress a local file
  async compress(inputPath, outputPath) {
    if (!inputPath || !outputPath) {
      throw new Error('Usage: compress <inputPath> <outputPath>');
    }
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }
    const source = tinify.fromFile(inputPath);
    await source.toFile(outputPath);
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    return {
      input: inputPath,
      output: outputPath,
      inputSize,
      outputSize,
      savings: `${((1 - outputSize / inputSize) * 100).toFixed(1)}%`
    };
  },

  // Compress from URL
  async compressUrl(url, outputPath) {
    if (!url || !outputPath) {
      throw new Error('Usage: compressUrl <url> <outputPath>');
    }
    const source = tinify.fromUrl(url);
    await source.toFile(outputPath);
    const outputSize = fs.statSync(outputPath).size;
    return {
      url,
      output: outputPath,
      outputSize
    };
  },

  // Compress from buffer (reads from stdin or file)
  async compressBuffer(inputPath) {
    if (!inputPath) {
      throw new Error('Usage: compressBuffer <inputPath>');
    }
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }
    const sourceData = fs.readFileSync(inputPath);
    const result = await tinify.fromBuffer(sourceData).toBuffer();
    // Output is base64 encoded for CLI
    return {
      size: result.length,
      data: result.toString('base64')
    };
  },

  // Resize an image
  async resize(inputPath, outputPath, method, width, height) {
    if (!inputPath || !outputPath || !method) {
      throw new Error('Usage: resize <inputPath> <outputPath> <method> [width] [height]');
    }
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const resizeOptions = { method };

    if (width) resizeOptions.width = parseInt(width, 10);
    if (height) resizeOptions.height = parseInt(height, 10);

    if ((resizeOptions.width || resizeOptions.height) && !fs.existsSync(inputPath)) {
      throw new Error('Both width and height are required for fit/cover/thumb methods');
    }

    const source = tinify.fromFile(inputPath);
    const resized = source.resize(resizeOptions);
    await resized.toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;

    return {
      input: inputPath,
      output: outputPath,
      method,
      width: resizeOptions.width,
      height: resizeOptions.height,
      inputSize,
      outputSize,
      savings: `${((1 - outputSize / inputSize) * 100).toFixed(1)}%`
    };
  },

  // Convert between formats
  async convert(inputPath, outputPath, types) {
    if (!inputPath || !outputPath || !types) {
      throw new Error('Usage: convert <inputPath> <outputPath> <types>');
    }
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const typeArray = types.split(',').map(t => t.trim());
    const source = tinify.fromFile(inputPath);
    const converted = source.convert({ type: typeArray });

    const result = await converted.result();
    const extension = await result.extension();

    // Update output path with correct extension if needed
    const finalOutputPath = extension && !outputPath.endsWith(`.${extension}`)
      ? `${outputPath}.${extension}`
      : outputPath;

    await converted.toFile(finalOutputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(finalOutputPath).size;

    return {
      input: inputPath,
      output: finalOutputPath,
      type: extension,
      inputSize,
      outputSize,
      savings: `${((1 - outputSize / inputSize) * 100).toFixed(1)}%`
    };
  },

  // Preserve metadata
  async preserve(inputPath, outputPath, metadata) {
    if (!inputPath || !outputPath || !metadata) {
      throw new Error('Usage: preserve <inputPath> <outputPath> <metadata>');
    }
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const metadataArray = metadata.split(',').map(m => m.trim());
    const source = tinify.fromFile(inputPath);
    const copyrighted = source.preserve(...metadataArray);
    await copyrighted.toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;

    return {
      input: inputPath,
      output: outputPath,
      preserved: metadataArray,
      inputSize,
      outputSize,
      savings: `${((1 - outputSize / inputSize) * 100).toFixed(1)}%`
    };
  },

  // Validate API key
  async validate() {
    return new Promise((resolve, reject) => {
      tinify.validate((err) => {
        if (err) {
          reject(new Error(`Validation failed: ${err.message}`));
        } else {
          resolve({ valid: true });
        }
      });
    });
  },

  // Get compression count
  async compressionCount() {
    return {
      compressionCount: tinify.compressionCount
    };
  }
};

// CLI execution
async function main() {
  const [,, command, ...args] = process.argv;

  if (!command || !commands[command]) {
    console.error('Usage: tinypng-cli.js <command> [args...]');
    console.error('\nAvailable commands:');
    console.error('  compress <inputPath> <outputPath>           - Compress a local file');
    console.error('  compressUrl <url> <outputPath>              - Compress from URL');
    console.error('  compressBuffer <inputPath>                  - Compress from buffer (outputs base64)');
    console.error('  resize <input> <output> <method> [w] [h]    - Resize image (scale/fit/cover/thumb)');
    console.error('  convert <input> <output> <types>            - Convert formats (e.g., "image/webp,image/png")');
    console.error('  preserve <input> <output> <metadata>       - Preserve metadata (copyright,creation,location)');
    console.error('  validate                                   - Validate API key');
    console.error('  compressionCount                           - Get compression count');
    console.error('\nResize methods: scale, fit, cover, thumb');
    console.error('\nExamples:');
    console.error('  tinypng-cli.js compress input.png output.png');
    console.error('  tinypng-cli.js resize input.jpg thumb.jpg cover 300 300');
    console.error('  tinypng-cli.js convert input.png output.webp "image/webp"');
    process.exit(1);
  }

  try {
    const result = await commands[command](...args);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = commands;