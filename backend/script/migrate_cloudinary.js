require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// Configure active cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // dkeceuhqb
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Re-upload image from any URL to dkeceuhqb
const reupload = async (oldUrl, folder) => {
  try {
    console.log(`  Uploading: ${oldUrl.substring(0, 70)}...`);
    const result = await cloudinary.uploader.upload(oldUrl, {
      folder: folder,
      resource_type: "image",
    });
    console.log(`  ✅ New URL: ${result.secure_url.substring(0, 70)}`);
    return result.secure_url;
  } catch (err) {
    console.log(`  ❌ Failed: ${err.message}`);
    return null;
  }
};

const migrateBrokenImages = async () => {
  await connectDB();

  console.log("====================================");
  console.log("CLOUDINARY IMAGE MIGRATION");
  console.log("Source: dhqcwkpzp (broken/401)");
  console.log("Target: dkeceuhqb (active)");
  console.log("====================================\n");

  // -------- CATEGORIES --------
  const categories = await Category.find({}).lean();
  let catFixed = 0;

  console.log(`Found ${categories.length} categories to check...\n`);

  for (const cat of categories) {
    if (cat.icon && cat.icon.includes("dhqcwkpzp")) {
      const catName = cat.name?.en || Object.values(cat.name || {})[0] || cat.name;
      console.log(`Category: ${catName}`);
      const newUrl = await reupload(cat.icon, "category");
      if (newUrl) {
        await Category.findByIdAndUpdate(cat._id, { icon: newUrl });
        catFixed++;
        console.log(`  ✅ Category icon updated in DB\n`);
      } else {
        console.log(`  ⚠️  Could not migrate icon for ${catName}\n`);
      }
      await sleep(500); // rate limit
    }
  }

  // -------- PRODUCTS --------
  const products = await Product.find({}).lean();
  let prodFixed = 0;

  console.log(`\nFound ${products.length} products to check...\n`);

  for (const prod of products) {
    if (prod.image && prod.image.length > 0) {
      const hasBroken = prod.image.some((img) => img.includes("dhqcwkpzp"));
      if (!hasBroken) continue;

      const prodTitle = prod.title?.en || Object.values(prod.title || {})[0] || prod.title;
      console.log(`Product: ${prodTitle?.substring(0, 60)}`);

      const newImages = [];
      for (const imgUrl of prod.image) {
        if (imgUrl.includes("dhqcwkpzp")) {
          const newUrl = await reupload(imgUrl, "product");
          newImages.push(newUrl || imgUrl); // fallback to old if failed
          await sleep(500);
        } else {
          newImages.push(imgUrl); // keep working ones
        }
      }

      await Product.findByIdAndUpdate(prod._id, { image: newImages });
      prodFixed++;
      console.log(`  ✅ Product images updated in DB\n`);
    }
  }

  console.log("\n====================================");
  console.log(`MIGRATION COMPLETE`);
  console.log(`Categories fixed: ${catFixed}`);
  console.log(`Products fixed: ${prodFixed}`);
  console.log("====================================");

  process.exit();
};

migrateBrokenImages().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
