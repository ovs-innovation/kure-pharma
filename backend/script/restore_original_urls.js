/**
 * RESTORE ORIGINAL URLs
 * 
 * Reverts all category icons and product images back to the original
 * dhqcwkpzp URLs that were uploaded by the user from the admin panel.
 * These are the ONLY legitimate business images.
 */

require("dotenv").config();
const { connectDB } = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

// ORIGINAL URLs as captured from the DB before any modifications
// These were uploaded by the user from the admin panel
const ORIGINAL_CATEGORY_ICONS = {
  "silicon-wire":               "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778682206/category/ChatGPTImageMay13%2C2026%2C07_52_56PM.png",
  "power-connectors":           "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778681323/category/ChatGPTImageMay13%2C2026%2C07_38_18PM.png",
  "nickle-strips":              "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778681808/category/ChatGPTImageMay13%2C2026%2C07_46_34PM.png",
  "battery-balancers":          "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778680673/category/ChatGPTImageMay13%2C2026%2C07_27_22PM.png",
  "battery-power-packs":        "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778678836/category/ChatGPTImageMay13%2C2026%2C06_54_41PM.png",
  "bms-battery-protection-solution": "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778677387/category/ChatGPTImageMay13%2C2026%2C06_30_21PM.png",
  "lithium-ion-battery-cell":   "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778675596/category/ChatGPTImageMay13%2C2026%2C06_02_36PM.png",
  "daly-bms-nmc":               "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778785147/category/ChatGPTImageMay15%2C2026%2C12_28_22AM.png",
  "daly-smart-bms":             "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778785147/category/ChatGPTImageMay15%2C2026%2C12_28_22AM.png",
  "jbd-bms":                    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778785792/category/ChatGPTImageMay15%2C2026%2C12_30_38AM.png",
  "jbd-nmc-bms":                "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778786041/category/ChatGPTImageMay15%2C2026%2C12_30_38AM1.png",
  "jbd-smart-bms-lfp":          "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778786304/category/ChatGPTImageMay15%2C2026%2C12_30_38AM2.png",
  // These had empty icons originally - leave as is
  // "wire":              "",
  // "daly-smart-bms-lfp": "",
  // "daly-bms": "",
  // "jbd-bms-lfp": "",
  // "jbd-smart-bms-nmc": "",
};

// ORIGINAL product images for Lithium Ion Battery Cell product
// (the 5 images that were on dhqcwkpzp before we cleared them)
const ORIGINAL_LITHIUM_PRODUCT = {
  id: "6a06183bb73dc100134ce499",
  images: [
    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%281%29.jpg",
    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%2810%29.jpg",
    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%286%29.jpg",
    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%287%29.jpg",
    "https://res.cloudinary.com/dhqcwkpzp/image/upload/v1778784171/product/BlackandWhiteLuxuryCalligraphyPhotographyLogo%289%29.jpg",
  ]
};

const run = async () => {
  await connectDB();

  console.log("==============================================");
  console.log("RESTORING ORIGINAL ADMIN-UPLOADED IMAGE URLs");
  console.log("==============================================\n");

  // Restore category icons
  const cats = await Category.find({}).lean();
  let restored = 0;

  for (const cat of cats) {
    const slug = cat.slug;
    const originalUrl = ORIGINAL_CATEGORY_ICONS[slug];
    if (!originalUrl) continue; // skip categories with no original icon

    const current = cat.icon || "";
    if (current === originalUrl) {
      console.log(`  ✓ Already correct: ${slug}`);
      continue;
    }

    await Category.findByIdAndUpdate(cat._id, { icon: originalUrl });
    const catName = cat.name?.en || Object.values(cat.name || {})[0] || slug;
    console.log(`  ↩ Restored: ${catName}`);
    console.log(`     FROM: ${current.substring(0, 70)}`);
    console.log(`     TO:   ${originalUrl.substring(0, 70)}`);
    restored++;
  }

  console.log(`\nCategories restored: ${restored}`);

  // Restore original lithium product images
  const lithProd = await Product.findById(ORIGINAL_LITHIUM_PRODUCT.id).lean();
  if (lithProd) {
    await Product.findByIdAndUpdate(ORIGINAL_LITHIUM_PRODUCT.id, {
      image: ORIGINAL_LITHIUM_PRODUCT.images
    });
    console.log(`\n  ↩ Restored Lithium Ion Battery Cell product images (5 original URLs)`);
  }

  console.log("\n==============================================");
  console.log("RESTORE COMPLETE");
  console.log("All URLs now point to the original dhqcwkpzp images.");
  console.log("These are the exact URLs the user uploaded from the admin panel.");
  console.log("==============================================");

  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
