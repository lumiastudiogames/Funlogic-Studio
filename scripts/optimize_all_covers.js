import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      res = res.concat(walk(p));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(f.name)) {
      res.push(p);
    }
  }
  return res;
}

const images = walk('src/games');
console.log(`Found ${images.length} images to check and optimize in src/games...`);

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for (const imgPath of images) {
  try {
    const statBefore = fs.statSync(imgPath);
    totalBefore += statBefore.size;

    const inputBuffer = fs.readFileSync(imgPath);
    const metadata = await sharp(inputBuffer).metadata();

    // Only re-encode/compress if width > 480 or size > 60KB
    if ((metadata.width && metadata.width > 480) || statBefore.size > 60 * 1024 || path.extname(imgPath).toLowerCase() !== '.webp') {
      const targetWidth = Math.min(metadata.width || 480, 480);
      const outputBuffer = await sharp(inputBuffer)
        .resize({
          width: targetWidth,
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: 78,
          effort: 5
        })
        .toBuffer();

      const ext = path.extname(imgPath).toLowerCase();
      let finalPath = imgPath;
      if (ext !== '.webp') {
        finalPath = imgPath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
        fs.writeFileSync(finalPath, outputBuffer);
        if (fs.existsSync(imgPath) && imgPath !== finalPath) {
          fs.unlinkSync(imgPath);
        }
      } else {
        fs.writeFileSync(finalPath, outputBuffer);
      }

      const statAfter = fs.statSync(finalPath);
      totalAfter += statAfter.size;
      count++;

      const savedPct = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1);
      console.log(`[${count}] ${finalPath}: ${(statBefore.size/1024).toFixed(1)} KB -> ${(statAfter.size/1024).toFixed(1)} KB (-${savedPct}%)`);
    } else {
      totalAfter += statBefore.size;
    }
  } catch (err) {
    console.error(`Error optimizing ${imgPath}:`, err.message);
  }
}

console.log('\n--- FINAL OPTIMIZATION SUMMARY ---');
console.log(`Total files processed: ${count}`);
console.log(`Total games image size before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Total games image size after: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Total bandwidth saved: ${((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2)} MB (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
