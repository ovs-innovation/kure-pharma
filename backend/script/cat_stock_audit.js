require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");

const getTitle = (p) => {
  if (!p.name) return "(no name)";
  return p.name.en || p.name.hi || Object.values(p.name)[0] || "(no name)";
};

(async () => {
  await connectDB();

  // 1. All categories
  const cats = await Category.find({}).lean();
  console.log("=== CATEGORIES (" + cats.length + ") ===");
  cats.forEach((c) =>
    console.log(" -", c._id.toString(), "|", getTitle(c), "| slug:", c.slug)
  );

  // 2. How many showing products have categories assigned
  const allShow = await Product.find({ status: "show" }).lean();
  const withCat = allShow.filter(
    (p) =>
      (p.category && p.category !== null) ||
      (p.categories && p.categories.length > 0)
  );
  const noCat = allShow.filter(
    (p) =>
      !p.category &&
      (!p.categories || p.categories.length === 0)
  );
  console.log("\n=== CATEGORY LINKAGE ===");
  console.log("Show products WITH category:", withCat.length);
  console.log("Show products WITHOUT category:", noCat.length);

  // 3. Stock info
  const tracked = allShow.filter((p) => p.trackInventory === true);
  const inStock = tracked.filter((p) => p.stock > 0);
  const outOfStock = tracked.filter((p) => !p.stock || p.stock < 1);
  const notTracked = allShow.filter((p) => !p.trackInventory);
  console.log("\n=== STOCK INFO ===");
  console.log("trackInventory = true:", tracked.length);
  console.log("  In Stock (stock > 0):", inStock.length);
  console.log("  Out of Stock (stock = 0):", outOfStock.length);
  console.log("trackInventory = false (always available):", notTracked.length);

  // 4. Sample product fields
  const sample = allShow[0];
  console.log("\n=== SAMPLE PRODUCT FIELDS ===");
  console.log("name:", sample && sample.title ? JSON.stringify(sample.title).substring(0, 60) : "N/A");
  console.log("category:", sample.category);
  console.log("categories:", JSON.stringify(sample.categories));
  console.log("stock:", sample.stock);
  console.log("trackInventory:", sample.trackInventory);

  // 5. Products per category (by categories array)
  console.log("\n=== PRODUCTS PER CATEGORY ===");
  const catMap = {};
  cats.forEach((c) => { catMap[c._id.toString()] = getTitle(c); });
  const catCount = {};
  allShow.forEach((p) => {
    (p.categories || []).forEach((cid) => {
      const key = cid.toString();
      catCount[key] = (catCount[key] || 0) + 1;
    });
  });
  if (Object.keys(catCount).length === 0) {
    console.log("NO products linked to any category!");
  } else {
    Object.entries(catCount).forEach(([cid, count]) => {
      console.log(" -", catMap[cid] || cid, ":", count, "products");
    });
  }

  process.exit();
})();
