require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const mergeCategories = async () => {
  await connectDB();

  // Find all categories
  const categories = await Category.find({}).lean();
  console.log("Existing categories:", categories.length);

  // Print all categories matching "lithium ion battery cell" (case insensitive)
  const matches = categories.filter(c => {
    const name = c.name?.en || Object.values(c.name || {})[0] || "";
    return name.toLowerCase().includes("lithium ion battery cell");
  });

  console.log("\nFound matches:", matches.length);
  matches.forEach(m => {
    const name = m.name?.en || Object.values(m.name || {})[0] || "";
    console.log(`- ID: ${m._id.toString()} | Name: ${name} | Slug: ${m.slug} | ParentId: ${m.parentId}`);
  });

  if (matches.length < 2) {
    console.log("Less than 2 matching categories. Nothing to merge.");
    process.exit();
  }

  // We want to keep one category and merge the other into it.
  // The first one is '69c77e6687ee0f2814c71e4c' (Lithium Ion Battery Cell)
  // The second one is '6a061298b73dc100134ce472' (Lithium Ion Battery Cell)
  // Let's keep '69c77e6687ee0f2814c71e4c' as the main one, and point all products referencing the second one to this kept ID.
  const keptId = "69c77e6687ee0f2814c71e4c";
  const duplicateId = "6a061298b73dc100134ce472";

  console.log(`\nMerging duplicate category ${duplicateId} into kept category ${keptId}...`);

  // Update products having category = duplicateId to keptId
  const updateProductCategory = await Product.updateMany(
    { category: duplicateId },
    { $set: { category: keptId } }
  );
  console.log(`Updated category field in ${updateProductCategory.modifiedCount} products.`);

  // Update products having categories array containing duplicateId to contain keptId instead
  // First pull duplicateId from categories array
  const pullRes = await Product.updateMany(
    { categories: duplicateId },
    { $pull: { categories: duplicateId } }
  );
  console.log(`Pulled duplicate category from categories array in ${pullRes.modifiedCount} products.`);

  // Then push keptId if not already present
  const productsToAddToKept = await Product.find({
    status: "show",
    categories: { $ne: keptId }
  });

  let pushedCount = 0;
  for (const product of productsToAddToKept) {
    // If it is supposed to be in kept category or category matches keptId
    if (product.category?.toString() === keptId) {
      product.categories.push(keptId);
      await product.save();
      pushedCount++;
    }
  }
  console.log(`Pushed kept category to categories array in ${pushedCount} products.`);

  // Delete the duplicate category from database
  const deleteRes = await Category.deleteOne({ _id: duplicateId });
  console.log(`Deleted duplicate category from DB. Deleted count: ${deleteRes.deletedCount}`);

  process.exit();
};

mergeCategories();
