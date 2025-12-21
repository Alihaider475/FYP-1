/**
 * Run this script to generate placeholder icons for the app
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Simple 1x1 navy blue PNG (base64 encoded)
// This is a minimal valid PNG file
const createSimplePNG = (size, color) => {
  // PNG header and IHDR chunk for a simple colored square
  // This creates a valid minimal PNG
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // For simplicity, we'll create a basic colored PNG using canvas-like approach
  // Since we don't have canvas, we'll use a pre-generated base64 PNG

  // Navy blue 100x100 PNG placeholder (minimal)
  const navyBluePNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nO3bMQ7CMBAF0b3/pekouAMFBQUSkvf+ZKpI8Wgl27sLAAAAAAAAAAAA4E+t9x7r7e09/Pu1z2H7b3e+H/+tZ/8+jvVcr33mtc9p+5z39rn/4Wff6/c+B/+1f3vC/3nue/vvrx3bfwMA+C9r9wB+2X73AC5sT3cP4OL2dvcALmrPdw/g4vZ+9wAuaB93D+BXnt7AyffbPYBfeno7+Xy/ewC/8PR28vl+9wB+5ent5PPj7gH8yNPbyed69wB+5OsNvHy+3j2AH/l6Ay+fr3cP4Ee+3sDL5+vdA/iRrzfw8vl69wB+5OsNvHy+3j2AH/l6Ay+fr3cP4Ee+3sDL5+vdA/iRrzfw8vl69wB+5OsNvHy+3j2AH3l6O/n8uHsAP/L0dvL5fvcAfuXp7eTz/e4BXNie7x7Axe357gFc1J7vHsDZ9nwGAAAAAAAAAAAA8LO+AWUUMfMZ3+L0AAAAAElFTkSuQmCC',
    'base64'
  );

  return navyBluePNG;
};

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const iconData = createSimplePNG();

// Create all required icon files
const icons = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];

icons.forEach(iconName => {
  const iconPath = path.join(assetsDir, iconName);
  fs.writeFileSync(iconPath, iconData);
  console.log(`Created: ${iconPath}`);
});

console.log('\nPlaceholder icons created successfully!');
console.log('Replace these with your actual app icons before publishing.');
