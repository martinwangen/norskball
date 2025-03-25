import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import svg2img from 'svg2img';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'public', 'rabona-logo.svg');
const pngOutputPath = path.join(__dirname, 'public', 'favicon.png');
const icoOutputPath = path.join(__dirname, 'public', 'favicon.ico');
const backupFaviconPath = path.join(__dirname, 'public', 'favicon.ico.backup');
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// First, backup the existing favicon
if (fs.existsSync(icoOutputPath)) {
  fs.copyFileSync(icoOutputPath, backupFaviconPath);
  console.log('Existing favicon backed up to favicon.ico.backup');
}

// Read the SVG file
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Convert SVG to PNG with a good size for favicon
svg2img(svgContent, { width: 256, height: 256 }, async (error, buffer) => {
  if (error) {
    console.error('Error converting SVG to PNG:', error);
    return;
  }

  // Save the PNG file as favicon.png
  fs.writeFileSync(pngOutputPath, buffer);
  console.log('PNG favicon created successfully');

  // Create different sized PNG favicons
  const sizes = [16, 32, 96, 128];

  try {
    for (const size of sizes) {
      await sharp(buffer)
        .resize(size, size)
        .toFile(path.join(iconsDir, `favicon-${size}x${size}.png`));
      console.log(`Created favicon-${size}x${size}.png`);
    }

    // Convert PNG to ICO with multiple sizes
    const icoBuffer = await pngToIco([pngOutputPath]);
    fs.writeFileSync(icoOutputPath, icoBuffer);
    console.log('Favicon.ico created successfully');

    console.log('Favicon conversion complete!');
  } catch (err) {
    console.error('Error creating favicon files:', err);
  }
});
