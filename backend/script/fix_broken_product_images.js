require("dotenv").config();
const { connectDB } = require("../config/db");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ARTIFACTS_DIR = "C:\\Users\\drist\\.gemini\\antigravity-ide\\brain\\2160bc2f-b096-469f-8251-600608ff49d1";
const path = require("path");

const fixBrokenProducts = async () => {
  await connectDB();

  // IDs of test/dummy products with broken images - we'll just clear their images
  // since they're test data with garbage names
  const DUMMY_PRODUCT_IDS = [
    "69afe69c6d763e22e81daa76", // jhgjgj
    "69aff1eac39dd734e46b2ff1", // wdsadsad
    "69b263a9df8a1611e8ec10b6", // tranfomer
    "69b3b755a2b7ae47a8643fe1", // Transformer testing
    "69b93bd432953536f4ddd64d", // ffgf
    "69d0ba4e613ecc440c819e2f", // Mobile
  ];

  // Real product - Lithium Ion Battery Cell - needs real image
  const LITHIUM_PRODUCT_ID = "6a06183bb73dc100134ce499";

  console.log("=== FIXING BROKEN PRODUCT IMAGES ===\n");

  // 1. Clear images from dummy test products (they're hidden/draft anyway)
  console.log("Clearing images from test/dummy products...");
  for (const id of DUMMY_PRODUCT_IDS) {
    const prod = await Product.findById(id).lean();
    if (!prod) { console.log(`  Not found: ${id}`); continue; }
    const status = prod.status;
    const title = prod.title?.en || Object.values(prod.title || {})[0] || id;
    console.log(`  - "${title}" (status: ${status}) -> clearing broken images`);
    await Product.findByIdAndUpdate(id, { image: [] });
  }
  console.log("  ✅ Done clearing dummy product images\n");

  // 2. Upload a placeholder image for the real Lithium Cell product
  // We use the battery balancers icon as a placeholder since lithium cells are battery-type
  const lithumIconPath = path.join(ARTIFACTS_DIR, "cat_battery_power_packs_1781165422287.png");
  const fs = require("fs");

  console.log("Uploading placeholder for Lithium Ion Battery Cell product...");
  
  if (!fs.existsSync(lithumIconPath)) {
    console.log("  ❌ Local image not found at:", lithumIconPath);
    console.log("  Leaving images empty for now - please re-upload via admin panel");
  } else {
    try {
      // Upload same image 3 times as placeholder (different angles would be ideal but quota exhausted)
      const uploads = [];
      for (let i = 0; i < 3; i++) {
        const result = await cloudinary.uploader.upload(lithumIconPath, {
          folder: "product",
          public_id: `lithium-cell-placeholder-${i + 1}`,
          overwrite: true,
        });
        uploads.push(result.secure_url);
        console.log(`  ✅ Placeholder ${i + 1}: ${result.secure_url.substring(0, 70)}`);
      }
      await Product.findByIdAndUpdate(LITHIUM_PRODUCT_ID, { image: uploads });
      console.log("  ✅ Lithium product image updated in DB");
    } catch (e) {
      console.log("  ❌ Upload failed:", e.message);
    }
  }

  console.log("\n=== DONE ===");
  process.exit();
};

fixBrokenProducts().catch(e => { console.error(e); process.exit(1); });
