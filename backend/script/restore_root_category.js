require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");

const run = async () => {
  await connectDB();
  const rootId = "62c827b5a427b63741da9175";

  // Let's check parentId values for all categories in detail
  const allCats = await Category.find({}).lean();
  console.log("Categories in DB:", allCats.length);

  let updatedCount = 0;
  for (const cat of allCats) {
    if (cat.parentId === rootId || cat.parentId === undefined || cat.parentId === null) {
      const res = await Category.updateOne(
        { _id: cat._id },
        { $unset: { parentId: 1, parentName: 1 } }
      );
      if (res.modifiedCount > 0) {
        updatedCount++;
        console.log(`Unset parentId/parentName for: [${cat.name?.en || Object.values(cat.name || {})[0]}]`);
      }
    }
  }

  console.log("Total updated categories:", updatedCount);
  process.exit();
};

run();
