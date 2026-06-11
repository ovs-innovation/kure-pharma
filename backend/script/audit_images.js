const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;

  // Check products with images
  const products = await db.collection('products').find({}, {
    projection: { name: 1, images: 1 }
  }).toArray();

  console.log('=== PRODUCTS WITH IMAGES ===');
  let totalImgs = 0, dhqImgs = 0, dkeImgs = 0, otherImgs = 0;
  products.forEach(p => {
    if (p.images && p.images.length > 0) {
      p.images.forEach(img => {
        const url = img.url || img;
        if (typeof url === 'string') {
          totalImgs++;
          if (url.includes('dhqcwkpzp')) dhqImgs++;
          else if (url.includes('dkeceuhqb')) dkeImgs++;
          else otherImgs++;
          console.log('  Product:', p.name, '-> URL cloud:', url.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1] || 'unknown');
          console.log('    Full URL:', url.substring(0, 100));
        }
      });
    }
  });

  console.log('\n=== PRODUCT IMAGE STATS ===');
  console.log('Total images:', totalImgs);
  console.log('dhqcwkpzp (OLD/broken):', dhqImgs);
  console.log('dkeceuhqb (NEW/active):', dkeImgs);
  console.log('Other:', otherImgs);

  // Check categories with icons
  const cats = await db.collection('categories').find({}, {
    projection: { name: 1, icon: 1, image: 1, slug: 1 }
  }).toArray();

  console.log('\n=== CATEGORIES WITH ICONS/IMAGES ===');
  cats.forEach(c => {
    const icon = c.icon || '';
    const image = c.image || '';
    const cloudIcon = icon.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1] || (icon ? 'non-cloudinary' : 'none');
    const cloudImg = image.match(/res\.cloudinary\.com\/([^/]+)\//)?.[1] || (image ? 'non-cloudinary' : 'none');
    console.log(`Category: ${c.name} (slug: ${c.slug})`);
    console.log(`  icon cloud: ${cloudIcon} -> ${icon.substring(0, 80)}`);
    console.log(`  image cloud: ${cloudImg} -> ${image.substring(0, 80)}`);
    console.log('');
  });

  mongoose.disconnect();
}).catch(e => console.error(e));
