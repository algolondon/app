import sharp from 'sharp';
import fs from 'fs';

async function generateFavicon() {
  try {
    const inputPath = 'src/app/icon.png';
    const outputPath = 'src/app/favicon.ico';
    
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .resize(32, 32)
        .toFormat('png')
        .toFile(outputPath);
      console.log('Favicon generated successfully at ' + outputPath);
    } else {
      console.log('Input file not found at ' + inputPath);
    }
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
