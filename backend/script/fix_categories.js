require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

// Categories to KEEP (Elecmoon-relevant only)
const KEEP_IDS = [
  "69afca65973569345c419afe", // BATTERY BALANCERS
  "69aff18fc39dd734e46b2fca", // BATTERY POWER PACKS
  "69b262fedf8a1611e8ec10a6", // BMS BATTERY PROTECTION SOLUTION
  "69c77e6687ee0f2814c71e4c", // Lithium Ion Battery Cell
  "69f89690b73dc100134cd144", // Wire
  "6a061b8bb73dc100134ce58a", // DALY BMS NMC
  "6a061bb7b73dc100134ce590", // DALY BMS LFP
  "6a061d8db73dc100134ce596", // DALY SMART BMS
  "6a061db5b73dc100134ce59c", // DALY SMART BMS LFP
  "6a061e0db73dc100134ce5a2", // JBD BMS
  "6a061e4cb73dc100134ce5a9", // DALY BMS
  "6a061f86b73dc100134ce5de", // JBD NMC BMS
  "6a061fa9b73dc100134ce5e4", // JBD BMS LFP
  "6a061fdcb73dc100134ce5eb", // JBD SMART BMS NMC
  "6a062004b73dc100134ce5ef", // JBD SMART BMS LFP
  "632aca2b4d87ff2494210be8", // NICKLE STRIPS
  "632aca6d4d87ff2494210c24", // POWER CONNECTORS
  "632aca0b4d87ff2494210bc4", // SILICON WIRE
];

// Slug generator
const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getName = (c) => {
  if (!c.name) return "category";
  return c.name.en || c.name.hi || Object.values(c.name)[0] || "category";
};

(async () => {
  await connectDB();

  const all = await Category.find({}).lean();
  const keepSet = new Set(KEEP_IDS);
  const toDelete = all.filter((c) => !keepSet.has(c._id.toString()));
  const toKeep = all.filter((c) => keepSet.has(c._id.toString()));

  console.log("=== CATEGORIES TO DELETE (" + toDelete.length + ") ===");
  toDelete.forEach((c) => console.log(" - DELETE:", getName(c)));

  console.log("\n=== CATEGORIES TO KEEP & SLUG (" + toKeep.length + ") ===");
  for (const cat of toKeep) {
    const name = getName(cat);
    const slug = toSlug(name);
    console.log(" -", name, "→ slug:", slug);
    await Category.updateOne({ _id: cat._id }, { $set: { slug } });
  }

  // Delete irrelevant categories
  const deleteIds = toDelete.map((c) => c._id);
  await Category.deleteMany({ _id: { $in: deleteIds } });
  console.log("\n✅ Deleted", deleteIds.length, "irrelevant categories");

  // Remove deleted category IDs from product.categories arrays
  const pullResult = await Product.updateMany(
    {},
    { $pull: { categories: { $in: deleteIds } } }
  );
  console.log("✅ Cleaned up deleted category IDs from", pullResult.modifiedCount, "products");

  // Also set category field to null if it was a deleted one
  await Product.updateMany(
    { category: { $in: deleteIds } },
    { $set: { category: null } }
  );

  // Verify
  console.log("\n=== FINAL CATEGORIES ===");
  const final = await Category.find({}).lean();
  final.forEach((c) => console.log(" -", getName(c), "| slug:", c.slug));

  process.exit();
})();
