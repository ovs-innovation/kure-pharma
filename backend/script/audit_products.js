require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");

const auditProducts = async () => {
  await connectDB();
  const products = await Product.find({ status: "show" }).lean();
  console.log("Showing products count:", products.length);

  // Print title of products that have category = 6a061298b73dc100134ce472
  const targetProds = products.filter(p => p.category?.toString() === "6a061298b73dc100134ce472");
  console.log("Products with category 6a061298b73dc100134ce472 count:", targetProds.length);
  targetProds.slice(0, 10).forEach(p => {
    const title = p.title?.en || Object.values(p.title || {})[0];
    console.log(`- Product: ${title} (ID: ${p._id.toString()})`);
  });

  process.exit();
};

auditProducts();
