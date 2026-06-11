require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const checkImages = async () => {
  await connectDB();

  console.log("=== CATEGORY ICONS ===");
  const categories = await Category.find({}).lean();
  categories.forEach(c => {
    const name = c.name?.en || Object.values(c.name || {})[0];
    console.log(`- Category: ${name} | Icon: "${c.icon}" | Slug: ${c.slug}`);
  });

  console.log("\n=== PRODUCT IMAGES (First 10 showing) ===");
  const products = await Product.find({ status: "show" }).limit(10).lean();
  products.forEach(p => {
    const title = p.title?.en || Object.values(p.title || {})[0];
    console.log(`- Product: ${title} | Images: ${JSON.stringify(p.image)} | SKU: ${p.sku}`);
  });

  process.exit();
};

checkImages();
