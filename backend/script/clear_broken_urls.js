/**
 * Clear broken dhqcwkpzp icon URLs from categories.
 * Since the dhqcwkpzp account is permanently disabled, these URLs
 * will never work. Clearing them shows no icon (clean) instead of
 * a broken image placeholder.
 * 
 * The user will re-upload via Admin Panel → Categories.
 */

require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const run = async () => {
  await connectDB();

  console.log("=== CLEARING BROKEN dhqcwkpzp URLS ===\n");

  // Clear broken category icons
  const cats = await Category.find({}).lean();
  let catCleared = 0;

  for (const cat of cats) {
    if (!cat.icon || !cat.icon.includes("dhqcwkpzp")) continue;
    const name = cat.name?.en || Object.values(cat.name || {})[0] || cat.slug;
    await Category.findByIdAndUpdate(cat._id, { icon: "" });
    console.log(`  ✅ Cleared icon: ${name} (${cat.slug})`);
    catCleared++;
  }

  // Clear broken product images (only for the lithium cell product which had them)
  const prods = await Product.find({}).lean();
  let prodCleared = 0;

  for (const prod of prods) {
    if (!prod.image || !prod.image.some(u => u.includes("dhqcwkpzp"))) continue;
    const title = prod.title?.en || Object.values(prod.title || {})[0] || "?";
    // Keep only working dkeceuhqb images, remove broken ones
    const working = prod.image.filter(u => !u.includes("dhqcwkpzp"));
    await Product.findByIdAndUpdate(prod._id, { image: working });
    console.log(`  ✅ Cleared broken images from: ${title.substring(0, 60)}`);
    console.log(`     Kept ${working.length} working images, removed ${prod.image.length - working.length} broken`);
    prodCleared++;
  }

  console.log(`\nCategories cleared: ${catCleared}`);
  console.log(`Products fixed: ${prodCleared}`);
  console.log("\n✅ No more broken image URLs in database");
  console.log("✅ Re-upload category icons from Admin Panel → Categories");

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
