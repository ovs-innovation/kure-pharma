require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

const printDhProducts = async () => {
  await connectDB();
  const products = await Product.find({}).lean();
  products.forEach(p => {
    if (p.image && p.image.length > 0) {
      const hasDh = p.image.some(img => img.includes("dhqcwkpzp"));
      if (hasDh) {
        const title = p.title?.en || Object.values(p.title || {})[0];
        console.log(`- Product: ${title} | Images: ${JSON.stringify(p.image)}`);
      }
    }
  });
  process.exit();
};

printDhProducts();
