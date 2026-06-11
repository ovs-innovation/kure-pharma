require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const auditLnk = async () => {
  await connectDB();
  const prods = await Product.find({ status: "show" }).lean();
  const cats = await Category.find({}).lean();
  const catMap = {};
  cats.forEach(c => {
    catMap[c._id.toString()] = c.name?.en || Object.values(c.name || {})[0];
  });

  const catCounts = {};
  prods.forEach(p => {
    if (p.category) {
      const cid = p.category.toString();
      catCounts[cid] = (catCounts[cid] || 0) + 1;
    }
  });

  console.log("=== PRODUCT COUNT BY CATEGORY ===");
  Object.entries(catCounts).forEach(([cid, count]) => {
    console.log(`- ${catMap[cid] || cid} (${cid}): ${count} products`);
  });

  process.exit();
};

auditLnk();
