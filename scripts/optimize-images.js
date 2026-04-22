const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage() {
  const inputPath = path.join(__dirname, '../public/images/hands_v2.jpg');
  const outputWebP = path.join(__dirname, '../public/images/hands_v2.webp');
  const outputAvif = path.join(__dirname, '../public/images/hands_v2.avif');

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input image not found:', inputPath);
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    console.log(`Original JPG size: ${(originalStats.size / 1024).toFixed(2)} KB`);

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputWebP);
    
    const webpStats = fs.statSync(outputWebP);
    console.log(`WebP size: ${(webpStats.size / 1024).toFixed(2)} KB (${((1 - webpStats.size / originalStats.size) * 100).toFixed(1)}% reduction)`);

    // Convert to AVIF
    await sharp(inputPath)
      .avif({ quality: 80, effort: 6 })
      .toFile(outputAvif);
    
    const avifStats = fs.statSync(outputAvif);
    console.log(`AVIF size: ${(avifStats.size / 1024).toFixed(2)} KB (${((1 - avifStats.size / originalStats.size) * 100).toFixed(1)}% reduction)`);

    console.log('\n✅ Image optimization complete!');
    console.log('Next.js will automatically serve the optimal format based on browser support.');
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeImage();
