import sharp from 'sharp';
import fs from 'fs';

async function resizeIcons() {
  try {
    const inputPath = 'src/app/icon.png';
    
    if (fs.existsSync(inputPath)) {
      const buffer = await sharp(inputPath).toBuffer(); // read to buffer first to avoid locking

      await sharp(buffer)
        .resize(192, 192)
        .toFormat('png')
        .toFile('src/app/icon.png');
      console.log('icon.png resized to 192x192');

      await sharp(buffer)
        .resize(180, 180)
        .toFormat('png')
        .toFile('src/app/apple-icon.png');
      console.log('apple-icon.png resized to 180x180');
    }
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

resizeIcons();
