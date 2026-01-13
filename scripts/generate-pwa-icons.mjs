import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const inputSvg = path.join(rootDir, "public", "favicon.svg");
const outputDir = path.join(rootDir, "public", "icons");

const sizes = [
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-384x384.png", size: 384 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

generateIcons().catch(console.error);
