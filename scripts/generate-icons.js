import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sizes = [192, 512];

async function generateIcons() {
   const svgPath = path.join(__dirname, '../public/icons/icon.svg');

   for (const size of sizes) {
      await sharp(svgPath)
         .resize(size, size)
         .png()
         .toFile(path.join(__dirname, `../public/icons/icon-${size}x${size}.png`));
   }
}

generateIcons().catch(console.error);