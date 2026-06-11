require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");

const addMissingCategory = async () => {
  await connectDB();
  const id = "6a061298b73dc100134ce472";
  const exists = await Category.findById(id);
  if (!exists) {
    console.log("Category 6a061298b73dc100134ce472 not found. Re-creating...");
    const missing = new Category({
      _id: id,
      name: { en: "Lithium Ion Battery Cell" },
      description: { en: "High quality rechargeable battery cells" },
      status: "show",
      slug: "lithium-ion-battery-cell",
    });
    await missing.save();
    console.log("Category created successfully!");
  } else {
    console.log("Category already exists. Status:", exists.status);
  }
  process.exit();
};

addMissingCategory();
