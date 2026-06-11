require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generated images in artifacts dir - map to local paths
const ARTIFACTS_DIR = "C:\\Users\\drist\\.gemini\\antigravity-ide\\brain\\2160bc2f-b096-469f-8251-600608ff49d1";

// Category slug -> local image path
const ICON_MAP = {
  "silicon-wire": path.join(ARTIFACTS_DIR, "cat_silicon_wire_1781165360487.png"),
  "power-connectors": path.join(ARTIFACTS_DIR, "cat_power_connectors_1781165372914.png"),
  "nickle-strips": path.join(ARTIFACTS_DIR, "cat_nickle_strips_1781165386454.png"),
  "battery-balancers": path.join(ARTIFACTS_DIR, "cat_battery_balancers_1781165409302.png"),
  "battery-power-packs": path.join(ARTIFACTS_DIR, "cat_battery_power_packs_1781165422287.png"),
  "bms-battery-protection-solution": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
  // BMS-related categories reuse the BMS icon
  "lithium-ion-battery-cell": path.join(ARTIFACTS_DIR, "cat_battery_balancers_1781165409302.png"), // battery-like
  "daly-bms-nmc": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
  "daly-smart-bms": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
  "jbd-bms": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
  "jbd-nmc-bms": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
  "jbd-smart-bms-lfp": path.join(ARTIFACTS_DIR, "cat_bms_1781165435204.png"),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const migrateIcons = async () => {
  await connectDB();

  console.log("=== UPLOADING NEW CATEGORY ICONS TO dkeceuhqb ===\n");

  const categories = await Category.find({}).lean();
  let fixed = 0;
  let skipped = 0;

  for (const cat of categories) {
    const catName = cat.name?.en || Object.values(cat.name || {})[0] || cat.name;
    const slug = cat.slug;

    // Only process categories with broken icons
    if (!cat.icon || !cat.icon.includes("dhqcwkpzp")) {
      skipped++;
      continue;
    }

    const localPath = ICON_MAP[slug];
    if (!localPath) {
      console.log(`⚠️  No replacement icon for: ${catName} (${slug}) - skipping`);
      skipped++;
      continue;
    }

    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  File not found: ${localPath} - skipping ${catName}`);
      skipped++;
      continue;
    }

    console.log(`Uploading icon for: ${catName} (${slug})`);
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: "category",
        public_id: `icon-${slug}`,
        overwrite: true,
        resource_type: "image",
      });

      await Category.findByIdAndUpdate(cat._id, { icon: result.secure_url });
      console.log(`  ✅ Uploaded: ${result.secure_url.substring(0, 70)}`);
      fixed++;
    } catch (e) {
      console.log(`  ❌ Error: ${e.message}`);
    }

    await sleep(300);
  }

  console.log("\n=== DONE ===");
  console.log(`Fixed: ${fixed} categories`);
  console.log(`Skipped: ${skipped} categories`);

  process.exit();
};

migrateIcons().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
