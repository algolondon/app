const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(process.cwd(), 'public', 'images');

async function processImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const inputPath = path.join(dir, file);
    if (fs.statSync(inputPath).isDirectory()) continue;
    
    if (file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      const tempPath = path.join(dir, 'temp_' + file);
      
      console.log(`Compressing ${file}...`);
      try {
        if (file.endsWith('.png')) {
          await sharp(inputPath)
            .png({ quality: 80, compressionLevel: 9 })
            .toFile(tempPath);
        } else {
          await sharp(inputPath)
            .jpeg({ quality: 80, progressive: true })
            .toFile(tempPath);
        }
        
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        console.log(`✅ Compressed ${file}`);
      } catch (err) {
        console.error(`❌ Failed to compress ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

processImages();
