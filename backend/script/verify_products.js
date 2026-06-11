require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const getTitle = p => {
  if (!p.title) return "(no title)";
  return (p.title.en || p.title.hi || Object.values(p.title)[0] || "(no title)").substring(0, 70);
};

const DUMMY_IDS = [
  "69afe69c6d763e22e81daa76",
  "69aff1eac39dd734e46b2ff1",
  "69b263a9df8a1611e8ec10b6",
  "69b3b755a2b7ae47a8643fe1",
  "69b93bd432953536f4ddd64d",
  "69d0ba4e613ecc440c819e2f",
];

(async () => {
  await connectDB();
  const popular = await Product.find({ type: "popular", status: "show" }).lean();
  const trending = await Product.find({ type: "trending", status: "show" }).lean();
  const newProds = await Product.find({ type: "new", status: "show" }).lean();
  const featured = await Product.find({ tag: "featured", status: "show" }).lean();
  const dummies = await Product.find({ _id: { $in: DUMMY_IDS } }).lean();

  console.log("=== FINAL STATE ===");
  console.log("Popular:", popular.length);
  popular.forEach(p => console.log("  •", getTitle(p)));
  console.log("Trending:", trending.length);
  trending.forEach(p => console.log("  •", getTitle(p)));
  console.log("New:", newProds.length);
  newProds.forEach(p => console.log("  •", getTitle(p)));
  console.log("Featured:", featured.length);
  featured.forEach(p => console.log("  •", getTitle(p)));
  console.log("\n=== DUMMY PRODUCTS (should all be hide) ===");
  dummies.forEach(p => console.log("  •", getTitle(p), "| status:", p.status));
  process.exit();
})();
