require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const auditCloudNames = async () => {
  await connectDB();

  const categories = await Category.find({}).lean();
  let catDh = 0, catDk = 0, catOther = 0;
  categories.forEach(c => {
    if (c.icon) {
      if (c.icon.includes("dhqcwkpzp")) catDh++;
      else if (c.icon.includes("dkeceuhqb")) catDk++;
      else catOther++;
    }
  });

  const products = await Product.find({}).lean();
  let prodDh = 0, prodDk = 0, prodOther = 0;
  products.forEach(p => {
    if (p.image && p.image.length > 0) {
      p.image.forEach(img => {
        if (img.includes("dhqcwkpzp")) prodDh++;
        else if (img.includes("dkeceuhqb")) prodDk++;
        else prodOther++;
      });
    }
  });

  console.log("=== CLOUD NAMES AUDIT ===");
  console.log("Categories with dhqcwkpzp:", catDh);
  console.log("Categories with dkeceuhqb:", catDk);
  console.log("Categories with other/none:", catOther);
  console.log("Product images with dhqcwkpzp:", prodDh);
  console.log("Product images with dkeceuhqb:", prodDk);
  console.log("Product images with other/none:", prodOther);

  process.exit();
};

auditCloudNames();
