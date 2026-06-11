require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

const listBrokenProducts = async () => {
  await connectDB();

  const products = await Product.find({}).lean();
  let count = 0;

  console.log("=== PRODUCTS WITH BROKEN dhqcwkpzp IMAGES ===\n");
  for (const p of products) {
    if (!p.image || p.image.length === 0) continue;
    const broken = p.image.filter(img => img.includes("dhqcwkpzp"));
    if (broken.length > 0) {
      const title = p.title?.en || Object.values(p.title || {})[0] || "";
      console.log(`Product: ${title.substring(0, 70)}`);
      console.log(`  SKU: ${p.sku}`);
      console.log(`  ID: ${p._id}`);
      console.log(`  Category: ${p.categories}`);
      console.log(`  Total images: ${p.image.length}, broken: ${broken.length}`);
      broken.forEach(u => console.log(`  - ${u.substring(0, 80)}`));
      console.log("");
      count++;
    }
  }

  console.log(`Total affected products: ${count}`);
  process.exit();
};

listBrokenProducts().catch(e => { console.error(e); process.exit(1); });
