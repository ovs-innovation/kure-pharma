require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
(async () => {
  await connectDB();
  const cats = await Category.find({}).lean();
  const getName = (c) => {
    if (!c.name) return "(no name)";
    return c.name.en || c.name.hi || Object.values(c.name)[0] || "(no name)";
  };
  console.log("=== CATEGORY STATUS ===");
  cats.forEach((c) =>
    console.log(" -", getName(c), "| status:", c.status, "| slug:", c.slug)
  );
  const noStatus = cats.filter((c) => !c.status || c.status !== "show");
  console.log("\nCategories NOT showing:", noStatus.length);

  // Fix: set all to show
  if (noStatus.length > 0) {
    await Category.updateMany({ status: { $ne: "show" } }, { $set: { status: "show" } });
    console.log("✅ Fixed: set all categories to status=show");
  }
  process.exit();
})();
